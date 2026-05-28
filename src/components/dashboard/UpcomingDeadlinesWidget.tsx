import { TaskCard } from '@/components/tasks/TaskCard';
import type { TaskWithCourse } from '@/lib/dashboard/dashboard-rules';
import type { TaskStatus } from '@/lib/taskHelpers';

interface UpcomingDeadlinesWidgetProps {
  tasks: TaskWithCourse[];
  statusOptions: TaskStatus[];
  updateTaskStatus: (formData: FormData) => Promise<void>;
  completeTask: (formData: FormData) => Promise<void>;
}

export function UpcomingDeadlinesWidget({
  tasks,
  statusOptions,
  updateTaskStatus,
  completeTask,
}: UpcomingDeadlinesWidgetProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-950">דדליינים קרובים</h2>
        <p className="mt-1 text-sm text-stone-600">משימות פתוחות לפי תאריך קרוב</p>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-700">
          אין דדליינים קרובים
        </p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              statusOptions={statusOptions}
              updateTaskStatus={updateTaskStatus}
              completeTask={completeTask}
            />
          ))}
        </div>
      )}
    </section>
  );
}
