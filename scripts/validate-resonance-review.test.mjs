import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateResonanceReview } from './validate-resonance-review.mjs';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const original = read('../data/resonance-review.json');
const sources = read('../research/media-day-2026-09-28/resonance-review-source-texts.json');
const topic = (data, id) => data.topics.find((item) => item.id === id);

test('the collected review has reproducible counts and evidence', () => {
  assert.deepEqual(validateResonanceReview(original, sources), { topics: 12, articles: 5, verbatimComments: 25 });
});
test('rejects an invented quote', () => {
  const data = structuredClone(original);
  topic(data, 'bridges').fans.evidence[0].quote = 'A quote nobody supplied';
  assert.throws(() => validateResonanceReview(data, sources), /verbatim/);
});
test('ownership statement cannot masquerade as journalist sentiment', () => {
  const data = structuredClone(original);
  topic(data, 'commitment').media.evidence[0].code = 1;
  assert.throws(() => validateResonanceReview(data, sources), /cannot imply media opinion/);
});
test('missing reception cannot be presented as neutral', () => {
  const data = structuredClone(original);
  topic(data, 'commitment').fans.score = 0;
  assert.throws(() => validateResonanceReview(data, sources), /score must match/);
});
test('repeated excerpts cannot inflate article volume', () => {
  const data = structuredClone(original);
  topic(data, 'bridges').media.count = 3;
  assert.throws(() => validateResonanceReview(data, sources), /distinct-unit count/);
});
test('a paraphrased or truncated fan comment cannot enter the sample', () => {
  const data = structuredClone(original);
  topic(data, 'green-nash').fans.evidence[0].quote = 'made me smile';
  assert.throws(() => validateResonanceReview(data, sources), /entire supplied comment/);
});
