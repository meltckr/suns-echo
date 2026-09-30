"use client";

import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Script from "next/script";
import WordResonance from "./WordResonance";
import CinematicDivider from "./CinematicDivider";
import {
  alignment,
  ownershipBrief,
  reportParts,
  audioBrief,
  fanThemes,
  sectionCopy,
  audienceSignals,
  distribution,
  edition,
  implications,
  heroMedia,
  methodology,
  sources,
  ledgerSources,
  themes,
  watchColumns,
  type Category,
  type Source,
} from "@/data/edition";

const nav = [
  ["readout", "Review"], ["alignment", "Alignment"], ["voices", "Voices"],
  ["watch", "Watch"], ["word-resonance", "Word Resonance"], ["ledger", "Sources"],
];

const basePath = edition.basePath;

const toneClass = (value: string) => value.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");

function Brand({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? "brand compact" : "brand"} src={`${basePath}/assets/brand/AVC-logo-horizontal-dark.svg`} alt="Accelerated Velocity Consulting" />;
}

function SectionHead({ n, eyebrow, title, copy }: { n?: string; eyebrow: string; title: string; copy?: string }) {
  return <header className="section-head"><span>{n ? `${n} · ` : ""}{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</header>;
}

function SourceLink({ source, children }: { source: Source; children?: React.ReactNode }) {
  return <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{children ?? source.outlet}<span aria-hidden="true">↗</span></a>;
}

function sourceLinkLabel(source: Source) {
  if (source.url.includes("youtube.com")) return "Watch full interview";
  if (source.url.includes("reddit.com")) return "View full discussion";
  if (/instagram\.com|facebook\.com|threads\.(?:net|com)/.test(source.url)) return "View source post";
  if (source.url.endsWith(".pdf") || source.category === "Official") return "Open source";
  if (source.url.includes("podcasts.apple.com")) return "Open podcast";
  return "Read full article";
}

function AudioBrief() {
  return <section className="audio-brief" aria-label="Audio brief">
    {audioBrief.ready ? <>
      <Script type="module" src={`${basePath}/assets/mel-audio-player/mel-audio-player.js`} strategy="afterInteractive" />
      <div className="signal-audio">{createElement("mel-audio-player", {
        src: audioBrief.src,
        title: audioBrief.title,
        eyebrow: "Audio",
        transcript: audioBrief.transcript,
        download: "",
      })}</div>
    </> : <div className="audio-brief-copy">
      <span>Audio</span><h2>{audioBrief.title}</h2>
      <p>Final narration is being prepared.</p>
    </div>}
    <details className="audio-transcript"><summary>Read the full transcript</summary><div>{audioBrief.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></details>
  </section>;
}

function HeroMedia() {
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element || !heroMedia.ready) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 800px)");
    const syncPoster = () => { element.poster = mobile.matches ? heroMedia.portraitPoster : heroMedia.poster; };
    const syncMotion = () => {
      if (preference.matches || manuallyPaused.current) element.pause();
      else void element.play().catch(() => { /* The poster remains available when autoplay is restricted. */ });
    };
    syncPoster();
    syncMotion();
    mobile.addEventListener("change", syncPoster);
    preference.addEventListener("change", syncMotion);
    return () => {
      preference.removeEventListener("change", syncMotion);
      mobile.removeEventListener("change", syncPoster);
    };
  }, []);

  function toggleMotion() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      void element.play().catch(() => setUnavailable(true));
    } else {
      manuallyPaused.current = true;
      element.pause();
    }
  }

  return <>
    <div className="hero-media" role="img" aria-label={heroMedia.alt}>
      {heroMedia.ready && !unavailable && <video ref={video} muted loop playsInline preload="none" poster={heroMedia.poster} aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setUnavailable(true)}>
        <source src={heroMedia.portrait} type="video/mp4" media="(max-width: 800px)" />
        <source src={heroMedia.landscape} type="video/mp4" />
      </video>}
    </div>
    {heroMedia.ready && !unavailable && <button className="hero-motion" type="button" onClick={toggleMotion} aria-label={playing ? "Pause background motion" : "Play background motion"}>{playing ? "Pause motion" : "Play motion"}</button>}
  </>;
}

