import type { NodeId } from '../types';

/**
 * Executive-mode briefs: what we built, why, what it automates, who it helps,
 * what we measure. Readable by a non-technical executive in ~60 seconds.
 */
export interface ExecBrief {
  built: string;
  why: string;
  automates: string;
  helps: string;
  measures: string;
  result: string;
}

export const EXEC_BRIEFS: Record<NodeId, ExecBrief> = {
  'signals-1p': {
    built: 'One pipe for every signal the company already generates — web, product, CRM, conversations, spend.',
    why: 'Decisions made on stale or partial data waste the team’s time and miss buying windows.',
    automates: 'Capture, cleaning and company-matching of thousands of daily events.',
    helps: 'Everyone: sales, CS and leadership all read the same account truth.',
    measures: 'Signal freshness (92% of decisions read data < 5 minutes old).',
    result: 'No more “I didn’t know they were looking at pricing.”',
  },
  'signals-ext': {
    built: 'Daily enrichment: funding, hiring, firmographics and market changes for every target account in MX, BR and CO.',
    why: 'Timing is the biggest lever in B2B — a funding round or finance hire changes everything.',
    automates: 'Company research that used to take an SDR 20–30 minutes per account.',
    helps: 'SDRs call the right companies at the right moment.',
    measures: 'Match rate (96%) and how often external events drive outreach.',
    result: 'Timing triggers feed the “why now” on every pitch.',
  },
  'account-graph': {
    built: 'One living memory per company: people, product usage, spend, engagement and scores in a single place.',
    why: 'Fragmented data means fragmented customer experience and duplicate work.',
    automates: 'Identity resolution, enrichment, scoring (ICP, intent, engagement, activation, expansion, risk).',
    helps: 'Any owner can open an account and know exactly where it stands.',
    measures: 'Score precision — 92% of SDR-approved accounts match ICP tier A/B.',
    result: 'Scores you can act on, with the evidence attached.',
  },
  orchestrator: {
    built: 'The decision core: for every account, WHO to act on, WHY now, WHAT to do and WHICH channel.',
    why: 'A growth team of 10 cannot personally watch 40,000 accounts. Rules and AI triage so humans spend time where judgment pays.',
    automates: 'Prioritization, research summaries, message angles, channel choice.',
    helps: 'SDRs get researched next steps; leadership gets a ranked pipeline of opportunities.',
    measures: '78% of recommended actions get approved or run automatically.',
    result: 'The team works the top of the list, not the loudest thing.',
  },
  lifecycle: {
    built: 'Four stage playbooks — acquire, activate, retain, expand — that keep motions consistent and in-stage.',
    why: 'Out-of-stage motions annoy customers and waste pipeline (selling expansion to an unactivated account).',
    automates: 'Stage gates, owner routing and playbook sequencing.',
    helps: 'Lifecycle managers keep quality high without manual policing.',
    measures: 'Stage-mix health and conversion between stages.',
    result: 'Every account gets the motion that matches its stage.',
  },
  channels: {
    built: 'One execution layer for email, WhatsApp, in-product, tasks and alerts — under frequency caps.',
    why: 'Channels chosen by opinion perform worse than channels chosen by evidence.',
    automates: 'Send-time, localization (es-419 / pt-BR), caps and suppression.',
    helps: 'Marketing and sales share one coordinated calendar per account.',
    measures: 'Reply and task-completion rates per channel and segment.',
    result: 'WhatsApp-first for MX finance directors — because a test said so.',
  },
  human: {
    built: 'Approval gates: consequential actions reach a human with full context and a one-click decision.',
    why: 'AI drafts; humans decide. Trust with customers (and legal) is earned by keeping people in the loop.',
    automates: 'The research and drafting — not the judgment.',
    helps: 'SDRs decide in ~38 seconds with everything on one screen.',
    measures: 'Time-to-decision, acceptance rate, override reasons.',
    result: 'Faster outreach without losing control of the brand.',
  },
  outcomes: {
    built: 'Every action tied to its commercial outcome: pipeline, activation, adoption, revenue.',
    why: 'Without outcome wiring, growth work is a belief system, not a system.',
    automates: 'Attribution rollups with holdout protection.',
    helps: 'Leadership sees what the engine actually produced.',
    measures: '$1.84M QTD pipeline attributed; $12.3M ARR influenced.',
    result: 'The scoreboard is real, not vibes.',
  },
  experiments: {
    built: 'A discipline: every material change is a measured experiment with a hypothesis, guardrails and a decision.',
    why: 'Growth engineering is how you find out what works — including that some things don’t.',
    automates: 'Readouts, significance gates and guardrail alerts.',
    helps: 'The team scales proven wins and kills dead ideas fast.',
    measures: '31 shipped learnings/quarter; losers killed with written reasons (EXP-017).',
    result: 'The engine gets measurably better every quarter.',
  },
  governance: {
    built: 'RBAC, audit logs, consent, PII protection, approval gates, caps, suppression and model monitoring under every layer.',
    why: 'This is a regulated fintech (ISO 27001, PCI DSS 4.0, LFPDPPP/LGPD). Trust is the product.',
    automates: 'Policy enforcement at execution time — not in a handbook.',
    helps: 'Legal, security and compliance sleep at night.',
    measures: 'Zero compliance incidents; 100% of gated actions audited.',
    result: 'Growth velocity with bank-grade controls.',
  },
};
