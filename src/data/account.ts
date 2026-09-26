import type { AccountEvent, ScoreMeta, ScoreState } from '../types';

export const SCORES: ScoreMeta[] = [
  { key: 'icp', label: 'ICP fit', hint: 'How well the company matches the segment’s ideal profile (heuristic 0–100, not a probability)' },
  { key: 'intent', label: 'Intent', hint: 'Active research & buying signals' },
  { key: 'engagement', label: 'Engagement', hint: 'Responsiveness across channels & product' },
  { key: 'activation', label: 'Activation', hint: 'Progress to first meaningful value' },
  { key: 'expansion', label: 'Expansion', hint: 'Signals of growth inside the account' },
  { key: 'risk', label: 'Risk', hint: 'Churn & decline indicators' },
];

export const INITIAL_SCORES: ScoreState = { icp: 92, intent: 61, engagement: 47, activation: 58, expansion: 39, risk: 22 };

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function applyEffects(state: ScoreState, effects: Partial<ScoreState>): ScoreState {
  const next = { ...state };
  for (const key of Object.keys(effects) as (keyof ScoreState)[]) {
    next[key] = clamp(next[key] + (effects[key] ?? 0));
  }
  return next;
}

export function deriveStage(s: ScoreState): string {
  if (s.risk >= 55) return 'Customer · At risk';
  if (s.icp >= 70 && s.intent >= 60 && s.activation < 20) return 'Prospect · Qualified';
  if (s.activation >= 72 && s.expansion >= 55) return 'Customer · Expansion-ready';
  if (s.activation >= 50) return 'Customer · Activating';
  if (s.icp >= 70) return 'Prospect · Nurturing';
  return 'Prospect · Discovering';
}

export interface DerivedAction {
  headline: string;
  why: string;
  channel: string;
}

export function deriveAction(s: ScoreState): DerivedAction {
  if (s.risk >= 55) {
    return {
      headline: 'CS intervention — save motion',
      why: 'Risk {risk} with engagement decline — matches the churn-cohort pattern detected last quarter.',
      channel: 'CS alert + call task',
    };
  }
  if (s.expansion >= 55 && s.activation >= 55) {
    return {
      headline: 'Expansion review — limits & entities',
      why: 'Expansion {expansion} with activation {activation}: spend growing into card limits.',
      channel: 'AE brief + CS alert',
    };
  }
  if (s.intent >= 70 && s.icp >= 70) {
    return {
      headline: 'Personalized outreach — finance director',
      why: 'ICP {icp} + intent {intent}: active buying window on spend tooling.',
      channel: 'Email + SDR task',
    };
  }
  if (s.activation < 50) {
    return {
      headline: 'Activation nudge — first policy flow',
      why: 'Activation {activation}: onboarding started but core workflow not yet adopted.',
      channel: 'In-product guide + admin email',
    };
  }
  return {
    headline: 'Maintain — monthly value digest',
    why: 'Scores stable (ICP {icp} · intent {intent} · engagement {engagement}) — no timing trigger active.',
    channel: 'Email digest',
  };
}

/** Kept for the lab panel’s static relationship readout (fixture metadata). */
export const GRAPH_RELATIONSHIPS: { label: string; value: string }[] = [
  { label: 'People', value: '38 contacts' },
  { label: 'Product events', value: '12.4k / mo' },
  { label: 'CRM', value: '214 records' },
  { label: 'Spend', value: '$3.9M / yr' },
  { label: 'Engagement', value: '7 threads' },
  { label: 'Intent', value: '3 sources' },
];

export const GRAPH_ENRICHMENT = [
  'Identity resolution · clean',
  'Firmographics · enriched',
  'Technographics · SAP + local payroll',
  'Stakeholders · 6 mapped',
  'Data freshness · 4 min ago',
];

export type { AccountEvent };
