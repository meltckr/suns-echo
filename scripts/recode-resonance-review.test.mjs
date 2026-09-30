import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { recodeFanEvidence, fanVolume } from './recode-resonance-review.mjs';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const review = read('../data/resonance-review.json');
const sources = read('../research/media-day-2026-09-28/resonance-review-source-texts.json');
const coding = read('../research/media-day-2026-09-28/resonance-expanded-coding.json');
test('the complete fan scoring can be reproduced without additional retrieval or inference', () => {
  const computed = recodeFanEvidence(structuredClone(review), sources, coding);
  assert.deepEqual(computed.topics.map(topic => topic.fans), review.topics.map(topic => topic.fans));
  assert.equal(computed.denominators.codedFanComments, 103);
  assert.equal(computed.denominators.uncodedFanComments, 15);
});
test('each captured comment must have exactly one coding or exclusion record', () => {
  const bad = structuredClone(coding); bad.comments.pop();
  assert.throws(() => recodeFanEvidence(structuredClone(review), sources, bad), /every distinct captured comment/);
});
test('duplicate topic assignments cannot inflate fan volume', () => {
  const bad = structuredClone(coding);
  const row = bad.comments.find(item => item.topics.length);
  row.topics.push(row.topics[0]);
  assert.throws(() => recodeFanEvidence(structuredClone(review), sources, bad), /Invalid assignment/);
});
test('expanded fan volume boundaries are explicit', () => {
  assert.deepEqual([0, 1, 4, 5, 14, 15, 118].map(fanVolume), ['none','low','low','medium','medium','high','high']);
});
