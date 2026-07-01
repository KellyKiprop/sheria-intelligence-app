const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface StatsResponse {
  total_documents: number;
  total_chunks: number;
  total_embeddings: number;
  domains: Record<string, number>;
  total_queries: number;
}

export interface DomainCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ConversationTurn {
  query: string;
  response: string;
}

export interface QueryRequest {
  query: string;
  user_tier: 'public' | 'professional';
  conversation_history?: ConversationTurn[];
}

export interface Citation {
  title: string;
  domain: string;
  source_url: string | null;
  similarity: number;
}

export interface QueryResponse {
  query: string;
  response: string;
  citations: Citation[];
  domain: string | null;
  chunks_retrieved: number;
  retries: number;
  response_time_ms: number;
  user_tier: 'public' | 'professional';
  follow_up_questions: string[];
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
  domains: () => apiFetch<{ domains: DomainCard[] }>('/domains'),
  query: (body: QueryRequest): Promise<QueryResponse> =>
    apiFetch<QueryResponse>('/query', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
