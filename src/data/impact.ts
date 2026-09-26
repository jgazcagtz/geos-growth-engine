import type { Attribution, ImpactMetric, LoopStage } from '../types';

/**
 * Role-aligned impact metrics with honest attribution levels.
 * ATTRIBUTED = holdout or single-touch proof · INFLUENCED = part of a
 * multi-touch path · CORRELATED = observed association, no causal claim.
 */
export const ATTRIBUTION_META: Record<Attribution, { label: string; definition: string }> = {
  attributed: {
    label: 'Attributed',
    definition:
      'Compared against a randomized holdout group; the difference is attributed to the engine within that comparison. Single-touch evidence alone is NOT shown as attributed.',
  },
  influenced: {
    label: 'Influenced',
    definition: 'Part of a multi-touch path — the engine contributed; other touches also contributed.',
  },
  correlated: {
    label: 'Correlated',
    definition: 'Observed association only — no causal claim. Listed to keep the scoreboard honest.',
  },
};

export const IMPACT_METRICS: ImpactMetric[] = [
  { key: 'meetings', label: 'Meetings booked (30d)', value: '47', attribution: 'influenced', trend: '+12 vs prior', note: 'Discovery meetings from AI-researched sequences and handoffs.' },
  { key: 'qualified-meetings', label: 'Qualified meetings held', value: '31', attribution: 'influenced', trend: '66% show rate', note: 'Meetings that passed qualification evidence review.' },
  { key: 'sql-conversion', label: 'SQL → opportunity', value: '66%', attribution: 'attributed', trend: '+9pp vs holdout', note: '5% audience holdout isolates the engine’s effect.' },
  { key: 'pipeline', label: 'Pipeline generated (QTD)', value: '$1.84M', attribution: 'attributed', trend: '$307K / SDR', note: 'Opportunities sourced by engine actions vs matched holdout.' },
  { key: 'signal-contact', label: 'Signal → first contact', value: '26 min', attribution: 'attributed', trend: 'was 2.1 days', note: 'Median SLA from intent spike to human-approved touch.' },
  { key: 'research-saved', label: 'SDR research time saved', value: '11.4 h/wk', attribution: 'correlated', trend: 'per SDR', note: 'Time-tracking diff + SDR survey; AI briefs replace manual research.' },
  { key: 'activation', label: 'Signup → activation', value: '68%', attribution: 'attributed', trend: '+7pp vs holdout', note: 'Activated / new signups within 7 days · rolling 90d · includes the current simulated run.' , liveKey: 'activationRate' },
  { key: 'ttv', label: 'Time to activation', value: '3.2 days', attribution: 'attributed', trend: '−1.1d this year', note: 'Median days contract → activated · rolling 90d · includes the current simulated run.', liveKey: 'ttv' },
  { key: 'cac-payback', label: 'CAC payback', value: '11.8 mo', attribution: 'correlated', trend: 'was 14.2 mo', note: 'Blended improvement — engine is one of several drivers.' },
  { key: 'revenue', label: 'Revenue influenced', value: '$12.3M', attribution: 'influenced', trend: 'ARR multi-touch', note: 'Closed-won + expansion ARR touched by engine actions.' },
  { key: 'retention', label: 'Net revenue retention', value: '118%', attribution: 'influenced', trend: '+4pp YoY', note: 'Risk interventions + expansion detection contribute.' },
  { key: 'hours', label: 'Automation hours saved', value: '4,100 h/yr', attribution: 'correlated', trend: '≈ 2.4 FTE', note: 'Research, routing, reporting and follow-up tasks automated.' },
];

/** The build → measure → iterate loop, told with a real in-flight example. */
export const LOOP_STAGES: LoopStage[] = [
  { key: 'problem', label: 'Problem', example: 'MX finance directors ignore cold email (2.1% reply)' },
  { key: 'hypothesis', label: 'Hypothesis', example: 'WhatsApp-first first-touch lifts replies for this segment' },
  { key: 'build', label: 'Build', example: 'Customer.io + WA template + holdout split, 2 days' },
  { key: 'ship', label: 'Ship', example: 'n = 420 MX ICP A/B finance-director contacts' },
  { key: 'measure', label: 'Measure', example: '24.6% vs 11.2% reply · p < 0.01 · guardrails clean' },
  { key: 'learn', label: 'Learn', example: 'Learning shipped — channel weights updated in orchestrator' },
  { key: 'decide', label: 'Scale / kill', example: 'Scaled to MX ICP A/B · EXP-017 killed (no lift)' },
];
