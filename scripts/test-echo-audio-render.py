#!/usr/bin/env python3
"""Deterministic PCM regressions; no model, network, voice reference, or API calls."""
import array
import hashlib
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('renderer', Path(__file__).with_name('echo-audio-render.py'))
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)
RATE = renderer.RATE


def pcm(*runs):
    result = array.array('h')
    for amplitude, seconds in runs:
        result.extend([amplitude] * round(seconds * RATE))
    return result


class FinishingTests(unittest.TestCase):
    def test_quiet_final_consonant_survives(self):
        # -60dB consonant was below the former samplewise -50dB cutoff.
        speech = pcm((1000, .2), (33, .08))
        output = renderer.finish_sentence(speech + pcm((0, 1)))
        self.assertEqual(output[:len(speech)], speech)
        self.assertEqual(len(output), len(speech) + round(.2 * RATE))

    def test_short_generation_gets_tail_instead_of_cut(self):
        speech = pcm((1000, .5))
        output = renderer.finish_sentence(speech)
        self.assertEqual(output[:len(speech)], speech)
        self.assertEqual(len(output), round(.7 * RATE))

    def test_internal_pause_and_onset_are_untouched(self):
        speech = pcm((0, .12), (1000, .2), (0, .65), (2000, .2))
        output = renderer.finish_sentence(speech + pcm((0, 1)))
        self.assertEqual(output[:len(speech)], speech)

    def test_sentence_and_paragraph_joins_never_overlap(self):
        first = renderer.finish_sentence(pcm((1000, .3)))
        second = renderer.finish_sentence(pcm((2000, .3)))
        third = renderer.finish_sentence(pcm((3000, .3)))
        joined, boundaries = renderer.join_sentences([first, second, third], [False, True, True])
        self.assertEqual([round(x['pauseSeconds'], 2) for x in boundaries], [.22, .4])
        self.assertEqual(joined, first + pcm((0, .02)) + second + pcm((0, .2)) + third)

    def test_existing_leading_silence_not_doubled(self):
        first = renderer.finish_sentence(pcm((1000, .3)))
        second = renderer.finish_sentence(pcm((0, .1), (2000, .3)))
        joined, boundaries = renderer.join_sentences([first, second], [False, True])
        self.assertEqual(joined, first + second)
        self.assertEqual(boundaries[0]['pauseSeconds'], .3)

    def test_excessive_boundary_fails_instead_of_collapsing(self):
        first = renderer.finish_sentence(pcm((1000, .3)))
        second = renderer.finish_sentence(pcm((0, .7), (2000, .3)))
        with self.assertRaisesRegex(ValueError, 'Unexpected boundary pause'):
            renderer.join_sentences([first, second], [False, True])

    def test_silent_generation_fails(self):
        with self.assertRaisesRegex(ValueError, 'Silent sentence'):
            renderer.finish_sentence(pcm((0, 2)))

    def test_paragraph_mode_keeps_sentences_in_one_pass(self):
        text = 'Mat, look here. Another sentence.\n\nThe Valley Suns.\n\nDominate.\n'
        parts, ends = renderer.prepare_sentences(text, mode='paragraph')
        self.assertEqual(parts, ['Mat, look here. Another sentence.', 'The Valley Suns.', 'Dominate.'])
        self.assertEqual(ends, [True, True, True])
        with self.assertRaisesRegex(ValueError, 'Unknown generation mode'):
            renderer.prepare_sentences(text, mode='word')

    def test_paragraph_join_replaces_boundary_silence_only(self):
        first = pcm((0, .1), (1000, .2), (0, .6), (33, .08), (0, .9))
        second = pcm((0, .7), (2000, .3), (33, .08), (0, 1))
        result, joins = renderer.join_paragraphs([first, second])
        expected = pcm((0, .1), (1000, .2), (0, .6), (33, .08),
                       (0, .5), (2000, .3), (33, .08), (0, .2))
        self.assertEqual(result, expected)
        self.assertEqual(joins[0]['pauseSeconds'], .5)
        self.assertEqual(joins[0]['afterParagraph'], 0)
        with self.assertRaisesRegex(ValueError, 'exactly 0.5'):
            renderer.join_paragraphs([first, second], .4)

    def test_standalone_close_is_padded_without_clipping(self):
        close = pcm((2000, .5), (33, .08))
        result, joins = renderer.join_paragraphs([close])
        self.assertEqual(result, close + pcm((0, .2)))
        self.assertEqual(joins, [])

    def test_normalization_retries_from_pcm_and_reports_targets(self):
        stats = {'input_i': '-22', 'input_lra': '4', 'input_tp': '-6',
                 'input_thresh': '-32', 'target_offset': '0'}
        measurements = [stats, {'input_i': '-16.95', 'input_tp': '-2.4'},
                        stats, {'input_i': '-16.05', 'input_tp': '-1.6'}]
        base = ['ffmpeg', '-i', 'joined.s16']
        with patch.object(renderer, 'measure_loudness', side_effect=measurements) as measure, \
                patch.object(renderer, 'command') as encode:
            metadata = renderer.normalize_and_encode(base, Path('finished.mp3'))
        self.assertEqual(encode.call_count, 2)
        for call in encode.call_args_list:
            self.assertEqual(call.args[0][:len(base)], base)
            self.assertIn('dual_mono=false', call.args[0][call.args[0].index('-af') + 1])
        self.assertAlmostEqual(metadata['attempts'][1]['targetLufs'], -15.05)
        self.assertEqual(metadata['targetIntegratedLufs'], -16)
        self.assertEqual(metadata['truePeakCeilingDbtp'], -1.5)
        self.assertFalse(metadata['dualMono'])
        self.assertEqual(measure.call_count, 4)

    def test_pronunciation_binding_and_paragraphs(self):
        text = 'Oso Ighodaro spoke. One sentence.\n\nDominate.\n'
        config = {'transcriptSha256': hashlib.sha256(text.encode()).hexdigest(),
                  'replacements': [{'canonical': 'Ighodaro', 'spoken': 'Ig-uh-DAR-oh'}]}
        sentences, ends = renderer.prepare_sentences(text, config)
        self.assertEqual(sentences[0], 'Oso Ig-uh-DAR-oh spoke.')
        self.assertEqual(ends, [False, True, True])
        self.assertEqual(text, 'Oso Ighodaro spoke. One sentence.\n\nDominate.\n')
        with self.assertRaisesRegex(ValueError, 'SHA-256'):
            renderer.prepare_sentences(text + 'Changed.', config)
        config['replacements'][0]['canonical'] = 'Absent'
        with self.assertRaisesRegex(ValueError, 'invalid'):
            renderer.prepare_sentences(text, config)


if __name__ == '__main__':
    unittest.main()
