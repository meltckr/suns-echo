"use client";

import { useEffect, useRef } from "react";
import { cinematicDivider, edition } from "@/data/edition";

export default function CinematicDivider({ label }: { label: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 800px)");
    let inView = false;
    const sync = () => {
      element.poster = mobile.matches ? cinematicDivider.portraitPoster : cinematicDivider.poster;
      if (preference.matches || !inView) element.pause();
      else void element.play().catch(() => { /* Preserve the poster when autoplay is unavailable. */ });
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.2 });
    observer.observe(element);
    preference.addEventListener("change", sync);
    mobile.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      mobile.removeEventListener("change", sync);
    };
  }, []);

  return <div className="cinematic-divider" aria-label={`${edition.title} · ${label}`}>
    <video ref={video} muted playsInline preload="none" poster={cinematicDivider.poster} aria-hidden="true">
      <source src={cinematicDivider.portrait} type="video/mp4" media="(max-width: 800px)" />
      <source src={cinematicDivider.landscape} type="video/mp4" />
    </video>
    <span>{label}</span>
  </div>;
}
