import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { FocusSession } from '../types/FocusSession';
import { format, startOfDay, startOfWeek, startOfMonth, isAfter, isBefore } from 'date-fns';

interface FocusSessionState {
  sessions: FocusSession[];
  addSession: (session: Omit<FocusSession, 'id' | 'dateCreated'>) => void;
  updateSession: (id: string, updates: Partial<FocusSession>) => void;
  deleteSession: (id: string) => void;
  getSessionsForToday: () => FocusSession[];
  getSessionsForWeek: () => FocusSession[];
  getSessionsForMonth: () => FocusSession[];
  getTotalTimeToday: () => number;
  getTotalTimeThisWeek: () => number;
  getTotalTimeThisMonth: () => number;
  getTotalTimeAllTime: () => number;
}

export const useFocusSessionStore = create<FocusSessionState>()(
  devtools(
    persist(
      (set, get) => ({
        sessions: [],

        addSession: (session) =>
          set((state) => ({
            sessions: [
              ...state.sessions,
              {
                ...session,
                id: `session_${Date.now()}`,
                dateCreated: format(new Date(), 'yyyy-MM-dd'),
              },
            ],
          })),

        updateSession: (id, updates) =>
          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === id ? { ...session, ...updates } : session
            ),
          })),

        deleteSession: (id) =>
          set((state) => ({
            sessions: state.sessions.filter((session) => session.id !== id),
          })),

        getSessionsForToday: () => {
          const today = startOfDay(new Date());
          return get().sessions.filter((session) => {
            const sessionStart = startOfDay(session.startTime);
            return format(sessionStart, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          });
        },

        getSessionsForWeek: () => {
          const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);

          return get().sessions.filter((session) => {
            const sessionStart = new Date(session.startTime);
            return isAfter(sessionStart, weekStart) && isBefore(sessionStart, weekEnd);
          });
        },

        getSessionsForMonth: () => {
          const monthStart = startOfMonth(new Date());
          const monthEnd = new Date(monthStart);
          monthEnd.setMonth(monthEnd.getMonth() + 1);

          return get().sessions.filter((session) => {
            const sessionStart = new Date(session.startTime);
            return isAfter(sessionStart, monthStart) && isBefore(sessionStart, monthEnd);
          });
        },

        getTotalTimeToday: () => {
          return get()
            .getSessionsForToday()
            .reduce((total, session) => total + session.duration, 0);
        },

        getTotalTimeThisWeek: () => {
          return get()
            .getSessionsForWeek()
            .reduce((total, session) => total + session.duration, 0);
        },

        getTotalTimeThisMonth: () => {
          return get()
            .getSessionsForMonth()
            .reduce((total, session) => total + session.duration, 0);
        },

        getTotalTimeAllTime: () => {
          return get().sessions.reduce((total, session) => total + session.duration, 0);
        },
      }),
      {
        name: 'focus-sessions-store',
      }
    )
  )
);
