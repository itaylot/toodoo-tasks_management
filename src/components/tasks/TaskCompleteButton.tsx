'use client';

import { useTransition } from 'react';

interface TaskCompleteButtonProps {
  taskId: string;
  isCompleted: boolean;
  completeTask: (formData: FormData) => Promise<void>;
}

export function TaskCompleteButton({ taskId, isCompleted, completeTask }: TaskCompleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    if (isCompleted) return;

    startTransition(() => {
      const formData = new FormData();
      formData.append('taskId', taskId);
      completeTask(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={handleComplete}
      disabled={isCompleted || isPending}
      className="min-h-10 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition active:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
    >
      {isCompleted ? 'הושלם' : isPending ? 'מסמן...' : 'סמן כהושלם'}
    </button>
  );
}
