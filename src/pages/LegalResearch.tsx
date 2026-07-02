import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Search, Briefcase, MapPin, Building2, Shield, Gavel,
  ChevronDown, Copy, AlertCircle, Mic, MicOff, Plus, Sparkles,
  CheckCircle2, Circle, Loader2, Trash2, PanelLeftClose, PanelLeft, MessageSquare
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { api, QueryResponse } from '../lib/api';
import { useConversation, Message, Session } from '../lib/useConversation';
import ReactMarkdown from 'react-markdown';

const DOMAINS = [
  { id: 'employment', label: 'Employment', icon: Briefcase, color: '#22C55E' },
  { id: 'land', label: 'Land', icon: MapPin, color: '#D4A017' },
  { id: 'business', label: 'Business', icon: Building2, color: '#3B82F6' },
  { id: 'cybercrime', label: 'Cybercrime', icon: Shield, color: '#EF4444' },
  { id: 'criminal', label: 'Criminal', icon: Gavel, color: '#8B5CF6' },
];

const PIPELINE_STAGES = [
  { key: 'research', label: 'Research', description: 'Retrieving relevant provisions' },
  { key: 'analysis', label: 'Analysis', description: 'Reasoning through the law' },
  { key: 'citation', label: 'Citation', description: 'Verifying claims against sources' },
  { key: 'drafting', label: 'Drafting', description: 'Composing your answer' },
];

