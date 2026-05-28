import { statusToHebrew, type TaskStatus } from '@/lib/taskHelpers';

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'bg-slate-100 text-slate-700 ring-slate-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 ring-blue-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
};

interface TaskStatusBadgeProps {
  status: string;
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const safeStatus = status as TaskStatus;
  const label = statusToHebrew[safeStatus] ?? status;
  const style = statusStyles[safeStatus] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style}`}>
      {label}
    </span>
  );
}
