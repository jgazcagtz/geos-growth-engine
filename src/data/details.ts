import type { NodeDetail, NodeId } from '../types';

/**
 * Panel content for every architecture node.
 * Deliberately opinionated and segment-specific: LatAm markets, corporate
 * cards, spend workflows, ERP integrations, compliance posture.
 */
export const DETAILS: Record<NodeId, NodeDetail> = {
  'signals-1p': {
    id: 'signals-1p',
    tagline: 'Everything the company already knows, captured continuously.',
    purpose:
      'Stream every first-party event — web, product, CRM, conversations, spend — into one pipe so no growth decision is made on stale or partial data.',
    inputs: [
      'Website & content engagement (page-level, resolved to companies)',
      'Product telemetry: cards issued, approval flows, ERP sync, TravelPay activity',
      'CRM objects: accounts, contacts, opportunities, stages, owners',
      'Sales calls & notes (topics, objections, sentiment)',
      'Support tickets & resolution signals',
      'Email engagement per contact and sequence',
      'Corporate spend behavior: volume, velocity, policy events',
    ],
    deterministic: [
      'Event schemas & identity keys owned by data engineering',
      'PII hashed at ingest; only derived features leave the pipe',
      'Backfill windows & freshness SLOs per source',
    ],
    outputs: ['Normalized event stream', 'Resolved web-to-company sessions', 'Spend behavior features for scoring'],
    example: {
      signal: 'Pricing page visited 3× in 48h from an unresolved corporate network.',
      reasoning: 'IP + reverse-DNS matching resolves the cluster to a company; visits become intent features.',
      action: 'Intent event appended to the account graph within 60 seconds.',
    },
    implementation: [
      'Website: server-side events → ingest API (segment/GTM-class capture)',
      'Product: event stream → warehouse → feature pipeline',
      'CRM: HubSpot webhooks → normalize → graph upsert',
      'Orchestration: n8n or lightweight TypeScript services',
      'PII hashed at ingest (LFPDPPP / LGPD scope)',
    ],
    kpi: 'Signal freshness — 92% of decisioning reads data < 5 minutes old.',
  },
  'signals-ext': {
    id: 'signals-ext',
    tagline: 'The market tells you who is about to buy — listen.',
    purpose:
      'Enrich every account with firmographic, funding, hiring, technographic and intent context, and detect the external events that change timing.',
    inputs: [
      'Company registries & firmographics (MX · BR · CO coverage)',
      'Funding events (strongest single expansion trigger)',
      'Hiring boards — finance & ops roles signal spend-tooling change',
      'Technographics: ERP, payroll, travel stack detected',
      'Third-party intent & research surges',
      'Market signals: regulation, FX, cross-border corridors',
    ],
    deterministic: [
      'Vendor contracts & data licensing per provider',
      'Match thresholds before merge (no fuzzy overwrites)',
      'Daily batch with change-data-capture into the graph',
    ],
    ai: ['Entity matching & dedupe across providers', 'Event salience: which change actually matters for this ICP'],
    outputs: ['Enriched firmographics & technographics', 'Timing events feed (funding, hiring, expansion)'],
    example: {
      signal: 'Series B announced — Mexico City logistics company, 340 → 500 headcount plan.',
      reasoning: 'Funding + finance hiring + ERP contract expiring = spend-tooling buying window.',
      action: 'Timing score rises; account enters the “why now” queue.',
    },
    implementation: [
      'Clay / Amplemarket / Apollo-class enrichment APIs under license',
      'Funding + hiring feeds from licensed data providers',
      'Nightly batch + change-data-capture into the graph',
      'LLM entity matching with below-threshold human review',
    ],
    kpi: 'Match rate — 96% of target accounts enriched across MX/BR/CO sources.',
  },
  'account-graph': {
    id: 'account-graph',
    tagline: 'One living memory per company — the substrate for every decision.',
    purpose:
      'Resolve every signal into a single, enriched, scored account. The graph is company-level memory: people, product behavior, spend, engagement, intent and lifecycle in one queryable place.',
    inputs: [
      'All first-party streams (web, product, CRM, email, support, spend)',
      'All external enrichment (firmographics, funding, hiring, technographics)',
      'Historic interactions: every touch the team ever made',
    ],
    deterministic: [
      'Identity resolution: anonymous web → company → person, with review thresholds',
      'Dedup & merge rules owned by RevOps (no silent overwrites)',
      'Lifecycle stage transitions with defined thresholds',
      'Nightly full refresh; streaming updates for product & web',
    ],
    ai: [
      'AI enrichment: stakeholder maps, buying-committee roles',
      'Scoring: ICP fit · intent · engagement · activation · expansion · risk',
      'Account research & one-click briefs for any owner',
    ],
    outputs: [
      'Resolved account profile & stakeholder map',
      'Six live scores + risk flags',
      'Lifecycle stage & account brief on demand',
    ],
    example: {
      signal: 'Comercializadora Vela: 40 cards issued, ERP connected, spend +38%, 2 new subsidiaries.',
      reasoning: 'ICP 92 · intent 61 · activation 58 · expansion 41 · risk 12 — customer, activating, expanding.',
      action: 'Stage: Expansion-ready; graph flags limit pressure for the orchestrator.',
    },
    implementation: [
      'Warehouse (Snowflake/BigQuery-class) + identity-resolution service',
      'Six scores as versioned SQL/Python feature definitions',
      'Nightly full refresh; streaming updates for product & web',
      'Metabase for audit queries and score diagnostics',
    ],
    kpi: 'Score precision — 92% of SDR-approved accounts match ICP tier A/B.',
    kpiNote: 'Audited monthly against downstream qualification outcomes.',
  },
  orchestrator: {
    id: 'orchestrator',
    tagline: 'WHO matters · WHY now · WHAT to do · WHICH channel.',
    purpose:
      'Determine the next best growth action for every relevant account — and deliberately split the decision between deterministic guardrails and AI reasoning.',
    inputs: [
      'ICP fit & account scores from the graph',
      'Intent, engagement & product behavior',
      'CRM history & lifecycle stage',
      'Experimentation results (what actually works)',
      'Capacity: who on the team can act this week',
    ],
    deterministic: [
      'Rules: ICP tiers (LatAm mid-market 100–1,000 FTE · MX/BR/CO), lifecycle gates, region & entity routing',
      'Frequency caps: max 2 AI-originated touches / account / week',
      'Suppression lists: customers in sensitive states, legal holds, opt-outs',
      'Permissions: which actions may run autonomously vs. need review',
      'Compliance: consent, quiet hours, cross-border rules',
    ],
    ai: [
      'Account research & stakeholder identification',
      'Classification: lifecycle, risk, expansion readiness',
      'Summarization: account briefs in the owner’s context',
      'Prioritization: expected value × timing × effort',
      'Personalization: angle, tone, first line, channel mix',
      'Recommendation: the next best action, with confidence',
    ],
    outputs: ['Priority ranking', 'Next best action + message context', 'Channel & owner', 'Human escalation when gated'],
    example: {
      signal: 'Strong ICP fit, pricing visited twice, fresh funding round, no active opportunity.',
      reasoning: 'WHO tier-A account · WHY NOW intent + funding window · WHAT research → brief → personalized outreach · WHICH email + SDR task.',
      action: 'Routed for human review (first touch on tier-A) with a draft ready to approve.',
    },
    implementation: [
      'Rules layer: deterministic TypeScript/Python — caps, suppression, routing',
      'LLM API for research briefs, classification, prioritization',
      'Output: NBA record → execution queue (idempotent)',
      'Prompt + model version recorded with every decision',
    ],
    kpi: 'NBA acceptance — 78% of recommended actions approved or auto-executed.',
    kpiNote: 'Approval rate, override reasons and outcomes feed the learning loop.',
  },
  lifecycle: {
    id: 'lifecycle',
    tagline: 'Four playbooks, one engine — meet the account where it is.',
    purpose:
      'Wrap the orchestrator’s decisions in stage-specific playbooks so every action respects where the account actually is.',
    inputs: ['Lifecycle stage from the graph', 'Next best action from the orchestrator', 'Stage-specific rules & gates'],
    deterministic: ['Stage gates: no expansion motion before activation threshold', 'Owner routing per stage (SDR → CS → AE)'],
    ai: ['Stage classification confidence', 'Playbook step personalization'],
    outputs: ['Stage-scoped action sequence', 'Gating decisions (proceed / hold / escalate)'],
    example: {
      signal: 'Account classified “customer — activating” but usage of approvals flow is zero.',
      reasoning: 'Acquisition & expansion motions suppressed by stage gate.',
      action: 'Activation playbook: contextual guidance toward first policy flow.',
    },
    implementation: [
      'Playbooks stored as data — editable without deploys',
      'Stage gates evaluated in the deterministic rules layer',
      'Customer.io-class lifecycle tooling for sequences',
    ],
    kpi: 'Stage-mix health — new ARR balanced across acquire / expand.',
  },
  channels: {
    id: 'channels',
    tagline: 'The right message, on the right rail, within the rules.',
    purpose:
      'Execute actions across owned and human channels — selected by routing rules, refined by AI recommendation, bounded by frequency caps.',
    inputs: ['Action payload from the orchestrator', 'Channel rules: consent, quiet hours, caps', 'Contact preferences & engagement history'],
    deterministic: [
      'Routing table: action type → allowed channels',
      'Frequency caps & suppression enforcement at send time',
      'Localization: es-419 / pt-BR variants, per-market legal footers',
    ],
    ai: ['Channel recommendation learned from experiment results', 'Send-time optimization per contact'],
    outputs: ['Executed sends & tasks', 'Delivery, reply and conversion events back to the graph'],
    example: {
      signal: 'Finance Director, high intent, weak email open history, MX-based.',
      reasoning: 'Experiment learning: WhatsApp-first touches lift replies 2.2× for MX finance directors.',
      action: 'WhatsApp template (approved) + SDR task; paid audience suppressed by cap.',
    },
    implementation: [
      'Customer.io (email & lifecycle) · WhatsApp Business API',
      'In-product messaging via feature-flag tooling',
      'CRM tasks via HubSpot API writeback',
      'Caps + suppression enforced at send time, not design time',
    ],
    kpi: 'Reply & task-completion rate per channel, per segment.',
  },
  human: {
    id: 'human',
    tagline: 'AI drafts, humans decide — review is a feature, not a fallback.',
    purpose:
      'Route consequential actions to the right people with full context: what the AI recommends, why now, and what happens if approved. Every decision is audited.',
    inputs: ['Gated actions from the orchestrator', 'Account brief & evidence trail', 'Confidence & expected impact'],
    deterministic: [
      'Approval gates: first touch on tier-A accounts, cross-border sends, sensitive segments',
      'RBAC: only the right owner can approve',
      'Audit log: who approved, what changed, when',
    ],
    ai: ['Evidence assembly: why the model recommends this', 'Draft message with editable sections'],
    outputs: ['Approved / modified / dismissed decision', 'Assigned owner & next step', 'Feedback signal for model improvement'],
    example: {
      signal: 'Acme México — high intent + strong ICP; 3 pricing visits in 48h; +35% finance hiring; Finance Director identified.',
      reasoning: 'Confidence: high · gated because tier-A first touch.',
      action: 'SDR approves in 20s (edits the opening line) → outreach goes out, log updated.',
    },
    implementation: [
      'Approval queue: internal tool + Slack alert → deep link',
      'RBAC via SSO groups; decisions audit-logged immutably',
      'Draft attached; modifications versioned per reviewer',
    ],
    kpi: 'Time-to-decision — median 38s from alert to approve/modify.',
  },
  outcomes: {
    id: 'outcomes',
    tagline: 'Pipeline, adoption and revenue — the engine’s scoreboard.',
    purpose:
      'Every executed action is tied to its commercial outcome: pipeline created, activation achieved, adoption deepened, revenue influenced.',
    inputs: ['Executed action events', 'CRM opportunity changes', 'Product activation & adoption milestones', 'Closed-won / expansion data'],
    deterministic: [
      'Attribution model: system-touch + multi-touch, self-reported attribution captured',
      'Holdout groups guard causal claims',
      'Revenue sync from finance systems',
    ],
    outputs: ['Pipeline & revenue attribution per action class', 'Adoption & activation milestones', 'Feeds for the experimentation engine'],
    example: {
      signal: 'Intent-driven sequence on Acme México converts to discovery meeting.',
      reasoning: 'Opportunity created ($240K ARR), attributed to the sequence with a 5% audience holdout.',
      action: 'Outcome logged; the sequence pattern becomes an experiment candidate.',
    },
    implementation: [
      'Metabase + warehouse rollups (hourly attribution)',
      'HubSpot opportunity sync as commercial source of truth',
      'Holdout flags stored per action for causal reads',
    ],
    kpi: 'Revenue influenced — $12.3M ARR touched by engine actions.',
  },
  experiments: {
    id: 'experiments',
    tagline: 'Nothing is permanent — everything is a test until proven.',
    purpose:
      'Convert outcomes into knowledge. Every material change to targeting, message, channel or timing runs as a measured experiment; winners become orchestrator learnings.',
    inputs: ['Outcome feeds (pipeline, activation, expansion)', 'Experiment specs: hypothesis, audience, variants', 'Guardrail metrics'],
    deterministic: [
      'Sample-size & significance gates before ship decisions',
      'Holdouts & exposure caps per account',
      'Guardrail alerts (unsubscribe, complaint, churn risk)',
    ],
    ai: ['Variant generation for messages & nudges', 'Segment discovery: where does this learning apply?'],
    outputs: ['Statistical result per experiment', 'Learning registry entry', 'Orchestrator weight/config update'],
    example: {
      signal: 'WhatsApp-first vs email-first for finance-director first touch (n=420).',
      reasoning: 'Reply 24.6% vs 11.2%, p<0.01 — no guardrail regressions.',
      action: 'Learning shipped to the orchestrator: WhatsApp-first for this segment.',
    },
    implementation: [
      'Holdout split at assignment time (deterministic hash)',
      'Scheduled readouts with significance gates — no peeking',
      'Learning registry → versioned orchestrator config change',
    ],
    kpi: 'Shipped learnings per quarter — 31, averaging +18% conversion lift.',
  },
  governance: {
    id: 'governance',
    tagline: 'The foundation under every layer — non-negotiable.',
    purpose:
      'Make the engine safe to run in a regulated fintech: who can do what, what was done, what data may be used, and what always requires a human.',
    inputs: ['Every layer above — governance is cross-cutting', 'Security & compliance policy (ISO 27001, PCI DSS 4.0)', 'Regional privacy law (LFPDPPP MX, LGPD BR, CO regime)'],
    deterministic: [
      'RBAC — scoped roles for growth, sales, CS, RevOps',
      'Audit logs — every AI action, decision and edit is recorded',
      'Consent & PII protection — hashed at ingest, purpose-limited use',
      'Approval gates — tier-A, cross-border and sensitive sends need humans',
      'Frequency caps & suppression lists enforced at execution',
      'Model monitoring — drift, bias and acceptance-rate tracking',
    ],
    outputs: ['Policy decisions on every action (allow / gate / block)', 'Immutable audit trail', 'Quarterly compliance reporting'],
    example: {
      signal: 'Orchestrator proposes a 3rd touch in one week to a tier-A account.',
      reasoning: 'Frequency cap (2/week) would be exceeded.',
      action: 'Send blocked at the channel layer; logged; action deferred to next week.',
    },
    implementation: [
      'RBAC via SSO groups (Okta-class) mapped to action classes',
      'Append-only audit store — every AI decision and edit',
      'Consent + suppression lists as the single source of truth',
      'Model monitoring: drift, acceptance rate, block rate',
    ],
    kpi: 'Zero compliance incidents; 100% of gated actions audited.',
  },
};
