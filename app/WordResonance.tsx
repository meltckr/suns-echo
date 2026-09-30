"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { resonanceCopy, resonanceReview, resonanceThemes, type ResonanceReading, type ResonanceSide, type ResonanceTopic } from "@/data/edition";
import { balanceLabel, balanceScore, balanceTone, matchesAudience, unitCounts, volumeForView, type ResonanceView } from "@/data/resonance-model";

const filters = ["all", "fans", "media", "both"] as const;
const labels = { all: "All", fans: "Fans", media: "Media", both: "Both" };
const colors = { positive: "#e8f4eb", negative: "#f9e9e7", neutral: "#ececee", unscored: "#f5f2ec" };
const volumeWeight: Record<string, number> = { high: 3, medium: 2, low: 1, none: 0 };

function AudienceEvidence({ side, reading }: { side: ResonanceSide; reading: ResonanceReading }) {
  const counts = unitCounts(reading);
  const examples = side === "fans" ? [1, -1, 0].flatMap(code => {
    const example = reading.evidence.find(item => item.code === code);
    return example ? [example] : [];
  }) : reading.evidence;
  const extra = reading.evidence.filter(item => !examples.some(example => example.id === item.id));
  const quote = (item: ResonanceReading["evidence"][number]) => <blockquote className="source-quote resonance-evidence" key={item.id}>
    <p>{item.quote}</p><footer><strong>{side === "fans" ? new URL(item.url).hostname.includes("reddit") ? "Indexed Reddit comment" : `Supplied ${new URL(item.url).hostname.includes("instagram") ? "Instagram" : "Facebook"} comment` : item.source}</strong><small>{item.kind}{"origin" in item && <> · {item.origin}</>}<br />Code: {item.code === null ? "Unscored reported material" : item.code > 0 ? "Positive (+1)" : item.code < 0 ? "Negative (−1)" : "Neutral (0)"}</small><a className="source-link" href={item.url} target="_blank" rel="noreferrer">Open original {side === "fans" ? "post" : "source"} ↗</a></footer>
  </blockquote>;
  return <section className="audience-evidence" aria-label={`${labels[side]} evidence`}>
    <header><h4>{labels[side]}</h4><span className={`balance-label resonance-${balanceTone(reading)}`}>{balanceLabel(reading)} · {balanceScore(reading)}</span></header>
    <p>{reading.count} {side === "fans" ? "captured comments" : "sampled articles"} · {reading.volume} volume</p>
    {reading.scoredCount > 0 && <p className="coded-counts">Coded {side === "fans" ? "comments" : "articles"}: {counts.positive} positive · {counts.negative} negative · {counts.neutral} neutral</p>}
    {side === "media" && <p className="coded-counts">{reading.scoredCount} articles contain scored journalist framing. Reported facts and player or leadership statements retain an unscored code.</p>}
    {reading.evidence.length ? <details open><summary>Read {reading.evidence.length} evidence {reading.evidence.length === 1 ? "excerpt" : "excerpts"}</summary>
      {examples.map(quote)}
      {extra.length > 0 && <details className="additional-evidence"><summary>Read {extra.length} more captured excerpts</summary>{extra.map(quote)}</details>}
    </details> : <p>No evidence in this sampled audience.</p>}

  </section>;
}

