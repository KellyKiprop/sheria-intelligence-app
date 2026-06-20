import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Search, Briefcase, MapPin, Building2, Shield, Gavel,
  ChevronDown, Copy, RotateCcw, AlertCircle
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api, QueryResponse } from '../lib/api';
import ReactMarkdown from 'react-markdown';

const DOMAINS = [
  { id: 'employment', label: 'Employment', icon: Briefcase, color: '#22C55E' },
  { id: 'land', label: 'Land', icon: MapPin, color: '#D4A017' },
  { id: 'business', label: 'Business', icon: Building2, color: '#3B82F6' },
  { id: 'cybercrime', label: 'Cybercrime', icon: Shield, color: '#EF4444' },
  { id: 'criminal', label: 'Criminal', icon: Gavel, color: '#8B5CF6' },
];

function DomainBadge({ domain }: { domain: string }) {
  const d = DOMAINS.find((x) => x.id === domain.toLowerCase()) || DOMAINS[0];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${d.color}20`, color: d.color, border: `1px solid ${d.color}40` }}
    >
      <d.icon size={11} />
      {d.label} Law
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-[#1B4332]/10 border border-[#2D6A4F]/20 flex items-center justify-center mb-6">
        <Scale size={40} className="text-[#2D6A4F]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
        Ask your first legal question
      </h3>
      <p className="text-[#6B7280] text-sm max-w-sm leading-relaxed">
        Describe your legal situation or question in plain language. Sheria will retrieve and analyze relevant Kenyan law.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-2 w-full max-w-sm">
        {[
          'What are my rights if I am unfairly dismissed?',
          'How do I register a company in Kenya?',
          'What is adverse possession under Kenyan land law?',
        ].map((q) => (
          <div key={q} className="text-left px-3 py-2 rounded-lg bg-[#F0EDE8] text-[#6B7280] text-xs hover:bg-[#E8E4DE] transition-colors cursor-default">
            "{q}"
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#1B4332]/20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Scale size={24} className="text-[#1B4332]" />
        </div>
        <div className="absolute -inset-2 rounded-full border border-[#22C55E]/30 animate-ping" />
      </div>
      <p className="font-display text-lg text-[#1B4332]">Sheria is thinking...</p>
      <p className="text-[#6B7280] text-sm mt-1">Retrieving and analysing relevant provisions</p>
      <div className="mt-6 space-y-3 w-full max-w-md">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-light h-4 rounded-full" style={{ width: `${90 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

function SourceItem({ source }: { source: { act_name: string; domain: string; similarity_score: number; provision: string } }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#E8E4DE] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A1A] truncate">{source.act_name}</p>
        <p className="text-xs text-[#6B7280] truncate mt-0.5">{source.provision}</p>
      </div>
      <DomainBadge domain={source.domain} />
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs font-code text-[#6B7280]">
          {(source.similarity_score * 100).toFixed(0)}%
        </span>
        <div className="w-16 h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B4332] rounded-full"
            style={{ width: `${source.similarity_score * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result, onRetry }: { result: QueryResponse; onRetry: () => void }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const sections = [
    { key: 'direct_answer', label: 'Direct Answer', value: result.response.direct_answer },
    { key: 'legal_basis', label: 'Legal Basis', value: result.response.legal_basis },
    { key: 'analysis', label: 'Analysis', value: result.response.analysis },
    { key: 'practical_implications', label: 'Practical Implications', value: result.response.practical_implications },
    { key: 'limitations', label: 'Limitations & Caveats', value: result.response.limitations },
  ].filter((s) => s.value);

  const handleCopy = async () => {
    const text = sections.map((s) => `${s.label}\n${s.value}`).join('\n\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <DomainBadge domain={result.domain_detected} />
        <span className="text-xs text-[#6B7280] font-code">
          {result.chunks_retrieved} provisions retrieved
        </span>
      </div>

      {/* Sections */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {sections.map((section) => (
          <div key={section.key}>
            <h4 className="font-display text-[#1B4332] font-semibold text-base mb-1.5">{section.label}</h4>
            <div className="gold-divider mb-2" />
            <div className="text-[#1A1A1A] leading-relaxed text-sm prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-[#1B4332] prose-strong:font-semibold">
              <ReactMarkdown>{section.value}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Sources accordion */}
      {result.sources && result.sources.length > 0 && (
        <div className="mt-4 border border-[#E8E4DE] rounded-xl overflow-hidden">
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#F5F2EE] hover:bg-[#EEE9E3] transition-colors text-sm font-medium text-[#1A1A1A]"
          >
            <span>Sources ({result.sources.length})</span>
            <ChevronDown
              size={16}
              className={`transition-transform text-[#6B7280] ${sourcesOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {sourcesOpen && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 bg-white">
                  {result.sources.map((s, i) => (
                    <SourceItem key={i} source={s} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#1B4332] border border-[#E8E4DE] hover:border-[#1B4332] rounded-lg transition-all"
        >
          <RotateCcw size={14} /> Retry
        </button>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#1B4332] border border-[#1B4332] hover:bg-[#1B4332] hover:text-white rounded-lg transition-all"
        >
          <Copy size={14} /> {copied ? 'Copied!' : 'Copy Response'}
        </button>
      </div>
    </div>
  );
}

interface LegalResearchProps {
  tier: 'public' | 'professional';
  onTierChange: (tier: 'public' | 'professional') => void;
}

export default function LegalResearch({ tier, onTierChange }: LegalResearchProps) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const mutation = useMutation({
    mutationFn: api.query,
  });

  const handleSubmit = () => {
    if (!query.trim()) return;
    setSubmittedQuery(query);
    mutation.mutate({ query, user_tier: tier });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="gold-divider max-w-xs mb-4" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1B4332] mb-2">
            Legal Research
          </h1>
          <p className="text-[#6B7280]">
            Ask questions about Kenyan law. Powered by AI retrieval across indexed legislation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-16rem)]">
          {/* Left panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E4DE] p-6 flex flex-col shadow-sm">
            {/* Tier toggle */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-widest text-[#6B7280] mb-2 font-medium">
                Query Mode
              </label>
              <div className="flex bg-[#F5F2EE] rounded-xl p-1">
                {(['public', 'professional'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => onTierChange(t)}
                    className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                      tier === t
                        ? 'bg-[#1B4332] text-[#D4A017] shadow-sm'
                        : 'text-[#6B7280] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {t === 'public' ? 'Public Citizen' : 'Legal Professional'}
                  </button>
                ))}
              </div>
              {tier === 'professional' && (
                <p className="text-xs text-[#2D6A4F] mt-2 flex items-center gap-1">
                  <AlertCircle size={11} />
                  Professional mode returns detailed statutory references
                </p>
              )}
            </div>

            {/* Query textarea */}
            <div className="flex-1 mb-4">
              <label className="block text-xs uppercase tracking-widest text-[#6B7280] mb-2 font-medium">
                Your Legal Question
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your legal situation or question in plain language..."
                className="w-full h-48 lg:h-64 p-4 bg-[#F9F7F4] border border-[#E8E4DE] rounded-xl text-[#1A1A1A] placeholder-[#A8B4AA] resize-none focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-all text-sm leading-relaxed"
              />
              <p className="text-xs text-[#A8B4AA] mt-1 text-right">
                ⌘ + Enter to submit
              </p>
            </div>

            {/* Domain badges */}
            <div className="mb-4">
              <label className="block text-xs uppercase tracking-widest text-[#6B7280] mb-2 font-medium">
                Detected Domain
              </label>
              <div className="flex gap-2 flex-wrap">
                {DOMAINS.map((d) => {
                  const detected =
                    mutation.data?.domain_detected?.toLowerCase() === d.id;
                  return (
                    <span
                      key={d.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: detected ? `${d.color}20` : '#F5F2EE',
                        color: detected ? d.color : '#A8B4AA',
                        border: `1px solid ${detected ? d.color + '40' : 'transparent'}`,
                      }}
                    >
                      <d.icon size={11} />
                      {d.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!query.trim() || mutation.isPending}
              className="w-full py-3.5 bg-[#1B4332] text-[#D4A017] font-semibold rounded-xl hover:bg-[#2D6A4F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <Search size={16} />
              {mutation.isPending ? 'Analysing...' : 'Analyse Question'}
            </button>

            {/* Disclaimer */}
            <p className="mt-3 text-xs text-[#A8B4AA] leading-relaxed text-center">
              This is legal information, not legal advice. Consult a qualified advocate for your specific situation.
            </p>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E8E4DE] p-6 shadow-sm flex flex-col">
            {mutation.isPending ? (
              <LoadingState />
            ) : mutation.error ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center mb-4">
                  <AlertCircle className="text-[#EF4444]" size={28} />
                </div>
                <h3 className="font-display text-lg text-[#1A1A1A] font-semibold mb-2">
                  Unable to retrieve results
                </h3>
                <p className="text-[#6B7280] text-sm mb-4">
                  The Sheria API could not be reached. Please try again.
                </p>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white text-sm rounded-lg hover:bg-[#2D6A4F] transition-colors"
                >
                  <RotateCcw size={14} /> Try again
                </button>
              </div>
            ) : mutation.data ? (
              <ResultCard result={mutation.data} onRetry={() => {
                setQuery(submittedQuery);
                mutation.reset();
              }} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
