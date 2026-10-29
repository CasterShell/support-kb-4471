<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { splitTicket, ticketSize, type Problem } from '#lib/kb/problems';

  // `issues`: the ticket that tracks each problem, and where it stands, by problem.
  type Issue = { url: string; state: string };
  let { ticket, issues }: { ticket: number; issues: Partial<Record<Problem, Issue>> } = $props();

  const LABEL: Record<Problem, string> = {
    parser: 'shared parser reads day-first dates month first',
    hint: 'booking-v3 hint says MM/DD/YYYY, the form reads day first',
    oneDay: 'date moves by one day (time zone), not a flip',
    unplaced: 'no tenant on file',
  };

  const groups = $derived(splitTicket(reports as Report[], ticket, notes.oneDayMove));
  const total = $derived(ticketSize(reports as Report[], ticket));
</script>

<p class="sum">
  <strong>{total}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'}
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>ticket</th><th>state</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const issue = issues[g.problem]}
      <tr>
        <td>{LABEL[g.problem]} <code>{g.problem}</code></td>
        <td>{g.reports.length}{#if g.filedUnder}<span class="filed"> (filed under <code>{g.filedUnder}</code>)</span>{/if}</td>
        <td>{g.tenants}</td>
        <td>
          {#if issue}
            <a href={issue.url}>{issue.url.replace(/^.*\/issues\//, 'issue #')}</a>
          {:else}
            <span class="none">no ticket yet</span>
          {/if}
        </td>
        <td>{issue?.state ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
  .filed { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); font-weight: 600; }
</style>
