import type { OpEvent, OpKind } from '../types';

/**
 * Simulated live feed — the events a Growth Engineer watches all day.
 * Each item can open the exact workflow / account / review that produced it,
 * so the path is always Operations → Architecture → Action → Outcome.
 */
export const OPS_TEMPLATES: Omit<OpEvent, 'id' | 'at'>[] = [
  { kind: 'signal', account: 'grupovela.mx', text: 'pricing_page_viewed ×2 — corporate IP, Mexico City', open: { type: 'workflow', id: 'e-signals-1p' } },
  { kind: 'qualification', account: 'Comercializadora Vela', text: 'Qualified account #1,285 — ICP A · funding + finance hiring aligned', open: { type: 'node', id: 'account-graph' } },
  { kind: 'action', account: 'Acme México', text: 'NBA computed — researched outreach, confidence 0.87', open: { type: 'workflow', id: 'e-orch-lanes' } },
  { kind: 'approval', account: 'Acme México', text: 'Review requested — tier-A first touch (gated by policy)', open: { type: 'review', id: 'acme' } },
  { kind: 'approval', account: 'Logística Andina', text: 'Review resolved — AE approved limit proposal in 41s', open: { type: 'review', id: 'andina' } },
  { kind: 'handoff', account: 'Acme México', text: 'SDR → AE handoff complete — meeting with Finance Director booked', open: { type: 'node', id: 'lifecycle' } },
  { kind: 'lifecycle', account: 'Nova Retail', text: 'Trigger fired — account_created 72h ago, no cards issued', open: { type: 'workflow', id: 'e-channels-outcomes' } },
  { kind: 'lifecycle', account: 'Nova Retail', text: 'First card issued — automated nudge path, no human needed', open: { type: 'node', id: 'outcomes' } },
  { kind: 'signal', account: 'Logística Andina', text: 'Spend +41% QoQ flagged — expansion window opened', open: { type: 'node', id: 'account-graph' } },
  { kind: 'signal', account: 'Textiles Monterrey', text: 'Risk 14 → 58 — decline cohort match, CS alerted', open: { type: 'node', id: 'orchestrator' } },
  { kind: 'experiment', text: 'EXP-024 interim readout — +34% reply lift, p<0.05', open: { type: 'exp', id: 'exp-threshold' } },
  { kind: 'learning', text: 'Learning shipped — WhatsApp-first for MX finance directors', open: { type: 'workflow', id: 'e-experiments-orch' } },
  { kind: 'sync', text: 'HubSpot sync complete — 214 records, 0 conflicts', open: { type: 'workflow', id: 'e-human-outcomes' } },
  { kind: 'error', text: 'WhatsApp API 429 — 3 sends queued for retry (backoff, idempotent)', open: { type: 'workflow', id: 'e-channels-outcomes' } },
  { kind: 'error', text: 'Enrichment timeout — 12 accounts deferred to next batch', open: { type: 'workflow', id: 'e-signals-ext' } },
  { kind: 'signal', text: 'Series C announced — MX logistics, 340 → 500 headcount plan', open: { type: 'workflow', id: 'e-signals-ext' } },
  { kind: 'action', account: 'Nova Retail', text: 'NBA computed — in-product doc-approval nudge, confidence 0.91', open: { type: 'workflow', id: 'e-orch-lanes' } },
  { kind: 'qualification', account: 'Andes Foods', text: 'New company detected — 8 sessions from corporate network', open: { type: 'workflow', id: 'e-signals-1p' } },
];

export const OPS_KIND_META: Record<OpKind, { label: string }> = {
  signal: { label: 'Signal' },
  qualification: { label: 'Qualified' },
  action: { label: 'Action' },
  approval: { label: 'Approval' },
  handoff: { label: 'Handoff' },
  lifecycle: { label: 'Lifecycle' },
  experiment: { label: 'Experiment' },
  learning: { label: 'Learning' },
  error: { label: 'Exception' },
  sync: { label: 'Sync' },
};

/** Summary numbers for the Operations board (simulated). */
export const OPS_SUMMARY = {
  accountsDetected: 37,
  prospectsResearched: 61,
  qualifiedToday: 12,
  triggersFired: 48,
  actionsProposed: 96,
  awaitingApproval: 7,
  handoffsToday: 4,
  onboardingInterventions: 23,
  errorsToday: 6,
  reviewBacklog: 7,
  medianDecision: '38s',
  llmSpendToday: '$18.42',
};
