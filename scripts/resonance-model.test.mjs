import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchesAudience, volumeForView, balanceLabel, balanceScore, unitCounts } from '../data/resonance-model.ts';
const { topics } = JSON.parse(readFileSync(new URL('../data/resonance-review.json', import.meta.url), 'utf8'));
const topic = id => topics.find(item => item.id === id);
test('Both requires evidence from each audience, not an averaged sentiment', () => {
  assert.equal(matchesAudience(topic('continuity'), 'both'), true);
  assert.equal(matchesAudience(topic('bridges'), 'both'), true);
  assert.equal(matchesAudience(topic('patch'), 'media'), false);
  assert.equal(matchesAudience(topic('commitment'), 'fans'), true);
  assert.equal(matchesAudience(topic('broadcast'), 'both'), false);
});
test('Reported media statements remain unscored, not neutral', () => {
  assert.equal(balanceLabel(topic('bridges').media), 'Unscored');
  assert.equal(balanceScore(topic('bridges').media), 'No scored opinion');
  assert.equal(topic('bridges').media.count, 1);
  assert.equal(topic('bridges').media.scoredCount, 0);
});
test('Expanded season reactions retain positive and negative counts', () => {
  assert.equal(balanceLabel(topic('outlook').fans), 'Positive');
  assert.deepEqual(unitCounts(topic('outlook').fans), { positive: 10, negative: 5, neutral: 0 });
  assert.equal(topic('outlook').fans.count, 15);
});
test('A zero average with opposing comments remains mixed', () => {
  assert.equal(balanceLabel(topic('hunger').fans), 'Mixed');
  assert.deepEqual(unitCounts(topic('hunger').fans), { positive: 1, negative: 1, neutral: 0 });
});
test('Volume in filtered views uses the corresponding audience, not an aggregate', () => {
  assert.equal(volumeForView(topic('outlook'), 'fans'), 'high');
  assert.equal(volumeForView(topic('outlook'), 'media'), 'medium');
  assert.equal(volumeForView(topic('outlook'), 'all'), 'high');
  assert.equal(volumeForView(topic('continuity'), 'fans'), 'low');
});