export default function WordResonance() {
  const [audience, setAudience] = useState<ResonanceView>("all");
  const [selected, setSelected] = useState<ResonanceTopic | null>(null);
  const detail = useRef<HTMLElement>(null);
  const topics = resonanceReview.topics;
  const visible = topics.filter(entry => matchesAudience(entry, audience));

  useEffect(() => {
    if (selected && window.matchMedia("(max-width: 800px)").matches) {
      detail.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      detail.current?.focus({ preventScroll: true });
    }
  }, [selected]);

  function filter(next: ResonanceView) {
    setAudience(next);
    if (selected && !matchesAudience(selected, next)) setSelected(null);
  }
  function selectFinding(id: string) {
    setAudience("all");
    setSelected(topics.find(item => item.id === id) ?? null);
  }

  return <section id="word-resonance" className="report-section resonance-section" aria-labelledby="resonance-title">
    <header className="section-head"><span>Sources · Fan and media language</span><h2 id="resonance-title">{resonanceCopy.title}</h2><p>{resonanceCopy.introduction}</p></header>
    <p className="resonance-caveat">{resonanceCopy.caveat}</p>
    <div className="resonance-findings">{resonanceReview.findings.map(finding => <article key={finding.title}><h3>{finding.title}</h3><p>{finding.text}</p><div>{finding.topicIds.map(id => <button type="button" key={id} onClick={() => selectFinding(id)}>Explore {topics.find(topic => topic.id === id)?.phrase} ↗</button>)}</div></article>)}</div>
    <p className="resonance-sample">{resonanceCopy.sample}</p>
    <div className="resonance-controls" role="group" aria-label="Word Resonance audience filters">
      {filters.map(value => <button key={value} type="button" aria-pressed={audience === value} onClick={() => filter(value)}>{labels[value]} <span>{topics.filter(entry => matchesAudience(entry, value)).length}</span></button>)}
      <span className="resonance-count" role="status">{visible.length} of {topics.length} phrase groups</span>
    </div>
    <p className="resonance-filter-note">{resonanceCopy.filters}</p>
    <div className="resonance-legend" aria-label="How to read the bubbles"><span className="resonance-positive">Positive</span><span className="resonance-negative">Negative</span><span className="resonance-neutral">Neutral or mixed</span><span>Unscored = no coded opinion</span></div>
    <p className="resonance-size-note">{audience === "all" || audience === "both" ? "Left half: Fans. Right half: Media. Size uses the larger audience tier; the two units differ." : `Color and size show the ${labels[audience].toLowerCase()} reading.`} Fan volume: 1–4 low · 5–14 medium · 15+ high. Media volume: 1 low · 2 medium · 3+ high. Fans count comment texts; media counts articles.</p>
    <div className="resonance-layout">
      <div className="resonance-themes">{resonanceThemes.map(theme => {
        const entries = visible.filter(entry => entry.theme === theme).sort((a, b) => volumeWeight[volumeForView(b, audience)] - volumeWeight[volumeForView(a, audience)] || a.phrase.localeCompare(b.phrase));
        return <section className="resonance-theme" key={theme} aria-label={theme}><h3>{theme}<span>{entries.length}</span></h3>
          {entries.length ? <div className="resonance-bubbles">{entries.map(entry => {
            const split = audience === "all" || audience === "both";
            const shown = split ? null : entry[audience];
            const description = `Fans: ${balanceLabel(entry.fans)}, ${entry.fans.count} comments. Media: ${balanceLabel(entry.media)}, ${entry.media.count} articles.`;
            return <button type="button" key={entry.id} className={`resonance-bubble resonance-volume-${volumeForView(entry, audience)} ${split ? "resonance-split" : `resonance-${balanceTone(shown!)}`}`} style={split ? { "--fan-color": colors[balanceTone(entry.fans)], "--media-color": colors[balanceTone(entry.media)] } as CSSProperties : undefined} aria-label={`${entry.phrase}. ${description}`} aria-pressed={selected?.id === entry.id} aria-controls="resonance-detail" onClick={() => setSelected(entry)}><strong>{entry.phrase}</strong>{split ? <span className="bubble-readings"><span>Fans<br /><b>{balanceLabel(entry.fans)}</b></span><span>Media<br /><b>{balanceLabel(entry.media)}</b></span></span> : <span>{balanceLabel(shown!)}<br />{balanceScore(shown!)}</span>}<small>{split ? `F ${entry.fans.count} · M ${entry.media.count}` : `${shown!.count} ${audience === "fans" ? "comments" : "articles"}`}</small></button>;
          })}</div> : <p className="resonance-empty">No phrase groups in this audience view.</p>}
        </section>;
      })}</div>
      <aside ref={detail} tabIndex={-1} id="resonance-detail" className="resonance-detail" aria-label="Selected phrase evidence" aria-live="polite">
        {selected ? <>
          <div className="resonance-detail-heading"><span>Source evidence</span><button type="button" onClick={() => setSelected(null)}>Clear</button></div>
          <h3>{selected.phrase}</h3><p>{selected.takeaway}</p>
          <dl><div><dt>Entity</dt><dd>{selected.entity}</dd></div><div><dt>Theme</dt><dd>{selected.theme}</dd></div></dl>
          <AudienceEvidence side="fans" reading={selected.fans} /><AudienceEvidence side="media" reading={selected.media} />
          <p className="resonance-detail-note">Scores describe selected language. Positive +1, neutral 0, negative −1; average excerpts within each unit, then average scored units per audience. Zero can contain opposing reactions. Article exposure includes reported material; it does not establish independent confirmation.</p>
        </> : <><span>Source evidence</span><h3>Choose a phrase group</h3><p>Compare each audience’s sampled count and coded language. Open the verbatim evidence and original source.</p></>}
      </aside>
    </div>
    <details className="resonance-method"><summary>Sampling, coding and skipped sources</summary><p>{resonanceReview.methodology.retrieval}</p><p>{resonanceReview.methodology.selection}</p><p>{resonanceReview.methodology.sentiment}</p><p>{resonanceReview.methodology.deduplication}</p><ul>{resonanceReview.methodology.exclusions.map(item => <li key={item}>{item}</li>)}</ul><ul>{resonanceReview.retrievalAudit.attempts.map(attempt => <li key={attempt.url}><a href={attempt.url} target="_blank" rel="noreferrer">{new URL(attempt.url).hostname} · {new URL(attempt.url).pathname}</a> — skipped: HTTP {attempt.status}{attempt.finalUrl.includes("/login/") ? " after login redirect" : ""}</li>)}</ul></details>
  </section>;
}
