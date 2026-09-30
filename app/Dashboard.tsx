"use client";

import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Script from "next/script";
import WordResonance from "./WordResonance";
import { alignment, audioBrief, edition, heroMedia, methodology, ownershipBrief, recoveryReport, resonanceReview, sources, ledgerSources, type Source } from "@/data/edition";

const basePath = edition.basePath;
const toneClass = (value: string) => value.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");

function Brand({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? "brand compact" : "brand"} src={`${basePath}/assets/brand/AVC-logo-horizontal-dark.svg`} alt="Accelerated Velocity Consulting" />;
}

function SectionHead({ n, eyebrow, title, copy, as = "header" }: { n?: string; eyebrow: string; title: string; copy?: string; as?: "header" | "div" }) {
  const Tag = as;
  return <Tag className="section-head"><span>{[n, eyebrow].filter(Boolean).join(" · ")}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</Tag>;
}

function CollapsibleSection({ id, n, title, copy, defaultOpen = false, children }: { id: string; n: string; title: string; copy: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return <details id={id} className="report-section accordion-section" open={defaultOpen}>
    <summary className="accordion-summary">
      <SectionHead as="div" n={n} eyebrow={id === "alignment" ? "Alignment" : ""} title={title} copy={copy} />
      <span className="accordion-action"><span className="expand-label">Read</span><span className="collapse-label">Close</span><svg className="accordion-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></span>
    </summary>
    <div className="accordion-panel">{children}</div>
  </details>;
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
      <tbody>{visible.map((source) => <tr key={source.id}><td><strong>{source.source}</strong><small>{source.outlet}<br />{source.themes.join(" · ")}{source.samplePurpose && <><br />{source.samplePurpose}</>}</small><details className="ledger-evidence"><summary>Read source evidence</summary><p>{source.evidence}</p></details></td><td>{source.category}</td><td>{source.date}</td><td><span className={`ledger-tone ${toneClass(source.sentiment)}`}>{source.sentiment}</span></td><td>{source.confidence}</td><td><SourceLink source={source}>{sourceLinkLabel(source)}</SourceLink></td></tr>)}</tbody>
    </table></div>
  </>;
}


function EvidenceTags({ sourceIds }: { sourceIds: string[] }) {
  return <div className="locked-source-tags">{sourceIds.map(id => {
    const source = sources.find(item => item.id === id);
    return source ? <SourceLink key={id} source={source}>{source.id.startsWith("official-") ? source.outlet.replace("Phoenix Suns · ", "").replace(" official interview", " · interview") : source.outlet.split(" / ")[0]}</SourceLink> : null;
  })}</div>;
}

function ReadingCards({ items }: { items: {title: string; body: string; sourceIds: string[]}[] }) {
  return <div className="recovery-reading">{items.map(item => <article key={item.title}>
    <h3>{item.title}</h3><p>{item.body}</p><EvidenceTags sourceIds={item.sourceIds} />
  </article>)}</div>;
}

function AttributedQuote({ source }: { source: Source }) {
  if (!source.quote) return null;
  return <blockquote className="source-quote recovery-quote"><p>{source.quote}</p><footer>
    <strong>{source.speaker} · {source.speakerRole}</strong>
    <small>{source.quoteContext} · {source.date}</small>
    <SourceLink source={source} />
  </footer></blockquote>;
}

function AlignmentEvidence() {
  return <div className="alignment-list">{alignment.map(item => <article className="alignment-card" key={item.id}>
    <header><span>{item.status}</span><h3>{item.title}</h3><p>{item.reading}</p></header>
    <p className="alignment-reading">{item.meaning}</p>
    <details className="alignment-detail"><summary>Read what each person described</summary>
      <div className="alignment-evidence">{item.evidence.map(voice => {
        const source = sources.find(record => record.id === voice.sourceId)!;
        const time = source.evidence.match(/\([^)]*\d:\d[^)]*\)/)?.[0];
        return <article className="alignment-voice" key={voice.speaker}>
          <strong>{voice.speaker}</strong><small>{voice.role}</small>
          <span className="evidence-kind">{source.id.startsWith("official-") ? "Interview summary" : "Reporter’s account"} {time}</span><p>{voice.statement}</p><SourceLink source={source} />
        </article>;
      })}</div>
    </details>
  </article>)}</div>;
}

