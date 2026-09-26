import type { Channel } from '../types';

export const CHANNELS: Channel[] = [
  { id: 'email', label: 'Email', note: 'Sequences, one-to-one, digests', stage: 'mvp' },
  { id: 'whatsapp', label: 'WhatsApp', note: 'Preferred first-touch in MX/BR for directors', stage: 'mvp' },
  { id: 'in-product', label: 'In-product', note: 'Guided flows, contextual nudges', stage: 'mvp' },
  { id: 'crm-tasks', label: 'CRM tasks', note: 'SDR/AE follow-ups with full context', stage: 'mvp' },
  { id: 'sales-alert', label: 'Sales alert', note: 'Real-time intent pushes to owners', stage: 'scale' },
  { id: 'cs-alert', label: 'CS alert', note: 'Risk & expansion flags to CS', stage: 'scale' },
  { id: 'paid', label: 'Paid ads', note: 'Matched audiences from ICP segments', stage: 'scale' },
  { id: 'human-outreach', label: 'Human', note: 'Calls, meetings, exec touch', stage: 'mvp' },
];

export const CHANNEL_MAP: Record<string, Channel> = Object.fromEntries(CHANNELS.map((c) => [c.id, c]));
