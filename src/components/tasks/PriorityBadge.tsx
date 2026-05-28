import { priorityToHebrew, type TaskPriority } from '@/lib/taskHelpers';

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-green-100 text-green-800 ring-green-200',
  MEDIUM: 'bg-amber-100 text-amber-800 ring-amber-200',
  HIGH: 'bg-red-100 text-red-800 ring-red-200',
};

interface PriorityBadgeProps {
  priority: string;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const safePriority = priority as TaskPriority;
  const label = priorityToHebrew[safePriority] ?? priority;
  const style = priorityStyles[safePriority] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style}`}>
      {label}
    </span>
  );
}
