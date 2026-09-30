"use client";

import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Script from "next/script";
import WordResonance from "./WordResonance";
import { audioBrief, edition, heroMedia, methodology, sources, ledgerSources, type Source } from "@/data/edition";

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


function EvidenceTags({ sourceIds }: { sourceIds: string[] }) {
  return <div className="locked-source-tags">{sourceIds.map(id => {
    const source = sources.find(item => item.id === id);
    return source ? <SourceLink key={id} source={source} /> : null;
  })}</div>;
}

export default function Dashboard() {
  const [view, setView] = useState<"edition" | "sources">("edition");
  useEffect(() => {
    const sync = () => setView(["#ledger", "#word-resonance", "#resonance-detail"].includes(window.location.hash) ? "sources" : "edition");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  async function share() {
    const payload = { title: edition.title, text: edition.subtitle, url: window.location.href };
    if (navigator.share) await navigator.share(payload);
    else await navigator.clipboard.writeText(window.location.href);
  }

  return <main>
    <header className="topbar"><Brand compact /><span>Ownership Intelligence</span><div><button onClick={() => window.print()}>Print</button><button onClick={share}>Share</button></div></header>
    <AudioBrief />
    <nav className="section-nav" aria-label="Edition views">
      <a href="#edition" aria-current={view === "edition" ? "page" : undefined} onClick={() => setView("edition")}>Edition</a>
      <a href="#ledger" aria-current={view === "sources" ? "page" : undefined} onClick={() => setView("sources")}>Sources</a>
    </nav>
    <div id="edition" hidden={view !== "edition"}>
      <section className="hero" style={{ "--hero-poster": `url("${heroMedia.poster}")`, "--hero-portrait-poster": `url("${heroMedia.portraitPoster}")` } as CSSProperties}>
        <HeroMedia />
        <div className="hero-art" aria-hidden="true"><span>THE</span><strong>ECHO</strong><i /></div>
        <div className="hero-copy">
          <div className="hero-marks"><img src={`${basePath}/assets/teams/suns-logo.svg`} alt="Phoenix Suns" /><span>AVC · OWNERSHIP INTELLIGENCE</span></div>
          <p className="eyebrow">{edition.series} · EDITION {edition.number}</p>
          <h1>{edition.title}</h1>
          <p className="hero-thesis locked-paragraph">{edition.lockedCopy[0].text}</p>
          <EvidenceTags sourceIds={edition.lockedCopy[0].sourceIds} />
        </div>
      </section>
      <article className="report-section locked-copy" aria-label={edition.title}>
        {edition.lockedCopy.slice(1).map((paragraph, index) => <section className="locked-passage" key={index}>
          <p className="locked-paragraph">{paragraph.text}</p>
          <EvidenceTags sourceIds={paragraph.sourceIds} />
        </section>)}
      </article>
    </div>
    <div hidden={view !== "sources"}>
      <section id="ledger" className="report-section ledger-section">
        <SectionHead eyebrow="Sources" title="Source ledger" copy={`${edition.sourceCount} Media Day review records + ${ledgerSources.length - sources.length} supplementary Word Resonance records · eight official interviews.`} />
        <SourceLedger />
        <details className="methodology"><summary>How to read this report</summary><div className="method-grid">
          <article><span>Window</span><p>{edition.reportingWindow}</p></article>
          <article><span>Selection</span><p>{methodology.selection}</p></article>
          <article><span>Search</span><p>{methodology.searched}</p></article>
          <article><span>Classification</span><p>{methodology.sentiment}</p></article>
          <article><span>Word Resonance</span><p>{methodology.resonance}</p></article>
          <article><span>Access limitations</span><p>{methodology.limitations}</p></article>
        </div></details>
      </section>
      <WordResonance />
    </div>
    <footer className="site-footer"><div><Brand /><p>Prepared for Mat and Phoenix Suns ownership.</p></div><div><span>THE ECHO · SUNS EDITION {edition.number}</span><strong>#DOMINATE</strong><small>{edition.generatedLabel}</small></div><i /></footer>
  </main>;
}