function AlignmentSection() {
  return <section id="alignment" className="report-section alignment-section">
    <SectionHead n="02" eyebrow="Shared messages" title="Where the voices align" copy="The ideas appearing across the named voices, with the evidence and the next thing to watch." />
    <div className="alignment-list">{alignment.map((item) => <article className="alignment-card" key={item.id}>
      <header><span>{item.status}</span><h3>{item.title}</h3><p>{item.reading}</p></header>
      <details className="alignment-detail" open={item.id === "shared-work"}><summary>Named voices and evidence</summary>
      <div className="alignment-evidence">{item.evidence.map((evidence, index) => {
        const source = sources.find((entry) => entry.id === evidence.sourceId);
        return <div className="alignment-voice" key={`${evidence.speaker}-${index}`}>
          <h4>{evidence.speaker}</h4><small>{evidence.role}</small>
          <span className="evidence-kind">{evidence.kind}</span>
          {evidence.kind === "Direct quote" ? <blockquote>“{evidence.statement}”</blockquote> : <p>{evidence.statement}</p>}
          {source && <footer><small>{source.date}</small><SourceLink source={source} /></footer>}
        </div>;
      })}</div>
      <dl className="alignment-meaning"><div><dt>Ownership perspective</dt><dd>{item.meaning}</dd></div><div><dt>Watch next</dt><dd>{item.watch}</dd></div></dl>
      </details>
    </article>)}</div>
    <div id="narratives" className="section-extension">
      <details className="evidence-disclosure"><summary>Other ideas shaping the conversation</summary>
        <p className="method-note">Availability, public standards and player identity add context to the shared preparation accounts above.</p>
        <div className="narrative-grid">{themes.filter(theme => ["Availability shapes the next phase", "Standards carry public expectations", "Player identity reaches beyond the game"].includes(theme.name)).map((theme) => <article key={theme.name}><header><div><b>{theme.momentum}</b><small>{theme.strength} evidence</small></div></header><h3>{theme.name}</h3><p>{theme.evidence}</p><dl><div><dt>Advanced by</dt><dd>{theme.groups}</dd></div><div><dt>Ownership relevance</dt><dd>{theme.relevance}</dd></div></dl></article>)}</div>
      </details>
    </div>
  </section>;
}

function SourceCard({ source }: { source: Source }) {
  return <article className="source-card">
    <div className="source-card-top"><span>{source.category}</span><b className={toneClass(source.sentiment)}>{source.sentiment}</b></div>
    <h3>{source.source}</h3>
    <p className="source-evidence">{source.evidence}</p>
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
    {score === null ? <p className="qualitative-signal">Qualitative evidence</p> : <div className="meter" aria-label={`${label}: ${score} on a directional editorial scale`}><i style={{ width: `${score}%` }} /></div>}
    <small>{note}</small>
  </article>;
}

function AudienceSection({ id, title, category, copy }: { id: string; title: string; category: Category; copy: string }) {
  const selected = sources.filter((source) => source.category === category);
  return <div id={id} className="coverage-group">
    <details className="evidence-disclosure"><summary>{title} <small>{selected.length} sources</small></summary>
    <p className="method-note">{copy}</p>
    <div className="source-grid">{selected.map((source) => <SourceCard key={source.id} source={source} />)}</div></details>
  </div>;
}

function SourceLedger() {
  const [category, setCategory] = useState("All");
  const [sentiment, setSentiment] = useState("All");
  const categories = ["All", ...new Set(ledgerSources.map((source) => source.category))];
  const sentiments = ["All", ...new Set(ledgerSources.map((source) => source.sentiment))];
  const visible = useMemo(() => ledgerSources.filter((source) =>
    (category === "All" || source.category === category) && (sentiment === "All" || source.sentiment === sentiment)
  ), [category, sentiment]);

  return <>
    <div className="ledger-controls">
      <label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Sentiment<select value={sentiment} onChange={(event) => setSentiment(event.target.value)}>{sentiments.map((value) => <option key={value}>{value}</option>)}</select></label>
      <span>{visible.length} of {ledgerSources.length} records</span>
    </div>
    <div className="ledger-wrap"><table>
      <thead><tr><th>Source</th><th>Category</th><th>Date</th><th>Sentiment</th><th>Confidence</th><th>Link</th></tr></thead>
      <tbody>{visible.map((source) => <tr key={source.id}><td><strong>{source.source}</strong><small>{source.outlet}<br />{source.themes.join(" · ")}{source.samplePurpose && <><br />{source.samplePurpose}</>}</small></td><td>{source.category}</td><td>{source.date}</td><td><span className={`ledger-tone ${toneClass(source.sentiment)}`}>{source.sentiment}</span></td><td>{source.confidence}</td><td><SourceLink source={source}>{sourceLinkLabel(source)}</SourceLink></td></tr>)}</tbody>
    </table></div>
  </>;
}

