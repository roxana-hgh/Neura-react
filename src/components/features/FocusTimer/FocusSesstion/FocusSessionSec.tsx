
import { useState } from 'react';
import FocusTimer from "../Timer/Timer";
import SessionHistory from '../SessionHistory/SessionHistory';
import type { FocusSession } from '../../../../types/FocusSession';


function FocusSession() {
  const [justSavedSession, setJustSavedSession] = useState<FocusSession | null>(null);

  const handleSessionSaved = (session: FocusSession) => {
    setJustSavedSession(session);
    // Clear the notification after 3 seconds
    setTimeout(() => setJustSavedSession(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      {/* Timer Section - Main CTA */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-center font-medium text-base mb-4 dark:text-neutral-200">
          Neura Focus Mode
        </h2>
        <FocusTimer onSessionSaved={handleSessionSaved} />

        {/* Save Notification */}
        {justSavedSession && (
          <div className="mt-4 mx-auto max-w-4xl animate-in fade-in">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-sm text-green-700 dark:text-green-300">
              ✓ Session saved: {justSavedSession.name}
            </div>
          </div>
        )}
      </div>

      {/* Session History Section */}
      <div className="py-6 px-4">
        <SessionHistory />
      </div>
    </div>
  );
}

export default FocusSession;
