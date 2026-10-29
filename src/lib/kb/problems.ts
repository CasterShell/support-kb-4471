// Which problems a merged ticket holds. Counted the way the desk's view counts (CauseTable): each
// report where it is filed, by tenant (causes.ts). Reports the desk read as a one-day move
// (desk-notes.json, `oneDayMove`) are a problem of their own, listed again under it.
import { causeOf, uniqueById, type Cause, type Report } from '#lib/kb/causes';
import { tenantOf } from '#lib/kb/locales';

// `oneDay`: the date moved by one day. No day/month flip does that.
export type Problem = Cause | 'oneDay' | 'unplaced';

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  // Set when these reports are also counted in another group, where they are filed.
  filedUnder?: Problem;
};

export function splitTicket(reports: Report[], ticket: number, oneDayMove: readonly string[]): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = causeOf(r, tenantOf(r)) ?? 'unplaced';
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const tenants = (rs: Report[]) => new Set(rs.map((r) => r.tenant)).size;
  const groups: ProblemGroup[] = [...by.entries()]
    .map(([problem, rs]) => ({ problem, reports: rs, tenants: tenants(rs) }))
    .sort((a, b) => b.reports.length - a.reports.length);

  const moved = merged.filter((r) => oneDayMove.includes(r.id));
  if (moved.length) {
    const homes = [...new Set(moved.map((r) => causeOf(r, tenantOf(r)) ?? 'unplaced'))];
    groups.push({ problem: 'oneDay', reports: moved, tenants: tenants(moved), filedUnder: homes.length === 1 ? homes[0] : undefined });
  }
  return groups;
}

// Reports in the ticket, each once.
export function ticketSize(reports: Report[], ticket: number): number {
  return uniqueById(reports).filter((r) => r.mergedInto === ticket).length;
}
