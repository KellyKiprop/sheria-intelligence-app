import { useState, useCallback, useEffect, useMemo } from 'react';
import { QueryResponse, ConversationTurn } from './api';

export interface Message {
  id: string;
  query: string;
  result: QueryResponse | null;
  status: 'pending' | 'done' | 'error';
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'sheria_sessions_v1';
const MAX_HISTORY_TURNS_SENT = 3;
const TITLE_MAX_LENGTH = 42;

function makeTitle(query: string): string {
  const trimmed = query.trim();
  if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed;
  return trimmed.slice(0, TITLE_MAX_LENGTH).trimEnd() + '...';
}

function loadFromStorage(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return parsed
      .map((s) => ({ ...s, messages: s.messages.filter((m) => m.status !== 'pending') }))
      .filter((s) => s.messages.length > 0);
  } catch {
    return [];
  }
}

function saveToStorage(sessions: Session[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Storage full or unavailable — sessions just won't persist across reloads.
  }
}

export function useConversation() {
  const [sessions, setSessions] = useState<Session[]>(() => loadFromStorage());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    () => loadFromStorage()[0]?.id ?? null
  );

  useEffect(() => {
    saveToStorage(sessions);
  }, [sessions]);

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const messages = activeSession?.messages ?? [];

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions]
  );

  const newSession = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const switchSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id));
      setActiveSessionId((current) => (current === id ? null : current));
    },
    []
  );

  const startTurn = useCallback(
    (query: string): { sessionId: string; turnId: string } => {
      const turnId = Date.now().toString() + '-' + Math.random().toString(36).slice(2, 9);
      const newMessage: Message = {
        id: turnId,
        query,
        result: null,
        status: 'pending',
        timestamp: Date.now(),
      };

      if (activeSession) {
        const sessionId = activeSession.id;
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages: [...s.messages, newMessage], updatedAt: Date.now() }
              : s
          )
        );
        return { sessionId, turnId };
      }

      const sessionId = 'session-' + Date.now().toString() + '-' + Math.random().toString(36).slice(2, 9);
      const session: Session = {
        id: sessionId,
        title: makeTitle(query),
        messages: [newMessage],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => [...prev, session]);
      setActiveSessionId(sessionId);
      return { sessionId, turnId };
    },
    [activeSession]
  );

  const completeTurn = useCallback((sessionId: string, turnId: string, result: QueryResponse) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === turnId ? { ...m, result, status: 'done' as const } : m
              ),
              updatedAt: Date.now(),
            }
          : s
      )
    );
  }, []);

  const failTurn = useCallback((sessionId: string, turnId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === turnId ? { ...m, status: 'error' as const } : m
              ),
            }
          : s
      )
    );
  }, []);

  const removeTurn = useCallback((sessionId: string, turnId: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, messages: s.messages.filter((m) => m.id !== turnId) }
          : s
      )
    );
  }, []);

  const getHistoryForApi = useCallback((): ConversationTurn[] => {
    if (!activeSession) return [];
    return activeSession.messages
      .filter((m) => m.status === 'done' && m.result)
      .slice(-MAX_HISTORY_TURNS_SENT)
      .map((m) => ({ query: m.query, response: m.result!.response }));
  }, [activeSession]);

  return {
    sessions: sortedSessions,
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
    hasMessages: messages.length > 0,
  };
}
