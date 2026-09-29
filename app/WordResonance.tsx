"use client";

import { useEffect, useRef, useState } from "react";
import { resonanceCopy, resonanceSourceLinks, resonanceThemes, wordResonance, type ResonanceAudience, type ResonancePhrase } from "@/data/edition";

const filters = ["all", "fans", "media", "both"] as const;
const labels = { all: "All", fans: "Fans", media: "Media", both: "Both" };
const audienceLabel = { fans: "Fans", media: "Media", both: "Fans + media" };
const volumeWeight = { high: 3, medium: 2, low: 1 };
const tone = (sentiment: number) => sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral";
const score = (sentiment: number) => `${sentiment > 0 ? "+" : ""}${sentiment.toFixed(2)}`;

function matches(entry: ResonancePhrase, audience: ResonanceAudience | "all") {
  return audience === "all" || entry.audience === audience || (audience !== "both" && entry.audience === "both");
}

export default function WordResonance() {
  const [audience, setAudience] = useState<ResonanceAudience | "all">("all");
  const [selected, setSelected] = useState<ResonancePhrase | null>(null);
  const detail = useRef<HTMLElement>(null);
  const visible = wordResonance.filter(entry => matches(entry, audience));

  useEffect(() => {
    if (selected && window.matchMedia("(max-width: 800px)").matches) {
      detail.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      detail.current?.focus({ preventScroll: true });
    }
  }, [selected]);

  function filter(next: typeof audience) {
    setAudience(next);
    if (selected && !matches(selected, next)) setSelected(null);
  }

  return <section id="word-resonance" className="report-section resonance-section" aria-labelledby="resonance-title">
    <header className="section-head"><span>Part 02 · Sampled language</span><h2 id="resonance-title">{resonanceCopy.title}</h2><p>{resonanceCopy.introduction}</p></header>
    <p className="resonance-caveat">{resonanceCopy.caveat}</p>
    <p className="resonance-sample">{resonanceCopy.sample}</p>
    <div className="resonance-controls" role="group" aria-label="Word Resonance audience filters">
      {filters.map(value => <button key={value} type="button" aria-pressed={audience === value} onClick={() => filter(value)}>{labels[value]} <span>{wordResonance.filter(entry => matches(entry, value)).length}</span></button>)}
      <span className="resonance-count" role="status">{visible.length} of {wordResonance.length} phrases</span>
    </div>
    <p className="resonance-filter-note">{resonanceCopy.filters}</p>
    <div className="resonance-legend" aria-label="How to read the bubbles"><span className="resonance-positive">Positive &gt; 0</span><span className="resonance-negative">Negative &lt; 0</span><span className="resonance-neutral">Neutral = 0</span><span>Size: high &gt; medium &gt; low relative volume</span></div>
    <div className="resonance-layout">
      <div className="resonance-themes">{resonanceThemes.map(theme => {
        const entries = visible.filter(entry => entry.theme === theme).sort((a, b) => volumeWeight[b.volume] - volumeWeight[a.volume] || a.phrase.localeCompare(b.phrase));
        return <section className="resonance-theme" key={theme} aria-label={theme}><h3>{theme}<span>{entries.length}</span></h3>
          {entries.length ? <div className="resonance-bubbles">{entries.map(entry => <button type="button" key={entry.phrase} className={`resonance-bubble resonance-${tone(entry.sentiment)} resonance-volume-${entry.volume}`} aria-label={`${entry.phrase}. ${audienceLabel[entry.audience]}. ${tone(entry.sentiment)} sentiment ${score(entry.sentiment)}. ${entry.volume} relative volume.`} aria-pressed={selected?.phrase === entry.phrase} aria-controls="resonance-detail" onClick={() => setSelected(entry)}><strong>{entry.phrase}</strong><span>{score(entry.sentiment)}</span></button>)}</div> : <p className="resonance-empty">No phrases in this audience view.</p>}
        </section>;
      })}</div>
      <aside ref={detail} tabIndex={-1} id="resonance-detail" className="resonance-detail" aria-label="Selected phrase evidence" aria-live="polite">
        {selected ? <>
          <div className="resonance-detail-heading"><span>Source evidence</span><button type="button" onClick={() => setSelected(null)}>Clear</button></div>
          <h3>{selected.phrase}</h3>
          <blockquote className="source-quote resonance-evidence"><p>{selected.evidence}</p><footer><strong>{selected.source}</strong><small>{selected.audience === "fans" ? "Verbatim supplied fan comment" : "Verbatim collected source text"}</small></footer></blockquote>
          <dl>{[["Entity", selected.entity], ["Theme", selected.theme], ["Audience", audienceLabel[selected.audience]], ["Sentiment", `${tone(selected.sentiment)} (${score(selected.sentiment)})`], ["Volume", `${selected.volume} · relative tier`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          <a className="source-link" href={resonanceSourceLinks[selected.phrase]} target="_blank" rel="noreferrer">Open original source <span aria-hidden="true">↗</span></a>
          <p className="resonance-detail-note">The quote records the language in this sample. Sentiment and volume are model judgments about that language.</p>
        </> : <><span>Source evidence</span><h3>Choose a phrase</h3><p>Each bubble opens its verbatim evidence, source and scoring details here.</p></>}
      </aside>
    </div>
  </section>;
}
