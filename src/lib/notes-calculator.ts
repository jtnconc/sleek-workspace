import { toISODate } from "./note-parser";

/**
 * Recognizes a two-date range written as "<date> - <date>" (spaces around the
 * dash) anywhere inside the note and returns the number of nights between
 * them. The date on each side may be written with or without a space between
 * day and month ("1sep", "1 sep", "12 de sep"), and surrounding words are
 * ignored.
 */
export function parseNightsFromText(
  text: string,
  today = new Date(),
): { nights: number; from: string; to: string } | null {
  const separator = /\s+-\s+/g;
  let match: RegExpExecArray | null;

  while ((match = separator.exec(text)) !== null) {
    const leftTokens = text.slice(0, match.index).trim().split(/\s+/).filter(Boolean);
    const rightTokens = text
      .slice(match.index + match[0].length)
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    for (let l = Math.min(4, leftTokens.length); l >= 1; l--) {
      const from = toISODate(leftTokens.slice(leftTokens.length - l).join(" "), today);
      if (!isISO(from)) continue;

      for (let r = Math.min(4, rightTokens.length); r >= 1; r--) {
        const to = toISODate(rightTokens.slice(0, r).join(" "), today);
        if (!isISO(to)) continue;

        const nights = Math.round(
          (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000,
        );
        if (!Number.isFinite(nights) || nights <= 0) continue;

        return { nights, from, to };
      }
    }
  }

  return null;
}


const isISO = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));

/**
 * Recognizes a rate expression such as "159 x5", "159 +10% x5" or
 * "159.50 + 7% x 3" and computes the resulting total.
 */
export function parseRateFromText(
  text: string,
): { rate: number; taxPercent: number; nights: number; total: number } | null {
  const match = text.match(
    /(\d+(?:[.,]\d+)?)\s*(?:\+\s*(\d+(?:[.,]\d+)?)\s*%)?\s*[x×*]\s*(\d+(?:[.,]\d+)?)/i,
  );
  if (!match) return null;

  const num = (v: string | undefined, fallback = 0) =>
    v === undefined ? fallback : Number(v.replace(",", "."));

  const rate = num(match[1]);
  const taxPercent = num(match[2]);
  const nights = num(match[3]);
  if (!Number.isFinite(rate) || !Number.isFinite(nights)) return null;

  const total = Math.round(rate * (1 + taxPercent / 100) * nights * 100) / 100;
  return { rate, taxPercent, nights, total };
}
