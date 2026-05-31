const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface StatsResponse {
  acts_indexed: number;
  legal_provisions: number;
  funds_flagged_kes_billions: number;
}

export interface DomainCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface QueryRequest {
  query: string;
  user_tier: 'public' | 'professional';
}

export interface Source {
  act_name: string;
  domain: string;
  similarity_score: number;
  provision: string;
}

export interface QueryResponse {
  domain_detected: string;
  chunks_retrieved: number;
  response: {
    direct_answer: string;
    legal_basis: string;
    analysis: string;
    practical_implications: string;
    limitations: string;
  };
  sources: Source[];
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  health: () => apiFetch<{ status: string }>('/health'),
  stats: () => apiFetch<StatsResponse>('/stats'),
  domains: () => apiFetch<DomainCard[]>('/domains'),
  query: (body: QueryRequest) =>
    apiFetch<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
