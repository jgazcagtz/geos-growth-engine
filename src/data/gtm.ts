import type { CopilotContact, CopilotDraft, CopilotSignal, HandoffObject, LifecycleEventDef, TriggerRule } from '../types';

/* ------------------------------ SDR Copilot ------------------------------ */

export const COPILOT_CONTACTS: CopilotContact[] = [
  { name: 'Mariana Ruiz', role: 'CFO', persona: 'Economic buyer', engagement: 'Opened 2 emails' },
  { name: 'Diego Fuentes', role: 'Finance Director', persona: 'Champion · new in role', engagement: 'Pricing ×3' },
  { name: 'Ana Beltrán', role: 'Procurement', persona: 'Evaluator · AP owner', engagement: 'No touch yet' },
  { name: 'Luis Ochoa', role: 'Operations', persona: 'Implementer · ERP admin', engagement: 'Attended webinar' },
];

export const COPILOT_SIGNALS: CopilotSignal[] = [
  { text: 'Pricing page visited ×3 (48h)', when: '18 min ago', source: 'Website' },
  { text: 'Corporate cards page visited', when: '2h ago', source: 'Website' },
  { text: 'Series B announced · $60M', when: '6d ago', source: 'Funding feed' },
  { text: 'Finance Director joined (new in role)', when: '3d ago', source: 'Enrichment' },
  { text: '+35% finance headcount YoY', when: 'daily batch', source: 'Enrichment' },
  { text: 'Opened pricing FAQ email ×2', when: 'last week', source: 'Email' },
];

export const COPILOT_SUMMARY =
  'Strong ICP account showing increasing commercial intent. Finance leadership appears to be evaluating spend-management solutions — likely triggered by Series B growth and a new Finance Director. Recommend fast, personalized WhatsApp outreach to the Finance Director, looping in the CFO after first reply.';

export const COPILOT_NBA_CHAIN: { step: string; state: 'done' | 'current' | 'pending' }[] = [
  { step: 'Research buying committee', state: 'done' },
  { step: 'Generate account brief', state: 'done' },
  { step: 'Prepare SDR outreach', state: 'current' },
  { step: 'Human review', state: 'pending' },
];

export const COPILOT_DRAFT: CopilotDraft = {
  channel: 'WhatsApp',
  localization: 'es-419 · learned channel (EXP-012 shipped learning)',
  confidence: 0.87,
  provenance: ['CRM', 'Product', 'Web intent', 'Enrichment', 'AI-drafted · prompt v3'],
  text:
    'Hola Diego — vi que el equipo de Comercializadora Vela estuvo revisando nuestras páginas de precios esta semana. ' +
    'Con el crecimiento del equipo financiero, normalmente la primera fricción aparece en el gasto de empleados y la conciliación. ' +
    'La plataforma unifica tarjetas corporativas, aprobaciones y conciliación en un solo lugar. ' +
    '¿Tienes 15 minutos esta semana? Equipos similares en retail en México ahorran ~6 h/semana en administración de gastos.',
};

export const COPILOT_RESEARCH_MORE: string[] = [
  'Headcount +12% QoQ — operations team growing fastest',
  'SAP contract renewal in ~5 months (technographics)',
  '2 new subsidiaries registered last quarter (registry data)',
];

/* ------------------------------ SDR → AE handoff ------------------------------ */

export const HANDOFF_FLOW = [
  'Prospect',
  'Qualified',
  'Engaged',
  'Meeting intent',
  'Qualification threshold',
  'Routing logic',
  'Correct AE',
  'CRM context',
  'Meeting',
  'Opportunity',
] as const;

export const HANDOFF_BAD =
  '“John booked a meeting.” — no context. The AE re-researches from zero, asks the SDR what happened, and walks into the call cold.';

export const HANDOFF_GOOD: HandoffObject = {
  account: 'Acme México · 320 employees · retail · MX City · ICP A (91)',
  contact: 'Mariana Ruiz — Finance Director · booked via WhatsApp first-touch',
  qualification: [
    'Pricing page ×3 + corporate cards page (48h)',
    '+35% finance headcount YoY · Series B, $60M',
    'Budget owner confirmed: CFO engaged after first reply',
  ],
  conversation: [
    'WhatsApp reply in 11h — asked about ERP integration (SAP)',
    'CFO looped in on email — requested security documentation',
    'Objection so far: migration effort from spreadsheets',
  ],
  pains: ['Decentralized employee spending', 'Reconciliation overhead month-end', 'No real-time spend visibility for the CFO'],
  productInterest: ['Corporate cards (virtual first)', 'Approval flows', 'ERP sync · Smart Match'],
  intent: ['Pricing ×3 in 48h', 'Opened security page after CFO joined', 'Webinar attendee (Operations) in account'],
  talkingPoints: [
    'Spend controls for a scaling finance team (headcount +35%)',
    'ERP migration story — SAP customers in retail MX, 2-week onboarding',
    'Benchmark: similar retail accounts save ~6 h/week on admin',
  ],
  source: 'Workflow outbound-qualification-v2 · variant B · learning: WhatsApp-first MX',
  research: 'AI account brief attached (growth funding, finance hiring, ERP contract timing)',
  crmHistory: 'No prior opportunity · 2 email touches · 1 WhatsApp thread · all interactions logged',
};

/* ------------------------------ lifecycle automation ------------------------------ */

export const LIFECYCLE_EVENTS: LifecycleEventDef[] = [
  { event: 'account_created', meaning: 'Company signed up', stage: 'signup' },
  { event: 'company_verified', meaning: 'KYB / docs approved', stage: 'signup' },
  { event: 'admin_invited', meaning: 'Admin account active', stage: 'setup' },
  { event: 'card_created', meaning: 'First card issued', stage: 'activation' },
  { event: 'employee_invited', meaning: 'Team rollout started', stage: 'setup' },
  { event: 'first_transaction', meaning: 'Money moved on the platform', stage: 'activation' },
  { event: 'receipt_uploaded', meaning: 'Expense hygiene started', stage: 'adoption' },
  { event: 'policy_created', meaning: 'Spend policy configured', stage: 'activation' },
  { event: 'integration_connected', meaning: 'ERP / accounting sync live', stage: 'adoption' },
  { event: 'inactive_7d', meaning: 'No admin activity for a week', stage: 'retention' },
  { event: 'usage_declining', meaning: 'Core workflow usage falling', stage: 'retention' },
  { event: 'high_spend_growth', meaning: 'Spend outgrowing current limits', stage: 'expansion' },
];

export const TRIGGER_RULE: TriggerRule = {
  trigger: 'account_created +72h · no employee_invited · no card_created',
  interpretation: 'Likely onboarding friction — admin signed up but team activation stalled (matches the stall cohort).',
  action: 'Select onboarding intervention by setup state (docs approved? admin active?)',
  channel: 'WhatsApp (day-1 learning) · email fallback if unread in 24h',
  personalization: 'Role (admin) · setup step 2/4 · previously opened pricing FAQ',
  success: 'card_created within 7 days',
  guardrail: 'Max 2 lifecycle touches / week · opt-out and quiet hours enforced',
};
