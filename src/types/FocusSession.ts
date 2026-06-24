export interface FocusSession {
  id: string;
  duration: number; // in seconds
  startTime: Date;
  endTime: Date;
  name: string;
  description?: string;
  tag?: 'work' | 'personal' | 'study' | 'break' | 'other';
  dateCreated: string; // ISO date string
}

export interface SessionStats {
  totalToday: number;
  totalThisWeek: number;
  totalThisMonth: number;
  totalAllTime: number;
}
