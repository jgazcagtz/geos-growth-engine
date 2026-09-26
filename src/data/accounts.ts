import type { AccountEvent, ScenarioId, ScoreState } from '../types';

/**
 * Synthetic account fixtures — the interview demo's sample "world". Fixtures
 * are SIMULATED data; scenario runs switch the active account so every view
 * (graph, orchestrator, approvals, ops) narrates the same company.
 */
export interface AccountFixture {
  id: string;
  name: string;
  domain: string;
  firmographics: string;
  segment: string;
  /** non-fintech fixture demonstrates the engine is category-agnostic */
  kind: 'fintech' | 'saas';
  base: ScoreState;
}

export const ACCOUNTS: Record<string, AccountFixture> = {
  vela: {
    id: 'vela',
    name: 'Comercializadora Vela',
    domain: 'grupovela.mx',
    firmographics: 'Retail · CDMX · 340 FTE · finance team of 8',
    segment: 'Customer · mid-market ICP A',
    kind: 'fintech',
    base: { icp: 92, intent: 61, engagement: 47, activation: 58, expansion: 39, risk: 22 },
  },
  acme: {
    id: 'acme',
    name: 'Acme México',
    domain: 'acme.com.mx',
    firmographics: 'Retail · CDMX · 320 FTE · finance team of 6',
    segment: 'Prospect · mid-market ICP A',
    kind: 'fintech',
    base: { icp: 91, intent: 74, engagement: 52, activation: 12, expansion: 8, risk: 14 },
  },
  nova: {
    id: 'nova',
    name: 'Nova Retail',
    domain: 'novaretail.mx',
    firmographics: 'E-commerce · Monterrey · 85 FTE · new customer',
    segment: 'Customer · onboarding',
    kind: 'fintech',
    base: { icp: 78, intent: 24, engagement: 41, activation: 34, expansion: 6, risk: 38 },
  },
  andina: {
    id: 'andina',
    name: 'Logística Andina',
    domain: 'logandina.com',
    firmographics: 'Logistics · Bogotá · 410 FTE · 3 entities',
    segment: 'Customer · expansion window',
    kind: 'fintech',
    base: { icp: 84, intent: 35, engagement: 66, activation: 77, expansion: 71, risk: 12 },
  },
  textiles: {
    id: 'textiles',
    name: 'Textiles Monterrey',
    domain: 'textmon.mx',
    firmographics: 'Manufacturing · MTY · 220 FTE · $310K ARR',
    segment: 'Customer · at risk',
    kind: 'fintech',
    base: { icp: 74, intent: 18, engagement: 29, activation: 61, expansion: 22, risk: 58 },
  },
  mediterra: {
    id: 'mediterra',
    name: 'Mediterra Studios',
    domain: 'mediterra.io',
    firmographics: 'SaaS · Barcelona + CDMX · 45 FTE · B2B travel tooling',
    segment: 'Prospect · non-fintech fixture',
    kind: 'saas',
    base: { icp: 71, intent: 48, engagement: 39, activation: 30, expansion: 12, risk: 20 },
  },
};

/** Which fixture a scenario narrates (null = batch/no single account). */
export const SCENARIO_ACCOUNT: Record<ScenarioId, string | null> = {
  acquisition: 'acme',
  activation: 'nova',
  retention: 'textiles',
  expansion: 'andina',
  failure: null,
  blocked: 'andina',
  review: 'vela',
};

/** Scenario → gated review item that belongs to its queue. */
export const SCENARIO_REVIEW: Partial<Record<ScenarioId, string>> = {
  acquisition: 'acme',
  activation: 'nova',
  expansion: 'andina',
};

export const VELA_EVENTS: AccountEvent[] = [
  {
    id: 'pricing',
    label: '3 pricing visits in 48h',
    source: 'Website',
    effects: { intent: 18, engagement: 6 },
    insight: 'Intent climbing — research phase on spend tooling in progress.',
  },
  {
    id: 'funding',
    label: 'Raised Series C · $60M',
    source: 'Funding feed',
    effects: { icp: 3, intent: 8, expansion: 8 },
    insight: 'Funding is the strongest timing trigger in LatAm B2B.',
  },
  {
    id: 'cards',
    label: '40 cards issued · ERP connected',
    source: 'Product',
    effects: { activation: 24, expansion: 12, engagement: 8 },
    insight: 'Core workflows live — account crossing the activation threshold.',
  },
  {
    id: 'decline',
    label: 'Logins −60% · spend −35% (90d)',
    source: 'Product + spend',
    effects: { risk: 34, engagement: -18, expansion: -10 },
    insight: 'Decline pattern matches the churn-risk cohort detected 2 quarters ago.',
  },
];

/** Same engine, different category: SaaS trial milestones instead of card issuance. */
export const MEDITERRA_EVENTS: AccountEvent[] = [
  {
    id: 'trial-signup',
    label: 'Trial started · 12 seats',
    source: 'Product',
    effects: { intent: 10, engagement: 8 },
    insight: 'Team-sized trial — evaluation intent, not a single explorer.',
  },
  {
    id: 'workspace',
    label: 'Workspace + 2 integrations',
    source: 'Product',
    effects: { activation: 22, engagement: 10 },
    insight: 'Setup depth predicts conversion in this cohort.',
  },
  {
    id: 'invite-spread',
    label: 'Daily actives 3 → 17',
    source: 'Product',
    effects: { activation: 14, expansion: 12 },
    insight: 'Organic seat spread — expansion signal before any sales touch.',
  },
  {
    id: 'churn-signal',
    label: 'Weekly actives −45% (30d)',
    source: 'Product',
    effects: { risk: 30, engagement: -16 },
    insight: 'Engagement decay — classic pre-churn pattern for trials.',
  },
];

export const LAB_ACCOUNTS = ['vela', 'mediterra'] as const;
export type LabAccountId = (typeof LAB_ACCOUNTS)[number];

export const LAB_EVENTS: Record<LabAccountId, AccountEvent[]> = {
  vela: VELA_EVENTS,
  mediterra: MEDITERRA_EVENTS,
};
