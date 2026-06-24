import { useState } from 'react';

import { Button } from '../../../ui/button';
import { LucideEdit2, LucideTrash2, LucideClock } from 'lucide-react';
import { format } from 'date-fns';
import { useFocusSessionStore } from '../../../../stores/focusSessionStore';
import type FocusSession from '../FocusSesstion/FocusSessionSec';
import SessionModal from './SessionModal';



type FilterType = 'today' | 'week' | 'month' | 'all';

function SessionHistory() {
  const [filterType, setFilterType] = useState<FilterType>('today');
  const [editingSession, setEditingSession] = useState<FocusSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    sessions,
    getSessionsForToday,
    getSessionsForWeek,
    getSessionsForMonth,
    getTotalTimeToday,
    getTotalTimeThisWeek,
    getTotalTimeThisMonth,
    getTotalTimeAllTime,
    deleteSession,
  } = useFocusSessionStore();

  const getFilteredSessions = (): FocusSession[] => {
    switch (filterType) {
      case 'today':
        return getSessionsForToday();
      case 'week':
        return getSessionsForWeek();
      case 'month':
        return getSessionsForMonth();
      case 'all':
        return sessions;
      default:
        return [];
    }
  };

  const getTotalTime = (): number => {
    switch (filterType) {
      case 'today':
        return getTotalTimeToday();
      case 'week':
        return getTotalTimeThisWeek();
      case 'month':
        return getTotalTimeThisMonth();
      case 'all':
        return getTotalTimeAllTime();
      default:
        return 0;
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const filteredSessions = getFilteredSessions();
  const totalTime = getTotalTime();

  const handleEdit = (session: FocusSession) => {
    setEditingSession(session);
    setModalOpen(true);
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      deleteSession(sessionId);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Focus Sessions History</h2>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['today', 'week', 'month', 'all'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filterType === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600'
              }`}
            >
              {filter === 'all' ? 'All Time' : `This ${filter === 'today' ? 'Day' : filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Total Time Stats */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mb-6 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <LucideClock className="text-blue-600" size={24} />
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Total Focus Time ({filterType === 'all' ? 'All Time' : `This ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`})
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {formatDuration(totalTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {filteredSessions.length > 0 ? (
            filteredSessions
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .map((session) => (
                <div
                  key={session.id}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {session.name}
                    </p>
                    <div className="flex gap-4 mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      <span>
                        {format(new Date(session.startTime), 'MMM dd, yyyy')} at{' '}
                        {format(new Date(session.startTime), 'HH:mm')}
                      </span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">
                        Duration: {formatDuration(session.duration)}
                      </span>
                      {session.tag && (
                        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs capitalize">
                          {session.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(session)}
                      className="flex items-center gap-1.5"
                    >
                      <LucideEdit2 size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(session.id)}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                    >
                      <LucideTrash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-neutral-600 dark:text-neutral-400">
              <p>No focus sessions for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSession && (
        <SessionModal
          session={editingSession}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingSession(null);
          }}
        />
      )}
    </div>
  );
}

export default SessionHistory;
