"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  audioBrief,
  audienceSignals,
  distribution,
  edition,
  implications,
  methodology,
  sources,
  themes,
  watchColumns,
  type Category,
  type Sentiment,
  type Source,
} from "@/data/edition";

const nav = [
  ["readout", "Readout"], ["signal", "Signal"], ["map", "Map"], ["voices", "Voices"],
  ["local", "Local"], ["national", "National"], ["creators", "Creators"], ["fans", "Fans"],
  ["narratives", "Narratives"], ["watch", "Watch"], ["ownership", "Ownership"], ["ledger", "Sources"],
];

const basePath = "/suns-echo";

const toneClass = (value: string) => value.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");

function Brand({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? "brand compact" : "brand"} src={`${basePath}/assets/brand/AVC-logo-horizontal-dark.svg`} alt="Accelerated Velocity Consulting" />;
}

function SectionHead({ n, eyebrow, title, copy }: { n: string; eyebrow: string; title: string; copy?: string }) {
  return <header className="section-head"><span>{n} · {eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</header>;
}

function SourceLink({ source, children }: { source: Source; children?: React.ReactNode }) {
  return <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{children ?? source.outlet}<span aria-hidden="true">↗</span></a>;
}

function sourceLinkLabel(source: Source) {
  if (source.url.includes("youtube.com")) return "Watch full interview";
  if (source.url.includes("reddit.com")) return "View full discussion";
  if (source.url.endsWith(".pdf") || source.category === "Official") return "Open source";
  if (source.url.includes("podcasts.apple.com")) return "Open podcast";
  return "Read full article";
}

function AudioBrief() {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const progress = duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
  const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    const syncProgress = () => {
      if (audio.current) setCurrent(audio.current.currentTime);
      frame = window.requestAnimationFrame(syncProgress);
    };

    frame = window.requestAnimationFrame(syncProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;

    const syncDuration = () => {
      if (Number.isFinite(element.duration) && element.duration > 0) setDuration(element.duration);
    };

    syncDuration();
    element.addEventListener("loadedmetadata", syncDuration);
    element.addEventListener("durationchange", syncDuration);
    element.addEventListener("canplay", syncDuration);
    return () => {
      element.removeEventListener("loadedmetadata", syncDuration);
      element.removeEventListener("durationchange", syncDuration);
      element.removeEventListener("canplay", syncDuration);
    };
  }, []);

  const toggle = async () => {
    if (!audio.current) return;
    if (audio.current.paused) await audio.current.play();
    else audio.current.pause();
  };
  const seek = (seconds: number) => {
    if (!audio.current) return;
    audio.current.currentTime = Math.max(0, Math.min(audio.current.duration || 0, audio.current.currentTime + seconds));
  };

  return <section className="audio-brief" aria-labelledby="audio-title">
    <div className="audio-brief-copy"><span>LISTEN FIRST · {audioBrief.label}</span><h2 id="audio-title">{audioBrief.title}</h2><p>The complete signal, restraint and next-watch item in one concise listen.</p></div>
    <div className="audio-controls">
      <button type="button" onClick={() => seek(-15)} aria-label="Back 15 seconds">−15</button>
      <button type="button" className="audio-play" onClick={toggle} aria-label={playing ? "Pause The Echo audio brief" : "Play The Echo audio brief"}>{playing ? "Ⅱ" : "▶"}</button>
      <div className="audio-timeline"><span>{clock(current)}</span><input type="range" min="0" max={duration || 0} step="0.1" value={current} style={{ "--audio-progress": `${progress}%` } as CSSProperties} onChange={(event) => { const next = Number(event.target.value); setCurrent(next); if (audio.current) audio.current.currentTime = next; }} aria-label="Audio timeline" aria-valuetext={`${clock(current)} of ${duration ? clock(duration) : "approximately 2 minutes"}`} /><span>{duration ? clock(duration) : "~2:00"}</span></div>
      <button type="button" onClick={() => seek(15)} aria-label="Forward 15 seconds">+15</button>
      <select value={speed} onChange={(event) => { const next = Number(event.target.value); setSpeed(next); if (audio.current) audio.current.playbackRate = next; }} aria-label="Playback speed"><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select>
    </div>
    <details className="audio-transcript"><summary>Read the full transcript</summary><div>{audioBrief.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>
    <audio ref={audio} preload="metadata" src={audioBrief.src} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setCurrent(0); }} />
  </section>;
}

