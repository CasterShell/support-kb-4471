// Which problem a report in a merged ticket belongs to. causes.ts says why a date flips; this file
// adds what the desk already noted by hand: some reports are not a flip at all.
import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

// `oneDay`: the date moved by one day (desk-notes.json, `oneDayMove`). No day/month flip does that.
export type Problem = Cause | 'oneDay' | 'unplaced';

export function problemOf(r: Report, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'oneDay';
  return causeOf(r, tenantOf(r)) ?? 'unplaced';
}

export type ProblemGroup = { problem: Problem; reports: Report[]; tenants: number };

export function splitTicket(reports: Report[], ticket: number, oneDayMove: readonly string[]): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, rs]) => ({ problem, reports: rs, tenants: new Set(rs.map((r) => r.tenant)).size }))
    .sort((a, b) => b.reports.length - a.reports.length);
}
