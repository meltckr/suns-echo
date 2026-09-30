import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const json = async path => JSON.parse(await readFile(path, 'utf8'));
export const fanVolume = n => n >= 15 ? 'high' : n >= 5 ? 'medium' : n > 0 ? 'low' : 'none';
export function recodeFanEvidence(review, snapshots, coding) {
  const comments = new Map(snapshots.filter(source => source.kind === 'fans').flatMap(source => source.comments.map(comment => [comment.id, { comment, source }])));
  if (comments.size !== coding.comments.length || new Set(coding.comments.map(item => item.id)).size !== coding.comments.length) throw new Error('Coding must cover every distinct captured comment exactly once.');
  const topics = new Map(review.topics.map(topic => [topic.id, topic]));
  for (const topic of topics.values()) topic.fans.evidence = [];
  for (const row of coding.comments) {
    const match = comments.get(row.id);
    if (!match || (!row.topics.length && !row.exclusionReason) || (row.topics.length && row.exclusionReason)) throw new Error(`Missing comment or ambiguous coding/exclusion: ${row.id}`);
    const { comment, source } = match;
    const seen = new Set();
    for (const entry of row.topics) {
      if (!topics.has(entry.topicId) || seen.has(entry.topicId) || ![-1, 0, 1].includes(entry.code) || !entry.reason) throw new Error(`Invalid assignment: ${row.id}`);
      seen.add(entry.topicId);
      topics.get(entry.topicId).fans.evidence.push({ id: comment.id, unit: comment.id, sourceId: source.id, source: source.source, url: source.url, kind: 'fan reaction', quote: comment.text, code: entry.code, origin: source.collection === 'supplied' ? 'Supplied Instagram/Facebook comment' : 'Indexed Reddit comment; no platform comment ID', codingReason: entry.reason });
    }
  }
  for (const topic of topics.values()) {
    const evidence = topic.fans.evidence;
    const count = evidence.length;
    Object.assign(topic.fans, { count, scoredCount: count, score: count ? Number((evidence.reduce((sum, item) => sum + item.code, 0) / count).toFixed(3)) : null, volume: fanVolume(count) });
  }
  const coded = coding.comments.filter(row => row.topics.length).length;
  Object.assign(review.denominators, { codedFanComments: coded, uncodedFanComments: comments.size - coded });
  return review;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const reviewPath = 'data/resonance-review.json';
  const review = await json(reviewPath);
  recodeFanEvidence(review, await json('research/media-day-2026-09-28/resonance-review-source-texts.json'), await json('research/media-day-2026-09-28/resonance-expanded-coding.json'));
  await writeFile(reviewPath, JSON.stringify(review, null, 2) + '\n');
  console.log(`Recomputed ${review.topics.length} phrase groups from ${review.denominators.verbatimFanComments} captured fan texts: ${review.denominators.codedFanComments} coded, ${review.denominators.uncodedFanComments} excluded from topic scores.`);
}
