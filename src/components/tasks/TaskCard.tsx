import type { Course, Task } from '@prisma/client';
import { formatDeadlineHebrew, type TaskStatus } from '@/lib/taskHelpers';
import { UpdateTaskStatusForm } from '@/components/UpdateTaskStatusForm';
import { PriorityBadge } from './PriorityBadge';
import { TaskCompleteButton } from './TaskCompleteButton';
import { TaskStatusBadge } from './TaskStatusBadge';

type TaskWithCourse = Task & { course: Course | null };

interface TaskCardProps {
  task: TaskWithCourse;
  statusOptions: TaskStatus[];
  updateTaskStatus: (formData: FormData) => Promise<void>;
  completeTask: (formData: FormData) => Promise<void>;
  deleteTask?: (formData: FormData) => Promise<void>;
}

export function TaskCard({
  task,
  statusOptions,
  updateTaskStatus,
  completeTask,
  deleteTask,
}: TaskCardProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <article
      className={`flex flex-col gap-4 rounded-2xl border p-5 transition ${
        isCompleted
          ? 'border-slate-200 bg-slate-50 text-slate-500'
          : 'border-slate-200 bg-white text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className={`text-lg font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`mt-1 text-sm leading-6 ${isCompleted ? 'text-slate-500' : 'text-slate-600'}`}>
              {task.description}
            </p>
          )}
          <div className="mt-3 grid gap-1 text-sm text-slate-500 sm:grid-cols-2">
            <p>קורס: {task.course?.name || 'ללא קורס'}</p>
            <p>דדליין: {formatDeadlineHebrew(task.dueDate)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          <TaskStatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 sm:flex-row sm:flex-wrap sm:items-center">
        <TaskCompleteButton taskId={task.id} isCompleted={isCompleted} completeTask={completeTask} />

        <UpdateTaskStatusForm
          taskId={task.id}
          currentStatus={task.status}
          updateTaskStatus={updateTaskStatus}
          statusOptions={statusOptions}
        />

        {deleteTask && (
          <form action={deleteTask} className="flex items-center">
            <input type="hidden" name="taskId" value={task.id} />
            <button
              type="submit"
              className="min-h-10 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white transition active:bg-red-800"
            >
              מחיקה
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