export default function Dashboard() {
  const quoteSources = sources.filter((source, index, records) => source.quote && source.category !== "Fans" && records.findIndex((entry) => entry.quote === source.quote) === index);
  const fanQuotes = sources.filter((source) => source.category === "Fans" && source.quote);

  useEffect(() => {
    const revealAnchor = () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (!target) return;
      if (target.querySelector(":scope > details")) (target.querySelector(":scope > details") as HTMLDetailsElement).open = true;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) if (parent instanceof HTMLDetailsElement) parent.open = true;
    };
    revealAnchor();
    window.addEventListener("hashchange", revealAnchor);
    return () => window.removeEventListener("hashchange", revealAnchor);
  }, []);

  async function share() {
    const payload = { title: `${edition.series}: ${edition.title}`, text: edition.subtitle, url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard.writeText(window.location.href);
  }

  return <main>
    <header className="topbar"><Brand compact /><span>Ownership Intelligence · Perception Monitor</span><div><button onClick={() => window.print()}>Print</button><button onClick={share}>Share</button></div></header>

    <AudioBrief />

    <section className="hero" style={{ "--hero-poster": `url("${heroMedia.poster}")`, "--hero-portrait-poster": `url("${heroMedia.portraitPoster}")` } as CSSProperties}>
      <HeroMedia />
      <div className="hero-art" aria-hidden="true"><span>THE</span><strong>ECHO</strong><i /></div>
      <div className="hero-copy">
        <div className="hero-marks"><img src={`${basePath}/assets/teams/suns-logo.svg`} alt="Phoenix Suns" /><span>AVC · OWNERSHIP INTELLIGENCE</span></div>
        <p className="eyebrow">{edition.series} · EDITION {edition.number}</p>
        <p className="edition-status">{edition.statusLabel}</p>
        <h1>{edition.title}</h1>
        <p className="subtitle">{edition.subtitle}</p>
        <div className="hero-meta"><span>Event<br /><strong>{edition.eventDate}</strong></span><span>Coverage<br /><strong>September 28–29, 2026</strong></span><span>Evidence<br /><strong>{edition.sourceCount} Media Day review records + {ledgerSources.length - sources.length} supplementary Word Resonance records · eight official interviews</strong></span></div>
        <p className="hero-thesis">{edition.thesis}</p>
        <p className="hero-note">Directional evidence sample · Photography: <a href="https://x.com/Suns/status/2104734231326814483" target="_blank" rel="noreferrer">Phoenix Suns</a></p>
      </div>
    </section>

    <nav className="edition-parts" aria-label="Two parts of this edition">{reportParts.map((part, index) => <a key={part.id} href={`#${part.id}`}><span>Part {String(index + 1).padStart(2, "0")}</span><strong>{part.title}</strong><small>{part.description}</small></a>)}</nav>

    <nav className="section-nav" aria-label="Report sections">{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>

    <CinematicDivider label="Part 01 · Media Day review" />

    <section id="readout" className="report-section lead-section">
      <SectionHead n="01" eyebrow="Part 01 · Media Day review" title="Ownership readout" />
      <p className="first-minute-label">The first minute · Three findings, one tension, three things to revisit</p>
      <div className="ownership-findings">{ownershipBrief.findings.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.body}</p><div>{item.sourceIds.map(id => { const source = sources.find(entry => entry.id === id); return source ? <SourceLink key={id} source={source} /> : null; })}</div></article>)}</div>
      <article className="ownership-tension"><span>The tension</span><h3>{ownershipBrief.tension.title}</h3><p>{ownershipBrief.tension.body}</p><div>{ownershipBrief.tension.sourceIds.map(id => { const source = sources.find(entry => entry.id === id); return source ? <SourceLink key={id} source={source} /> : null; })}</div></article>
      <div className="ownership-next"><h3>Keep in view next</h3>{ownershipBrief.next.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.body}</p><div>{item.sourceIds.map(id => { const source = sources.find(entry => entry.id === id); return source ? <SourceLink key={id} source={source} /> : null; })}</div></article>)}</div>
      <details className="expanded-readout"><summary>Read the Media Day review</summary>
      <div className="readout"><div className="readout-copy">{(edition.readoutParagraphs ?? [edition.readout]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<div className="readout-sources">{edition.readoutSourceIds.map((id) => { const source = sources.find((entry) => entry.id === id); return source ? <SourceLink key={id} source={source} /> : null; })}</div></div><aside><span>Dominant signal</span><strong>{edition.overallDirection}</strong><p>{edition.dominantSignalNote}</p></aside></div>
      </details>
    </section>

    <AlignmentSection />

    <section id="signal" className="report-section dark-section">
      <details className="evidence-disclosure"><summary>Directional evidence by audience</summary>
      <SectionHead n="03" eyebrow="Directional index" title="Signal at a glance" copy="An editorial reading of the collected evidence." />
      <div className="index-row"><div className={`index-number${edition.editorialIndex === null ? " qualitative" : ""}`}><strong>{edition.editorialIndex ?? "Qualitative"}</strong>{edition.editorialIndex !== null && <span>/ 100</span>}</div><div><h3>{edition.overallDirection}</h3><p>{edition.indexNote}</p></div><div className="index-facts"><span>{edition.includedCount}<small>items included</small></span><span>{edition.reviewedCount}<small>items reviewed</small></span><span>{edition.confidence}<small>confidence</small></span></div></div>
      <div className="signal-grid">{audienceSignals.map((signal) => <SignalCard key={signal.label} {...signal} />)}</div>
      </details>
      <div id="map" className="section-extension">
        <details className="evidence-disclosure"><summary>Source mix behind the review</summary>
          <div className="conversation-map">{distribution.map((item, index) => <article key={item.category}><div className="map-ring" style={{ "--size": `${76 + item.count * 10}px`, "--delay": `${index * .06}s` } as React.CSSProperties}><strong>{item.count}</strong></div><span>{item.category}</span></article>)}</div>
          <p className="method-note">The sample intentionally weights direct and established sources more heavily than raw volume.</p>
        </details>
      </div>
    </section>

    <section id="voices" className="report-section dark-section">
      <SectionHead n="04" eyebrow="Direct evidence" title={sectionCopy.voices.title} copy={sectionCopy.voices.copy} />
      <div className="quote-grid">{quoteSources.map((source) => <QuoteCard key={source.id} source={source} />)}</div>
      <div className="interpretation"><span>Interpretation</span><p>{sectionCopy.voices.interpretation}</p></div>
    </section>

    <section id="coverage" className="report-section">
      <SectionHead n="05" eyebrow="Coverage" title="How the day reached different audiences" />
      <AudienceSection id="local" title={sectionCopy.local.title} category="Local Media" copy={sectionCopy.local.copy} />
      <AudienceSection id="national" title={sectionCopy.national.title} category="National Media" copy={sectionCopy.national.copy} />
      <AudienceSection id="creators" title={sectionCopy.creators.title} category="Creators" copy={sectionCopy.creators.copy} />
    </section>

    <section id="fans" className="report-section dark-section">
      <SectionHead n="06" eyebrow="Indicative fan pulse" title={sectionCopy.fans.title} copy={sectionCopy.fans.copy} />
      <div className="fan-themes">{fanThemes.map((theme, index) => <article key={theme.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{theme.title}</h3><p>{theme.body}</p></article>)}</div>
      <div className="quote-grid fan-quotes">{fanQuotes.map((source) => <QuoteCard key={source.id} source={source} quiet />)}</div>
      <p className="method-note">Ordinary fan handles are omitted in the presentation. Original comments remain available at the linked public threads.</p>
    </section>

    <section id="ownership" className="report-section">
      <SectionHead n="07" eyebrow="Ownership implications" title={`${implications.length} observations to keep in view`} />
      <div className="implication-list">{implications.map((item) => <article key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div>
      <div id="watch" className="section-extension">
        <details className="evidence-disclosure"><summary>Positive signals, open questions and watch items</summary>
          <div className="watch-grid"><article className="positive"><span>Positive signals</span>{watchColumns.positive.map((item) => <p key={item}>{item}</p>)}</article><article className="question"><span>Open questions</span>{watchColumns.questions.map((item) => <p key={item}>{item}</p>)}</article><article className="watch"><span>Watch items</span>{watchColumns.watch.map((item) => <p key={item}>{item}</p>)}</article></div>
        </details>
      </div>
    </section>

    <section className="report-section bottom-line"><SectionHead n="08" eyebrow="Synthesis" title="Bottom line" /><p>{edition.bottomLine}</p></section>

    <CinematicDivider label="Part 02 · Word Resonance" />
    <WordResonance />

    <section className="report-section methodology">
      <details open><summary><span>10 · Methodology</span><strong>How to read this report</strong><i>+</i></summary><div className="method-grid"><article><span>Window</span><p>{edition.reportingWindow}</p></article><article><span>Search</span><p>{methodology.searched}</p></article><article><span>Selection</span><p>{methodology.selection}</p></article><article><span>Classification</span><p>{methodology.sentiment}</p></article><article><span>Word Resonance</span><p>{methodology.resonance}</p></article><article><span>Access limitations</span><p>{methodology.limitations}</p></article></div></details>
    </section>

    <section id="ledger" className="report-section ledger-section">
      <SectionHead eyebrow="Traceable evidence" title="Source ledger" copy="The 25 Media Day review records appear alongside supplementary Word Resonance source records. Filter by audience category or sentiment classification; each supplementary row identifies its purpose." />
      <SourceLedger />
    </section>

    <footer className="site-footer"><div><Brand /><p>Prepared for Mat and Phoenix Suns ownership.<br />Evidence first. Direction without overstatement.</p></div><div><span>THE ECHO · SUNS EDITION {edition.number}</span><strong>#DOMINATE</strong><small>{edition.generatedLabel}</small></div><i /></footer>
  </main>;
}