function SourceCard({ source }: { source: Source }) {
  return <article className="source-card">
    <div className="source-card-top"><span>{source.category}</span><b className={toneClass(source.sentiment)}>{source.sentiment}</b></div>
    <h3>{source.source}</h3>
    <p className="source-evidence">{source.evidence}</p>
    {source.quote && <blockquote className="source-quote"><p>“{source.quote}”</p><footer><strong>{source.speaker}</strong><small>{source.speakerRole}<br />{source.quoteContext}</small></footer></blockquote>}
    <div className="tags">{source.themes.slice(0, 3).map((theme) => <span key={theme}>{theme}</span>)}</div>
    <footer><small>{source.outlet} · {source.date} · {source.confidence} confidence</small><SourceLink source={source}>{sourceLinkLabel(source)}</SourceLink></footer>
  </article>;
}

function QuoteCard({ source, quiet = false }: { source: Source; quiet?: boolean }) {
  return <article className={`quote-card ${quiet ? "quiet" : ""}`}>
    <span>{source.quoteType}</span>
    <p>“{source.quote}”</p>
    <footer><strong>{source.speaker ?? "Public commenter"}</strong><small>{source.speakerRole && <>{source.speakerRole}<br /></>}{source.quoteContext && <>{source.quoteContext}<br /></>}{source.outlet} · {source.date}</small><SourceLink source={source}>{sourceLinkLabel(source)}</SourceLink></footer>
  </article>;
}

function SignalCard({ label, direction, score, note }: (typeof audienceSignals)[number]) {
  return <article className="signal-card">
    <div><span>{label}</span><strong>{direction}</strong></div>
    <div className="meter" aria-label={`${label}: ${score} on a directional editorial scale`}><i style={{ width: `${score}%` }} /></div>
    <small>{note}</small>
  </article>;
}

function AudienceSection({ id, n, title, category, copy }: { id: string; n: string; title: string; category: Category; copy: string }) {
  const selected = sources.filter((source) => source.category === category);
  return <section id={id} className="report-section">
    <SectionHead n={n} eyebrow={`${category} read`} title={title} copy={copy} />
    <div className="source-grid">{selected.map((source) => <SourceCard key={source.id} source={source} />)}</div>
  </section>;
}

function SourceLedger() {
  const [category, setCategory] = useState("All");
  const [sentiment, setSentiment] = useState("All");
  const categories = ["All", ...new Set(sources.map((source) => source.category))];
  const sentiments = ["All", ...new Set(sources.map((source) => source.sentiment))];
  const visible = useMemo(() => sources.filter((source) =>
    (category === "All" || source.category === category) && (sentiment === "All" || source.sentiment === sentiment)
  ), [category, sentiment]);

  return <>
    <div className="ledger-controls">
      <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Sentiment<select value={sentiment} onChange={(event) => setSentiment(event.target.value)}>{sentiments.map((value) => <option key={value}>{value}</option>)}</select></label>
      <span>{visible.length} of {sources.length} records</span>
    </div>
    <div className="ledger-wrap"><table>
      <thead><tr><th>Source</th><th>Category</th><th>Date</th><th>Sentiment</th><th>Confidence</th><th>Link</th></tr></thead>
      <tbody>{visible.map((source) => <tr key={source.id}><td><strong>{source.source}</strong><small>{source.outlet}<br />{source.themes.join(" · ")}</small></td><td>{source.category}</td><td>{source.date}</td><td><span className={`ledger-tone ${toneClass(source.sentiment)}`}>{source.sentiment}</span></td><td>{source.confidence}</td><td><SourceLink source={source}>{sourceLinkLabel(source)}</SourceLink></td></tr>)}</tbody>
    </table></div>
  </>;
}

