import { TaskCard } from '@/components/tasks/TaskCard';
import type { TaskWithCourse } from '@/lib/dashboard/dashboard-rules';
import type { TaskStatus } from '@/lib/taskHelpers';

interface UrgentTasksWidgetProps {
  tasks: TaskWithCourse[];
  statusOptions: TaskStatus[];
  updateTaskStatus: (formData: FormData) => Promise<void>;
  completeTask: (formData: FormData) => Promise<void>;
}

export function UrgentTasksWidget({
  tasks,
  statusOptions,
  updateTaskStatus,
  completeTask,
}: UrgentTasksWidgetProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-950">משימות דחופות</h2>
        <p className="mt-1 text-sm text-stone-600">3-5 משימות שכדאי לשים אליהן לב עכשיו</p>
      </div>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          אין משימות דחופות כרגע
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
