export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const statusToHebrew: Record<TaskStatus, string> = {
  TODO: 'לביצוע',
  IN_PROGRESS: 'בביצוע',
  COMPLETED: 'הושלם',
};

export const priorityToHebrew: Record<TaskPriority, string> = {
  LOW: 'נמוכה',
  MEDIUM: 'בינונית',
  HIGH: 'גבוהה',
};

// Forest-inspired color palette for priority badges
export const priorityColors: Record<TaskPriority, { bg: string; text: string }> = {
  LOW: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  MEDIUM: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
  },
  HIGH: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
  },
};

export const hebrewToStatus: Record<string, TaskStatus> = {
  'לביצוע': 'TODO',
  'בביצוע': 'IN_PROGRESS',
  'הושלם': 'COMPLETED',
};

export const hebrewToPriority: Record<string, TaskPriority> = {
  'נמוכה': 'LOW',
  'בינונית': 'MEDIUM',
  'גבוהה': 'HIGH',
};

export function formatDeadlineHebrew(date: Date | null): string {
  if (!date) return 'ללא דדליין';

  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} בשעה ${hours}:${minutes}`;
}
