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

function parseResponse(raw: string): QueryResponse['response'] {
  const extract = (label: string, nextLabel?: string): string => {
    const start = raw.indexOf(label);
    if (start === -1) return '';
    const contentStart = start + label.length;
    const end = nextLabel ? raw.indexOf(nextLabel, contentStart) : raw.length;
    return raw.slice(contentStart, end === -1 ? raw.length : end).trim();
  };

  // Try to parse structured sections from the response string
  const hasStructure = raw.includes('DIRECT ANSWER') || raw.includes('1.');

  if (hasStructure) {
    return {
      direct_answer: extract('DIRECT ANSWER', 'LEGAL BASIS') ||
                     extract('1. DIRECT ANSWER', '2.') ||
                     extract('**1.', '**2.'),
      legal_basis: extract('LEGAL BASIS', 'DETAILED ANALYSIS') ||
                   extract('2. LEGAL BASIS', '3.') ||
                   extract('**2.', '**3.'),
      analysis: extract('DETAILED ANALYSIS', 'PRACTICAL IMPLICATIONS') ||
                extract('3. DETAILED ANALYSIS', '4.') ||
                extract('**3.', '**4.'),
      practical_implications: extract('PRACTICAL IMPLICATIONS', 'LIMITATIONS') ||
                              extract('4. PRACTICAL IMPLICATIONS', '5.') ||
                              extract('**4.', '**5.'),
      limitations: extract('LIMITATIONS', '') ||
                   extract('5. LIMITATIONS', '') ||
                   extract('**5.', ''),
    };
  }

  // Fallback — put everything in direct_answer
  return {
    direct_answer: raw,
    legal_basis: '',
    analysis: '',
    practical_implications: '',
    limitations: '',
  };
}

export const api = {
  health: () => apiFetch<{ status: string }>('/health'),
  stats: () => apiFetch<StatsResponse>('/stats'),
  domains: () => apiFetch<DomainCard[]>('/domains'),
  query: async (body: QueryRequest): Promise<QueryResponse> => {
    const raw = await apiFetch<any>('/query', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      domain_detected: raw.domain ?? 'unknown',
      chunks_retrieved: raw.chunks_retrieved ?? 0,
      response: parseResponse(raw.response ?? ''),
      sources: (raw.citations ?? []).map((c: any) => ({
        act_name: c.title ?? 'Unknown',
        domain: c.domain ?? 'unknown',
        similarity_score: c.similarity ?? 0,
        provision: c.source_url ?? '',
      })),
    };
  },
};
