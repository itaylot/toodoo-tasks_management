export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export const statusToHebrew: Record<TaskStatus, string> = {
  NOT_STARTED: 'לא התחיל',
  IN_PROGRESS: 'בביצוע',
  DONE: 'הושלם',
  BLOCKED: 'תקוע',
};

export const priorityToHebrew: Record<TaskPriority, string> = {
  LOW: 'נמוכה',
  MEDIUM: 'בינונית',
  HIGH: 'גבוהה',
};

export const hebrewToStatus: Record<string, TaskStatus> = {
  'לא התחיל': 'NOT_STARTED',
  'בביצוע': 'IN_PROGRESS',
  'הושלם': 'DONE',
  'תקוע': 'BLOCKED',
};

export const hebrewToPriority: Record<string, TaskPriority> = {
  'נמוכה': 'LOW',
  'בינונית': 'MEDIUM',
  'גבוהה': 'HIGH',
};

export function formatDeadlineHebrew(date: Date): string {
  const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} בשעה ${hours}:${minutes}`;
}
