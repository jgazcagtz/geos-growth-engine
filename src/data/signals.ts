import type { SignalGroup } from '../types';

/**
 * status 'connected' = plausibly available today · 'potential' = connect over
 * time. Deliberately conservative — the demo does not imply access to
 * proprietary company data beyond public product surfaces.
 */
export const SIGNAL_GROUPS: SignalGroup[] = [
  {
    id: 'signals-1p',
    title: 'First-party signals',
    subtitle: 'The company’s own product & systems',
    cadence: 'streaming · 60s',
    items: [
      { id: 'web', label: 'Website', note: 'Visits, pricing intent, content topics', status: 'connected', stage: 'mvp' },
      { id: 'product', label: 'Product usage', note: 'Cards issued, approvals, ERP sync, TravelPay', status: 'connected', stage: 'mvp' },
      { id: 'crm', label: 'CRM', note: 'Accounts, contacts, opportunities, stages', status: 'connected', stage: 'mvp' },
      { id: 'marketing', label: 'Marketing', note: 'Campaigns, webinars, content downloads', status: 'connected', stage: 'scale' },
      { id: 'email', label: 'Email engagement', note: 'Opens, replies, sequence position', status: 'connected', stage: 'mvp' },
      { id: 'activity', label: 'Customer activity', note: 'Logins, admin actions, feature discovery', status: 'potential', stage: 'scale' },
      { id: 'sales', label: 'Sales conversations', note: 'Call intelligence — topic & sentiment', status: 'potential', stage: 'scale' },
      { id: 'support', label: 'Support', note: 'Tickets, sentiment, resolution time', status: 'potential', stage: 'scale' },
      { id: 'spend', label: 'Corporate spend', note: 'Volume, velocity, limits, policy events', status: 'potential', stage: 'vision' },
    ],
  },
  {
    id: 'signals-ext',
    title: 'External signals',
    subtitle: 'Market & company intelligence',
    cadence: 'batch · 24h',
    items: [
      { id: 'company', label: 'Company data', note: 'Registry, size, industry, subsidiaries', status: 'connected', stage: 'scale' },
      { id: 'firmo', label: 'Firmographics', note: 'Headcount, revenue band, geography', status: 'connected', stage: 'scale' },
      { id: 'funding', label: 'Funding', note: 'Rounds — strongest expansion trigger', status: 'potential', stage: 'scale' },
      { id: 'hiring', label: 'Hiring', note: 'Finance & ops roles opening', status: 'potential', stage: 'scale' },
      { id: 'techno', label: 'Technographics', note: 'ERP, payroll, travel stack detected', status: 'potential', stage: 'vision' },
      { id: 'intent', label: 'Intent', note: 'Third-party research surge topics', status: 'potential', stage: 'vision' },
      { id: 'market', label: 'Market signals', note: 'Regulation, FX, expansion corridors', status: 'potential', stage: 'vision' },
    ],
  },
];