export default function Dashboard() {
  const quoteSources = sources.filter((source) => source.quote);
  const playerSources = sources.filter((source) => source.category === "Players & Coaches");
  const fanQuotes = sources.filter((source) => source.category === "Fans" && source.quote);

  async function share() {
    const payload = { title: `${edition.series}: ${edition.title}`, text: edition.subtitle, url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard.writeText(window.location.href);
  }

  return <main>
    <header className="topbar"><Brand compact /><span>Ownership Intelligence · Perception Monitor</span><div><button onClick={() => window.print()}>Print</button><button onClick={share}>Share</button></div></header>

    <AudioBrief />

    <section className="hero">
      <div className="hero-art" aria-hidden="true"><span>THE</span><strong>ECHO</strong><i /></div>
      <div className="hero-copy">
        <div className="hero-marks"><img src={`${basePath}/assets/teams/suns-logo.svg`} alt="Phoenix Suns" /><span>AVC · OWNERSHIP INTELLIGENCE</span></div>
        <p className="eyebrow">{edition.series} · EDITION 001</p>
        <h1>{edition.title}</h1>
        <p className="subtitle">{edition.subtitle}</p>
        <div className="hero-meta"><span>Event<br /><strong>{edition.eventDate}</strong></span><span>Reporting window<br /><strong>{edition.reportingWindow}</strong></span><span>Confidence<br /><strong>{edition.confidence}</strong></span></div>
        <p className="hero-thesis">{edition.thesis}</p>
        <p className="hero-note">Directional evidence sample · not scientific polling</p>
      </div>
    </section>

    <nav className="section-nav" aria-label="Report sections">{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>

    <section id="readout" className="report-section lead-section">
      <SectionHead n="01" eyebrow="Executive interpretation" title="Ownership readout" />
      <div className="readout"><p>{edition.readout}</p><aside><span>Dominant signal</span><strong>{edition.overallDirection}</strong><p>The three-year term made commitment feel disciplined. Age and team ceiling keep the read grounded.</p></aside></div>
    </section>

    <section id="signal" className="report-section dark-section">
      <SectionHead n="02" eyebrow="Directional index" title="Signal at a glance" copy="A transparent editorial read of the collected sample—not a claim about the entire public." />
      <div className="index-row"><div className="index-number"><strong>{edition.editorialIndex}</strong><span>/ 100</span></div><div><h3>{edition.overallDirection}</h3><p>{edition.indexNote}</p></div><div className="index-facts"><span>{edition.includedCount}<small>items included</small></span><span>{edition.reviewedCount}<small>items reviewed</small></span><span>{edition.confidence}<small>confidence</small></span></div></div>
      <div className="signal-grid">{audienceSignals.map((signal) => <SignalCard key={signal.label} {...signal} />)}</div>
    </section>

    <section id="map" className="report-section">
      <SectionHead n="03" eyebrow="Evidence mix" title="The conversation map" copy="Relative distribution of the collected evidence, not the internet at large." />
      <div className="conversation-map">{distribution.map((item, index) => <article key={item.category}><div className="map-ring" style={{ "--size": `${76 + item.count * 10}px`, "--delay": `${index * .06}s` } as React.CSSProperties}><strong>{item.count}</strong></div><span>{item.category}</span></article>)}</div>
      <p className="method-note">The sample intentionally weights direct and established sources more heavily than raw volume.</p>
    </section>

    <section id="voices" className="report-section dark-section">
      <SectionHead n="04" eyebrow="Direct evidence" title="What the principals and teammates have said" copy="Fresh post-extension player and coach statements were not public by the cutoff. These complete direct quotes establish the verified intent and daily-work context that preceded the agreement." />
      <div className="quote-grid">{playerSources.filter((source) => source.quote).map((source) => <QuoteCard key={source.id} source={source} />)}</div>
      <div className="interpretation"><span>Interpretation</span><p>The language before the agreement was unusually aligned: ownership expected Brooks to remain, Brooks wanted Phoenix to be his last stop, and a teammate tied his influence to observable work. The timing matters—these are verified pre-extension statements, not reactions presented after the fact.</p></div>
    </section>

    <AudienceSection id="local" n="05" title="The Valley read discipline inside continuity" category="Local Media" copy="Local coverage had spent months debating a possible four-year commitment. The reported three-year term answered the clearest age concern without changing the organization’s stated direction." />
    <AudienceSection id="national" n="06" title="The villain frame turned into earned value" category="National Media" copy="National coverage connected the extension to Brooks’ career season, two-way role and reputation as an identity carrier. The strongest restraint remained age and the team’s postseason ceiling." />
    <AudienceSection id="creators" n="07" title="Value led the first creator wave" category="Creators" copy="Same-day creator coverage moved quickly toward team-friendly language, while longer-form discussion preserved concerns about shot selection, role and future flexibility." />

    <section id="fans" className="report-section dark-section">
      <SectionHead n="08" eyebrow="Indicative fan pulse" title="Relief on price, conviction on identity—and some ceiling friction" copy="Visible fan responses are sampled, nonrepresentative and selected to preserve both enthusiasm and skepticism." />
      <div className="fan-themes"><article><span>01</span><h3>Below the fear line</h3><p>The number landed below the $30-million range many fans expected.</p></article><article><span>02</span><h3>Identity retained</h3><p>Work, defense and competitive edge drove approval beyond scoring.</p></article><article><span>03</span><h3>Gregory credit</h3><p>The extension strengthened approval of the offseason contract pattern.</p></article><article><span>04</span><h3>Ceiling question</h3><p>A minority asked whether continuity can move a first-round team forward.</p></article></div>
      <div className="quote-grid fan-quotes">{fanQuotes.map((source) => <QuoteCard key={source.id} source={source} quiet />)}</div>
      <p className="method-note">Ordinary fan handles are omitted in the presentation. Original comments remain available at the linked public threads.</p>
    </section>

    <section id="narratives" className="report-section">
      <SectionHead n="09" eyebrow="Narrative leaders" title="Six ideas are organizing the conversation" />
      <div className="narrative-grid">{themes.map((theme, index) => <article key={theme.name}><header><span>{String(index + 1).padStart(2, "0")}</span><div><b>{theme.momentum}</b><small>{theme.strength} evidence</small></div></header><h3>{theme.name}</h3><p>{theme.evidence}</p><dl><div><dt>Advanced by</dt><dd>{theme.groups}</dd></div><div><dt>Ownership relevance</dt><dd>{theme.relevance}</dd></div></dl></article>)}</div>
    </section>

    <section className="report-section quote-board">
      <SectionHead n="10" eyebrow="Verified language" title="Quote board" />
      <div className="quote-board-grid">{quoteSources.slice(0, 8).map((source) => <QuoteCard key={source.id} source={source} />)}</div>
    </section>

    <section id="watch" className="report-section dark-section">
      <SectionHead n="11" eyebrow="Perception monitor" title="Positive signals, open questions and watch items" />
      <div className="watch-grid"><article className="positive"><span>Positive signals</span>{watchColumns.positive.map((item) => <p key={item}>{item}</p>)}</article><article className="question"><span>Open questions</span>{watchColumns.questions.map((item) => <p key={item}>{item}</p>)}</article><article className="watch"><span>Watch items</span>{watchColumns.watch.map((item) => <p key={item}>{item}</p>)}</article></div>
    </section>

    <section id="ownership" className="report-section">
      <SectionHead n="12" eyebrow="Ownership implications" title="Five observations to keep in view" />
      <div className="implication-list">{implications.map((item) => <article key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
    </section>

    <section className="report-section bottom-line"><SectionHead n="13" eyebrow="Synthesis" title="Bottom line" /><p>{edition.bottomLine}</p></section>

    <section className="report-section methodology">
      <details open><summary><span>14 · Methodology</span><strong>How to read this report</strong><i>+</i></summary><div className="method-grid"><article><span>Window</span><p>{edition.reportingWindow}</p></article><article><span>Search</span><p>{methodology.searched}</p></article><article><span>Selection</span><p>{methodology.selection}</p></article><article><span>Classification</span><p>{methodology.sentiment}</p></article><article><span>Access limitations</span><p>{methodology.limitations}</p></article></div></details>
    </section>

    <section id="ledger" className="report-section ledger-section">
      <SectionHead n="15" eyebrow="Traceable evidence" title="Source ledger" copy="Filter the included sample by audience category or sentiment classification." />
      <SourceLedger />
    </section>

    <footer className="site-footer"><div><Brand /><p>Prepared for Mat and Phoenix Suns ownership.<br />Evidence first. Direction without overstatement.</p></div><div><span>THE ECHO · SUNS EDITION 001</span><strong>#DOMINATE</strong><small>Generated August 6, 2026 · America/Phoenix</small></div><i /></footer>
  </main>;
}