function DomainBadge({ domain }: { domain: string | null }) {
  if (!domain) return null;
  const d = DOMAINS.find((x) => x.id === domain.toLowerCase());
  if (!d) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: d.color + '20', color: d.color, border: '1px solid ' + d.color + '40' }}
    >
      <d.icon size={11} />
      {d.label} Law
    </span>
  );
}

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (q: string) => void }) {
  const suggestions = [
    'What are my rights if I am unfairly dismissed?',
    'How do I register a company in Kenya?',
    'What is the penalty for theft in Kenya?',
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-[#1B4332]/10 border border-[#2D6A4F]/20 flex items-center justify-center mb-5">
        <Scale size={36} className="text-[#2D6A4F]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-[#1B4332] mb-2">
        Ask your first legal question
      </h3>
      <p className="text-[#6B7280] text-sm max-w-sm leading-relaxed mb-6">
        Describe your legal situation in plain language. Sheria retrieves and
        analyses relevant Kenyan law, and remembers your conversation as you go.
      </p>
      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {suggestions.map((q) => (
          <button
            key={q}
            onClick={() => onSuggestionClick(q)}
            className="text-left px-3.5 py-2.5 rounded-lg bg-[#F0EDE8] text-[#4A4A4A] text-xs hover:bg-[#E8E4DE] hover:text-[#1B4332] transition-colors"
          >
            "{q}"
          </button>
        ))}
      </div>
    </div>
  );
}

function PipelineStepper() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    const timings = [600, 3500, 2000, 2000];
    const timers: ReturnType<typeof setTimeout>[] = [];
    let elapsed = 0;
    timings.forEach((delay, i) => {
      elapsed += delay;
      if (i < timings.length - 1) {
        timers.push(setTimeout(() => setActiveIndex(i + 1), elapsed));
      }
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-full border-2 border-[#1B4332]/20 flex items-center justify-center">
          <Scale size={22} className="text-[#1B4332]" />
        </div>
        <div className="absolute -inset-2 rounded-full border border-[#22C55E]/30 animate-ping" />
      </div>
      <div className="w-full max-w-xs space-y-2.5">
        {PIPELINE_STAGES.map((stage, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 size={16} className="text-[#22C55E] flex-shrink-0" />
              ) : isActive ? (
                <Loader2 size={16} className="text-[#D4A017] flex-shrink-0 animate-spin" />
              ) : (
                <Circle size={16} className="text-[#E8E4DE] flex-shrink-0" />
              )}
              <div className="flex-1 text-left">
                <p
                  className={
                    'text-sm font-medium transition-colors ' +
                    (isDone ? 'text-[#1B4332]' : isActive ? 'text-[#1A1A1A]' : 'text-[#A8B4AA]')
                  }
                >
                  {stage.label}
                </p>
                {isActive && (
                  <p className="text-xs text-[#6B7280]">{stage.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SourceItem({ citation }: { citation: QueryResponse['citations'][number] }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#E8E4DE] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A1A] truncate">{citation.title}</p>
        {citation.source_url && (
          <a
            href={citation.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2D6A4F] hover:underline truncate block mt-0.5"
          >
            {citation.source_url}
          </a>
        )}
      </div>
      <DomainBadge domain={citation.domain} />
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className="text-xs font-code text-[#6B7280]">
          {(citation.similarity * 100).toFixed(0)}%
        </span>
        <div className="w-16 h-1.5 bg-[#E8E4DE] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B4332] rounded-full"
            style={{ width: (citation.similarity * 100) + '%' }}
          />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onFollowUpClick,
}: {
  message: Message;
  onFollowUpClick: (q: string) => void;
}) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.result) return;
    await navigator.clipboard.writeText(message.result.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#1B4332] text-white rounded-2xl rounded-tr-md px-4 py-2.5 text-sm">
          {message.query}
        </div>
      </div>

      <div className="flex justify-start">
        <div className="max-w-[92%] w-full bg-[#F5F2EE] rounded-2xl rounded-tl-md px-5 py-4">
          {message.status === 'pending' && <PipelineStepper />}

          {message.status === 'error' && (
            <div className="flex items-center gap-2 text-[#EF4444] text-sm py-2">
              <AlertCircle size={16} />
              Something went wrong retrieving this answer. Please try again.
            </div>
          )}

          {message.status === 'done' && message.result && (
            <>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <DomainBadge domain={message.result.domain} />
                <span className="text-xs text-[#6B7280] font-code">
                  {message.result.chunks_retrieved} provisions retrieved
                </span>
              </div>

              <div className="text-[#1A1A1A] leading-relaxed text-sm prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-[#1B4332] prose-strong:font-semibold">
                <ReactMarkdown>
                  {message.result.response
                    .replace(/\*\*Legal Sources Referenced:\*\*/g, '')
                    .replace(/^- .+\|.+$/gm, '')
                    .replace(/
{3,}/g, '

')
                    .trim()}
                </ReactMarkdown>
              </div>

              {message.result.follow_up_questions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E8E4DE]">
                  <p className="text-xs uppercase tracking-widest text-[#A8B4AA] font-medium mb-2 flex items-center gap-1.5">
                    <Sparkles size={11} /> Continue researching
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {message.result.follow_up_questions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => onFollowUpClick(q)}
                        className="text-left text-sm text-[#2D6A4F] hover:text-[#1B4332] hover:underline transition-colors"
                      >
                        {'\u2192'} {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {message.result.citations.length > 0 && (
                <div className="mt-4 border border-[#E8E4DE] rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setSourcesOpen(!sourcesOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F9F7F4] transition-colors text-sm font-medium text-[#1A1A1A]"
                  >
                    <span>Sources ({message.result.citations.length})</span>
                    <ChevronDown
                      size={16}
                      className={'transition-transform text-[#6B7280] ' + (sourcesOpen ? 'rotate-180' : '')}
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
                        <div className="px-4">
                          {message.result.citations.map((c, i) => (
                            <SourceItem key={i} citation={c} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1B4332] transition-colors"
                >
                  <Copy size={12} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function useVoiceInput(onResult: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-KE';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, [onResult]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return { isListening, isSupported, toggleListening };
}

function SessionSidebar({
  sessions,
  activeSessionId,
  onSwitch,
  onNew,
  onDelete,
  collapsed,
  onToggleCollapse,
}: {
  sessions: Session[];
  activeSessionId: string | null;
  onSwitch: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  tier: 'public' | 'professional';
  onTierChange: (tier: 'public' | 'professional') => void;
}) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    if (pendingDeleteId === id) {
      onDelete(id);
      setPendingDeleteId(null);
    } else {
      setPendingDeleteId(id);
      setTimeout(() => setPendingDeleteId((current) => (current === id ? null : current)), 3000);
    }
  };

  if (collapsed) {
    return (
      <div className="w-12 flex-shrink-0 flex flex-col items-center py-4 border-r border-[#E8E4DE] bg-white">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-[#6B7280] hover:text-[#1B4332] transition-colors"
          title="Show conversation history"
        >
          <PanelLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 flex-shrink-0 flex flex-col border-r border-[#E8E4DE] bg-white">
      <div className="flex items-center justify-between p-3 border-b border-[#E8E4DE]">
        <div className="min-w-0">
          <p className="font-display font-bold text-[#1B4332] text-base leading-tight">Sheria</p>
          <p className="text-xs text-[#6B7280]">Legal Research</p>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-[#6B7280] hover:text-[#1B4332] transition-colors flex-shrink-0"
          title="Hide sidebar"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      <div className="p-2 space-y-2">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-[#D4A017] bg-[#1B4332] hover:bg-[#2D6A4F] rounded-lg transition-colors"
        >
          <Plus size={15} /> New Chat
        </button>
        <div className="flex bg-[#F5F2EE] rounded-lg p-0.5">
          {(['public', 'professional'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onTierChange(t)}
              className={
                'flex-1 py-1.5 text-xs rounded-md font-medium transition-all duration-200 ' +
                (tier === t ? 'bg-white text-[#1B4332] shadow-sm' : 'text-[#6B7280] hover:text-[#1A1A1A]')
              }
            >
              {t === 'public' ? 'Public' : 'Professional'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {sessions.length === 0 ? (
          <p className="text-xs text-[#A8B4AA] text-center py-6 px-2">
            Your research sessions will appear here.
          </p>
        ) : (
          sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isPendingDelete = pendingDeleteId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onSwitch(s.id)}
                className={
                  'group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ' +
                  (isActive ? 'bg-[#1B4332]/10 text-[#1B4332]' : 'text-[#4A4A4A] hover:bg-[#F5F2EE]')
                }
              >
                <MessageSquare size={14} className="flex-shrink-0 opacity-60" />
                <span className="flex-1 min-w-0 text-sm truncate">{s.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(s.id);
                  }}
                  className={
                    'flex-shrink-0 p-1 rounded transition-all ' +
                    (isPendingDelete
                      ? 'text-[#EF4444] bg-[#EF4444]/10 opacity-100'
                      : 'text-[#A8B4AA] hover:text-[#EF4444] opacity-0 group-hover:opacity-100')
                  }
                  title={isPendingDelete ? 'Click again to confirm delete' : 'Delete session'}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })
        )}
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    activeSessionId,
    messages,
    newSession,
    switchSession,
    deleteSession,
    startTurn,
    completeTurn,
    failTurn,
    removeTurn,
    getHistoryForApi,
    hasMessages,
  } = useConversation();

  const mutation = useMutation({ mutationFn: api.query });

  const { isListening, isSupported, toggleListening } = useVoiceInput((transcript) => {
    setQuery((prev) => (prev ? prev + ' ' + transcript : transcript));
  });

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitQuery = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;

    const history = getHistoryForApi();
    const { sessionId, turnId } = startTurn(trimmed);
    setQuery('');

    mutation.mutate(
      { query: trimmed, user_tier: tier, conversation_history: history },
      {
        onSuccess: (result) => completeTurn(sessionId, turnId, result),
        onError: () => {
          failTurn(sessionId, turnId);
          setTimeout(() => removeTurn(sessionId, turnId), 4000);
        },
      }
    );
  };

  const handleSubmit = () => submitQuery(query);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] pt-16">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div
          className="bg-white rounded-2xl border border-[#E8E4DE] shadow-sm flex overflow-hidden"
          style={{ height: 'calc(100vh - 11rem)' }}
        >
          <SessionSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSwitch={switchSession}
            onNew={newSession}
            onDelete={deleteSession}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            tier={tier}
            onTierChange={onTierChange}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {!hasMessages ? (
                <EmptyState onSuggestionClick={submitQuery} />
              ) : (
                <>
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} onFollowUpClick={submitQuery} />
                  ))}
                  <div ref={threadEndRef} />
                </>
              )}
            </div>

            <div className="border-t border-[#E8E4DE] p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your legal situation or question..."
                  rows={1}
                  className="flex-1 max-h-32 p-3 bg-[#F9F7F4] border border-[#E8E4DE] rounded-xl text-[#1A1A1A] placeholder-[#A8B4AA] resize-none focus:outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition-all text-sm leading-relaxed"
                />
                {isSupported && (
                  <button
                    onClick={toggleListening}
                    title={isListening ? 'Stop listening' : 'Ask by voice'}
                    className={
                      'flex-shrink-0 p-3 rounded-xl border transition-all ' +
                      (isListening
                        ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444] animate-pulse'
                        : 'bg-[#F9F7F4] border-[#E8E4DE] text-[#6B7280] hover:text-[#1B4332] hover:border-[#1B4332]')
                    }
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || mutation.isPending}
                  className="flex-shrink-0 px-5 py-3 bg-[#1B4332] text-[#D4A017] font-semibold rounded-xl hover:bg-[#2D6A4F] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <Search size={16} />
                  <span className="hidden sm:inline">
                    {mutation.isPending ? 'Analysing...' : 'Ask'}
                  </span>
                </button>
              </div>
              <p className="mt-2 text-xs text-[#A8B4AA] text-center">
                {'\u2318'} + Enter to submit {'\u00B7'} This is legal information, not legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
