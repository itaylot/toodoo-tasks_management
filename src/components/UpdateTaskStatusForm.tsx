'use client';

import { useTransition } from 'react';
import { statusToHebrew, type TaskStatus } from '@/lib/taskHelpers';

interface UpdateTaskStatusFormProps {
  taskId: string;
  currentStatus: string;
  updateTaskStatus: (formData: FormData) => Promise<void>;
  statusOptions: TaskStatus[];
}

export function UpdateTaskStatusForm({
  taskId,
  currentStatus,
  updateTaskStatus,
  statusOptions,
}: UpdateTaskStatusFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;

    startTransition(() => {
      const formData = new FormData();
      formData.append('taskId', taskId);
      formData.append('status', newStatus);
      updateTaskStatus(formData);
    });
  };

  return (
    <select
      name="status"
      defaultValue={currentStatus}
      onChange={handleStatusChange}
      disabled={isPending}
      className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:opacity-50"
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {statusToHebrew[status as TaskStatus]}
        </option>
      ))}
    </select>
  );
}