function FanReading() {
  return <>
    <p className="recovery-note">These comments give us a look at how some fans reacted. The quotes and how we collected them are on Sources.</p>
    <div className="recovery-reading">{recoveryReport.fans.map(item => {
      const topic = resonanceReview.topics.find(record => record.id === item.topicId)!;
      const examples = item.evidenceIds.map(id => topic.fans.evidence.find(record => record.id === id)!);
      return <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p>{examples.map(example => <blockquote className="source-quote recovery-quote" key={example.id}>
        <p>{example.quote}</p><footer><strong>{new URL(example.url).hostname.includes("reddit") ? "Captured r/suns comment" : "Supplied social comment"}</strong><a className="source-link" href={example.url} target="_blank" rel="noreferrer">View source post ↗</a></footer>
      </blockquote>)}</article>;
    })}</div>
    <a className="recovery-map-link" href="#word-resonance">Explore Word Resonance and its evidence ↗</a>
  </>;
}

export default function Dashboard() {
  const [view, setView] = useState<"edition" | "sources">("edition");
  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash;
      setView(["#ledger", "#word-resonance", "#resonance-detail"].includes(hash) ? "sources" : "edition");
      // Wait for the view to become visible before following a deep link.
      requestAnimationFrame(() => {
        const target = document.getElementById(hash.slice(1));
        if (target instanceof HTMLDetailsElement) target.open = true;
        if (target && hash !== "#edition") target.scrollIntoView({ block: "start" });
      });
    };
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
          <p className="hero-date">Phoenix Suns · September 28, 2026 Media Day</p>
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
      <AudioBrief />
      <CollapsibleSection id="readout" n="01" title="The quick read" copy="Players described useful help. Williams’ absence and the Bridges decision give ownership different questions to follow." defaultOpen>
        <div className="ownership-findings">{ownershipBrief.findings.map((finding, index) => <article key={finding.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><h3>{finding.title}</h3><p>{finding.body}</p><EvidenceTags sourceIds={finding.sourceIds} />
        </article>)}</div>
        <article className="ownership-tension"><span>The tension</span><h3>{ownershipBrief.tension.title}</h3><p>{ownershipBrief.tension.body}</p><EvidenceTags sourceIds={ownershipBrief.tension.sourceIds} /></article>
      </CollapsibleSection>
      <CollapsibleSection id="alignment" n="02" title="Where they agreed" copy="Players and leaders described the value of returning together and asking experienced teammates for help.">
        <AlignmentEvidence />
        <AttributedQuote source={sources.find(source => source.id === "booker-continuity")!} />
      </CollapsibleSection>
      <CollapsibleSection id="development" n="03" title="How the help reached players" copy="Players could explain who helped them and what they learned.">
        <ReadingCards items={recoveryReport.development} />
        <p className="recovery-note">The official interview passages are summaries, with timestamps in the source ledger.</p>
      </CollapsibleSection>
      <CollapsibleSection id="coverage" n="04" title="What reporters focused on" copy="Player development, the Bridges decision and Mat’s promise to keep spending led different stories.">
        <ReadingCards items={recoveryReport.coverage} />
        <AttributedQuote source={sources.find(source => source.id === "ap-resources")!} />
        <AttributedQuote source={sources.find(source => source.id === "si-roundup")!} />
      </CollapsibleSection>
      <CollapsibleSection id="fan-response" n="05" title="What fans responded to" copy="Maluach drew enthusiasm. Finding the coverage drew frustration. Roster questions stayed mixed.">
        <FanReading />
      </CollapsibleSection>
      <CollapsibleSection id="ownership" n="06" title="What this means for ownership" copy="Fans wanted to watch. Players could name the help they received. Reporters kept asking about the Bridges decision.">
        <ReadingCards items={recoveryReport.ownership} />
      </CollapsibleSection>
      <CollapsibleSection id="camp" n="07" title="What camp needs to answer" copy="Watch for news on Williams, how the younger players are learning and what follows Mat’s Media Day promises.">
        <ReadingCards items={recoveryReport.camp} />
      </CollapsibleSection>
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
