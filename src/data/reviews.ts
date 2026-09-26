import type { ReviewItem, ReviewStatus } from '../types';

export const REVIEWS: ReviewItem[] = [
  {
    id: 'acme',
    account: 'Acme México',
    signal: 'High intent + strong ICP',
    whyNow: ['3 pricing visits in 48h', '+35% finance headcount YoY', 'Finance Director identified — Mariana Ruiz'],
    recommended: 'Personalized outreach: researched brief + first-touch email + SDR task',
    channel: 'Email · SDR task',
    confidence: 'High',
    impact: '$240K ARR potential',
  },
  {
    id: 'andina',
    account: 'Logística Andina',
    signal: 'Expansion signal — spend +41% QoQ',
    whyNow: ['Card limits hit on 2 entities', 'New subsidiary hiring 12 roles', 'No expansion opportunity open'],
    recommended: 'Expansion review: account brief + limit proposal for AE',
    channel: 'AE brief · CS alert',
    confidence: 'High',
    impact: '$180K expansion',
  },
  {
    id: 'nova',
    account: 'Nova Retail',
    signal: 'Activation risk — day 6, no cards issued',
    whyNow: ['Onboarding stalled at step 2/4', 'Admin login inactive 72h', 'Docs uploaded but never approved'],
    recommended: 'Contextual nudge: in-product guide + admin email with 1-click approval',
    channel: 'In-product · Email',
    confidence: 'Medium',
    impact: 'Protects $96K ARR',
  },
];

export interface ReviewWithSla {
  id: string;
  sla: string;
}

/** Time-to-decision SLA context shown in the operations board (simulated). */
export const REVIEW_SLA: Record<string, string> = {
  acme: 'waiting 6m · SLA 2h',
  andina: 'waiting 22m · SLA 4h',
  nova: 'waiting 1h 4m · SLA same-day',
};

export const INITIAL_REVIEW_STATUS: Record<string, ReviewStatus> = Object.fromEntries(
  REVIEWS.map((r) => [r.id, 'pending' as ReviewStatus]),
);
