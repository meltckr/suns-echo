import type { ResonanceReading, ResonanceSide, ResonanceTopic } from "./edition";

export type ResonanceView = "all" | "both" | ResonanceSide;
const weight = { none: 0, low: 1, medium: 2, high: 3 };

export function matchesAudience(topic: ResonanceTopic, view: ResonanceView) {
  if (view === "all") return true;
  if (view === "both") return topic.fans.count > 0 && topic.media.count > 0;
  return topic[view].count > 0;
}

export function volumeForView(topic: ResonanceTopic, view: ResonanceView) {
  if (view === "fans" || view === "media") return topic[view].volume;
  return weight[topic.fans.volume as keyof typeof weight] >= weight[topic.media.volume as keyof typeof weight] ? topic.fans.volume : topic.media.volume;
}

export function balanceLabel(reading: ResonanceReading) {
  if (reading.score === null) return "Unscored";
  if (reading.score > 0) return "Positive";
  if (reading.score < 0) return "Negative";
  const codes = reading.evidence.map(item => item.code);
  return codes.includes(1) && codes.includes(-1) ? "Mixed" : "Neutral";
}

export function balanceTone(reading: ResonanceReading) {
  if (reading.score === null) return "unscored";
  return reading.score > 0 ? "positive" : reading.score < 0 ? "negative" : "neutral";
}

export function balanceScore(reading: ResonanceReading) {
  return reading.score === null ? "No scored opinion" : `${reading.score > 0 ? "+" : ""}${reading.score.toFixed(2)}`;
}

export function unitCounts(reading: ResonanceReading) {
  const units = new Map<string, number[]>();
  for (const item of reading.evidence) {
    if (item.code !== null) units.set(item.unit, [...(units.get(item.unit) ?? []), item.code]);
  }
  const result = { positive: 0, negative: 0, neutral: 0 };
  for (const codes of units.values()) {
    const sum = codes.reduce((a, b) => a + b, 0);
    result[sum > 0 ? "positive" : sum < 0 ? "negative" : "neutral"]++;
  }
  return result;
}
