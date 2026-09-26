import type { Metric, MetricKey } from '../types';

export const METRICS: Metric[] = [
  {
    key: 'qualified',
    label: 'Qualified accounts',
    value: 1284,
    format: 'int',
    contributors: ['signals-ext', 'account-graph', 'orchestrator'],
    note: 'Accounts scoring ICP A/B with intent — surfaced by the graph, ranked by the orchestrator.',
  },
  {
    key: 'pipeline',
    label: 'Pipeline generated',
    value: 4700000,
    format: 'usdCompact',
    contributors: ['orchestrator', 'lifecycle', 'human', 'outcomes', 'channels'],
    note: 'Open opportunity value sourced or influenced by AI-driven next best actions.',
  },
  {
    key: 'activationRate',
    label: 'Activation rate',
    value: 0.68,
    format: 'percent',
    contributors: ['signals-1p', 'account-graph', 'orchestrator', 'channels', 'outcomes'],
    note: 'New customers reaching first meaningful value (first card live + first policy flow).',
  },
  {
    key: 'ttv',
    label: 'Time to value',
    value: 3.2,
    format: 'days',
    contributors: ['account-graph', 'orchestrator', 'channels'],
    note: 'Median days from contract to activated account — compressed by contextual nudges.',
  },
  {
    key: 'adoption',
    label: 'Product adoption',
    value: 0.74,
    format: 'percent',
    contributors: ['signals-1p', 'account-graph', 'orchestrator', 'channels'],
    note: 'Active accounts using 2+ core workflows (cards, approvals, ERP sync, TravelPay).',
  },
  {
    key: 'expansionOpps',
    label: 'Expansion opportunities',
    value: 96,
    format: 'int',
    contributors: ['signals-1p', 'account-graph', 'orchestrator', 'human', 'outcomes'],
    note: 'Open expansion signals: spend growth, entity adds, limit pressure, funding events.',
  },
  {
    key: 'revenue',
    label: 'Revenue influenced',
    value: 12300000,
    format: 'usdCompact',
    contributors: ['outcomes', 'channels', 'human', 'orchestrator'],
    note: 'Closed-won and expansion ARR touched by engine-driven actions (multi-touch).',
  },
  {
    key: 'experimentsRunning',
    label: 'Experiments running',
    value: 23,
    format: 'int',
    contributors: ['experiments', 'orchestrator'],
    note: 'Live holdout-tested changes across audiences, messages, channels and timing.',
  },
  {
    key: 'lift',
    label: 'Conversion lift',
    value: 18,
    format: 'signed',
    contributors: ['experiments', 'orchestrator', 'channels'],
    note: 'Weighted lift from shipped experiment learnings vs. pre-engine baseline.',
  },
];

export const METRIC_MAP: Record<MetricKey, Metric> = Object.fromEntries(
  METRICS.map((m) => [m.key, m]),
) as Record<MetricKey, Metric>;

export function formatMetric(m: Metric, value: number): string {
  switch (m.format) {
    case 'int':
      return Math.round(value).toLocaleString('en-US');
    case 'usdCompact':
      return value >= 1000000
        ? `$${(value / 1000000).toFixed(1)}M`
        : `$${Math.round(value / 1000)}K`;
    case 'percent':
      return `${Math.round(value * 100)}%`;
    case 'days':
      return `${value.toFixed(1)}d`;
    case 'signed':
      return `+${Math.round(value)}%`;
  }
}

/** Compact rendering of a delta applied during simulations. */
export function formatDelta(m: Metric, delta: number): string {
  switch (m.format) {
    case 'int':
      return `${delta >= 0 ? '+' : ''}${delta}`;
    case 'usdCompact':
      return `${delta >= 0 ? '+' : '−'}$${Math.abs(delta / 1000).toFixed(0)}K`;
    case 'percent':
      return `${delta >= 0 ? '+' : '−'}${Math.abs(Math.round(delta * 100))}pp`;
    case 'days':
      return `${delta >= 0 ? '+' : '−'}${Math.abs(delta).toFixed(1)}d`;
    case 'signed':
      return `${delta >= 0 ? '+' : '−'}${Math.abs(Math.round(delta))}pp`;
  }
}
