import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const readJson = (relative) => JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8'));
const review = readJson('../data/resonance-review.json');
const snapshots = readJson('../research/media-day-2026-09-28/resonance-review-source-texts.json');
const themes = new Set(['Roster moves', 'Team identity', 'Player development', 'Ownership', 'Season outlook', 'Culture']);
const volume = (count, side) => side === 'fans' ? count >= 15 ? 'high' : count >= 5 ? 'medium' : count > 0 ? 'low' : 'none' : count >= 3 ? 'high' : count === 2 ? 'medium' : count === 1 ? 'low' : 'none';
const normalize = (text) => text.replace(/\s+/g, ' ').trim();

export function validateResonanceReview(data, rawSources) {
  const sources = new Map(rawSources.map((source) => [source.id, source]));
  assert.equal(sources.size, rawSources.length, 'Source IDs must be unique');
  const articles = rawSources.filter((source) => source.kind === 'media');
  const posts = rawSources.filter((source) => source.kind === 'fans');
  const comments = posts.flatMap(source => source.comments ?? []);
  const commentCount = comments.length;
  assert.equal(new Set(comments.map(comment => comment.id)).size, commentCount, 'Captured comment IDs must be unique');
  assert.equal(new Set(comments.map(comment => normalize(comment.text))).size, commentCount, 'Comment text must be deduplicated across sources');
  const supplied = posts.filter(source => source.collection === 'supplied').flatMap(source => source.comments);
  const indexed = posts.filter(source => source.collection === 'indexed').flatMap(source => source.comments);
  assert.equal(data.denominators.suppliedVerbatimComments, supplied.length);
  assert.equal(data.denominators.indexedFanComments, indexed.length);
  assert.equal(data.denominators.directApiFanComments, 0);
  assert.equal(data.denominators.fanThreads, posts.filter(source => source.collection === 'indexed').length);
  for (const source of posts) {
    assert.equal(source.comment_count, source.comments.length);
    for (const comment of source.comments) {
      assert.equal(comment.sourceUrl, source.url);
      assert.ok(['2026-09-28', '2026-09-29'].includes(comment.date));
      assert.ok(source.text.includes(comment.text), 'Captured wording must remain in its source snapshot');
      if (source.collection === 'indexed') {
        assert.equal(comment.platformCommentId, null, 'Indexed capture must not invent a platform ID');
        assert.equal(comment.identityVerified, false);
        assert.match(comment.id, /^indexed-/);
        const raw = readJson(`../research/media-day-2026-09-28/fan-expansion-2026-09-29/${comment.rawFile}`);
        const points = Array.from(raw);
        assert.equal(points.slice(comment.rawStartOffset, comment.rawStartOffset + Array.from(comment.text).length).join(''), comment.text, 'Indexed quote must match raw capture and offset');
      }
    }
  }
  assert.equal(new Set(articles.map((s) => normalize(s.text))).size, articles.length, 'Identical syndicated articles must be deduplicated');
  assert.equal(data.denominators.mediaArticles, articles.length);
  assert.equal(data.denominators.fanPosts, posts.length);
  assert.equal(data.denominators.verbatimFanComments, commentCount);
  assert.equal(data.denominators.suppliedFanEntries, supplied.length + data.denominators.excludedParaphrases);
  assert.equal(data.denominators.excludedParaphrases, 1);
  assert.equal(articles.length, 5);
  assert.ok(commentCount >= 100, 'Expanded capture must contain100+ real comment texts');
  assert.equal(data.sources.length, sources.size);
  for (const metadata of data.sources) {
    const source = sources.get(metadata.id);
    assert.ok(source, `Unknown source ${metadata.id}`);
    for (const key of ['kind', 'source', 'url']) assert.equal(metadata[key], source[key]);
    assert.ok(!('text' in metadata), 'Full source text belongs only in research snapshots');
  }
  assert.ok(data.caveat.startsWith('Sampled Sep 28–29, 2026 coverage —'));
  assert.ok(data.caveat.includes(`${commentCount} fan comment texts`));
  assert.ok(data.caveat.includes(`${indexed.length} indexed Reddit comments`));
  assert.ok(data.caveat.includes(`${supplied.length} supplied social comments`));
  assert.ok(data.caveat.includes('Volumes are relative tiers from the sampled pull, not exhaustive measurement.'));
  assert.deepEqual(data.methodology.volume, { none: 0, low: 1, medium: 2, high: '3 or more' });
  assert.deepEqual(data.methodology.fanVolume, { none: 0, low: '1–4', medium: '5–14', high: '15 or more' });
  const codedComments = new Set();
  assert.ok(data.topics.length >= 10 && data.topics.length <= 15);
  const ids = new Set();
  for (const topic of data.topics) {
    assert.ok(!ids.has(topic.id), `Duplicate topic ${topic.id}`);
    ids.add(topic.id);
    assert.ok(themes.has(topic.theme));
    for (const side of ['fans', 'media']) {
      const audience = topic[side];
      const units = new Set();
      const evidenceIds = new Set();
      const scoresByUnit = new Map();
      for (const item of audience.evidence) {
        assert.ok(!evidenceIds.has(item.id), `Repeated evidence ${item.id}`);
        evidenceIds.add(item.id);
        const source = sources.get(item.sourceId);
        assert.ok(source, `Unknown evidence source ${item.sourceId}`);
        assert.equal(source.kind, side);
        assert.equal(item.url, source.url);
        assert.equal(item.source, source.source);
        assert.equal(new URL(item.url).protocol, 'https:');
        assert.ok(item.quote.length > 0 && source.text.includes(item.quote), `Quote must be verbatim: ${item.id}`);
        assert.ok(item.code === null || [-1, 0, 1].includes(item.code));
        if (side === 'fans') {
          assert.equal(item.kind, 'fan reaction');
          const comment = source.comments.find(comment => comment.id === item.id);
          assert.ok(comment && comment.text === item.quote, `Fan quote must be an entire captured comment: ${item.id}`);
          assert.equal(item.unit, comment.id);
          assert.equal(item.id, item.unit);
          codedComments.add(comment.id);
          assert.notEqual(item.code, null, 'Every selected fan comment needs an explicit editorial code');
        } else {
          assert.equal(item.unit, source.id);
          assert.ok(['journalist framing', 'reported statement', 'reported fact'].includes(item.kind));
          assert.ok(item.origin, 'Media evidence needs reporting origin');
          if (item.kind === 'journalist framing') assert.notEqual(item.code, null);
          else assert.equal(item.code, null, 'Reported facts and statements cannot imply media opinion');
          assert.ok(!item.quote.includes('expectations for the Heat'), 'Known subject-error passage must remain excluded');
        }
        units.add(item.unit);
        if (item.code !== null) {
          const codes = scoresByUnit.get(item.unit) || [];
          codes.push(item.code);
          scoresByUnit.set(item.unit, codes);
        }
      }
      assert.equal(audience.count, units.size, `${topic.id}/${side}: distinct-unit count`);
      assert.equal(audience.volume, volume(units.size, side), `${topic.id}/${side}: relative tier`);
      assert.equal(audience.scoredCount, scoresByUnit.size);
      const unitScores = [...scoresByUnit.values()].map((codes) => codes.reduce((a, b) => a + b, 0) / codes.length);
      const mean = unitScores.length ? Number((unitScores.reduce((a, b) => a + b, 0) / unitScores.length).toFixed(3)) : null;
      assert.equal(audience.score, mean, `${topic.id}/${side}: score must match coded evidence`);
      if (side === 'media') {
        for (const [field, kind] of [['reportedCount', 'reported statement'], ['framingCount', 'journalist framing']]) {
          assert.equal(audience[field], new Set(audience.evidence.filter((e) => e.kind === kind).map((e) => e.unit)).size);
        }
      }
    }
  }
  assert.equal(data.denominators.codedFanComments, codedComments.size);
  assert.equal(data.denominators.uncodedFanComments, comments.length - codedComments.size);
  assert.equal(data.retrievalAudit.directApiComments, 0);
  for (const attempt of data.retrievalAudit.attempts) assert.ok([403, 404].includes(attempt.status), 'Only blocked/skipped endpoint claims are recorded here');
  for (const finding of data.findings) {
    assert.ok(finding.topicIds.length > 0);
    for (const id of finding.topicIds) assert.ok(ids.has(id), `Finding references missing topic ${id}`);
  }
  return { topics: data.topics.length, articles: articles.length, verbatimComments: commentCount };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = validateResonanceReview(review, snapshots);
  console.log(`Resonance review verified: ${result.topics} topics; ${result.articles} article units; ${result.verbatimComments} verbatim fan comments; all quotes, audience counts, source links, media roles and scores validated.`);
}
