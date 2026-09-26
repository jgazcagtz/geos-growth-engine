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
  /* vertical-scenario fixtures — one per LatAm B2B category in the library */
  cultura: {
    id: 'cultura',
    name: 'Cultura Eats',
    domain: 'cultura-eats.com',
    firmographics: 'Ghost kitchens · CDMX + Bogotá · 640 FTE · hiring +34% YoY',
    segment: 'Prospect · HR-tech ICP A',
    kind: 'saas',
    base: { icp: 88, intent: 68, engagement: 44, activation: 8, expansion: 6, risk: 12 },
  },
  carga: {
    id: 'carga',
    name: 'Carga Directa',
    domain: 'cargadirecta.mx',
    firmographics: 'Freight brokerage · Monterrey · 290 FTE · $210K ARR',
    segment: 'Customer · post-migration watch',
    kind: 'saas',
    base: { icp: 82, intent: 22, engagement: 31, activation: 64, expansion: 28, risk: 49 },
  },
  moda: {
    id: 'moda',
    name: 'Moda Circular',
    domain: 'modacircular.com.br',
    firmographics: 'DTC fashion · São Paulo · 148 FTE · ~R$14M GMV',
    segment: 'Prospect · payments ICP A',
    kind: 'saas',
    base: { icp: 86, intent: 72, engagement: 48, activation: 6, expansion: 5, risk: 11 },
  },
  valle: {
    id: 'valle',
    name: 'Corredora Seguros del Valle',
    domain: 'segurosdelvalle.co',
    firmographics: 'Insurance broker · Medellín · 180 FTE · embedded SME lines',
    segment: 'Customer · expansion window',
    kind: 'saas',
    base: { icp: 85, intent: 30, engagement: 69, activation: 78, expansion: 69, risk: 10 },
  },
  sanpedro: {
    id: 'sanpedro',
    name: 'Agroinsumos San Pedro',
    domain: 'agrosanpedro.mx',
    firmographics: 'Agro distributor · Jalisco · 240 FTE · ERP: legacy',
    segment: 'Customer · onboarding',
    kind: 'saas',
    base: { icp: 76, intent: 20, engagement: 38, activation: 29, expansion: 8, risk: 41 },
  },
  delta: {
    id: 'delta',
    name: 'Inmobiliaria Delta',
    domain: 'inmdelta.mx',
    firmographics: 'Property management · CDMX · 360 FTE · renewal −45d',
    segment: 'Customer · at risk (billing trust)',
    kind: 'saas',
    base: { icp: 73, intent: 16, engagement: 42, activation: 58, expansion: 19, risk: 44 },
  },
  vitalia: {
    id: 'vitalia',
    name: 'Clínicas Vitalia',
    domain: 'vitalia.com.co',
    firmographics: 'Occupational health · Bogotá · 520 FTE · 7 clinics',
    segment: 'Customer · multi-site rollout',
    kind: 'saas',
    base: { icp: 79, intent: 18, engagement: 51, activation: 41, expansion: 24, risk: 33 },
  },
  meridiano: {
    id: 'meridiano',
    name: 'Grupo Meridiano',
    domain: 'meridiano.com.br',
    firmographics: 'Financial group · São Paulo · 900 FTE · seats 91% utilized',
    segment: 'Customer · expansion window',
    kind: 'saas',
    base: { icp: 87, intent: 26, engagement: 72, activation: 82, expansion: 77, risk: 9 },
  },
  ferreyra: {
    id: 'ferreyra',
    name: 'Estudio Ferreyra',
    domain: 'ferreyra.mx',
    firmographics: 'Law firm · CDMX + GDL · 310 FTE · privileged data',
    segment: 'Prospect · compliance ICP A',
    kind: 'saas',
    base: { icp: 84, intent: 66, engagement: 40, activation: 7, expansion: 5, risk: 13 },
  },
  fintra: {
    id: 'fintra',
    name: 'Fintra',
    domain: 'fintra.com.br',
    firmographics: 'Lending platform · São Paulo · 210 FTE · API-first',
    segment: 'Customer · integration watch',
    kind: 'saas',
    base: { icp: 81, intent: 19, engagement: 47, activation: 71, expansion: 31, risk: 52 },
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
  payroll: 'cultura',
  logistics: 'carga',
  payments: 'moda',
  insurtech: 'valle',
  agtech: 'sanpedro',
  proptech: 'delta',
  healthtech: 'vitalia',
  edtech: 'meridiano',
  cyber: 'ferreyra',
  openfinance: 'fintra',
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
