import { formatDeadlineHebrew } from '@/lib/taskHelpers';
import type { CourseSummary } from '@/lib/dashboard/dashboard-rules';

interface CoursesWidgetProps {
  courseSummaries: CourseSummary[];
}

export function CoursesWidget({ courseSummaries }: CoursesWidgetProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-stone-950">הקורסים שלי</h2>
        <p className="mt-1 text-sm text-stone-600">מבט מהיר על עומס המשימות לפי קורס</p>
      </div>

      {courseSummaries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-700">
          עדיין אין קורסים. אפשר להתחיל מהוספת קורס ראשון.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {courseSummaries.map(({ course, openTaskCount, nearestDueDate }) => (
            <article key={course.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 inline-flex h-4 w-4 shrink-0 rounded-full ring-2 ring-white"
                  style={{ backgroundColor: course.color }}
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-stone-950">{course.name}</h3>
                  {course.code && <p className="mt-1 text-xs text-stone-500">{course.code}</p>}
                </div>
              </div>
              <dl className="mt-4 grid gap-2 text-sm text-stone-700">
                <div className="flex items-center justify-between gap-3">
                  <dt>משימות פתוחות</dt>
                  <dd className="font-semibold text-stone-950">{openTaskCount}</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt>דדליין קרוב</dt>
                  <dd className="font-medium text-stone-800">{formatDeadlineHebrew(nearestDueDate)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
