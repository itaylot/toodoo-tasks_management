import { prisma } from '@/lib/prisma';
import type { Course, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { DeleteCourseForm } from '@/components/DeleteCourseForm';
import { PriorityBadge } from '@/components/tasks/PriorityBadge';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { formatDeadlineHebrew } from '@/lib/taskHelpers';

const DEFAULT_COLOR = '#2563eb';

type CourseWithTaskRelation = Course & { tasks: Task[] };
type CourseWithTasks = CourseWithTaskRelation & { taskCount: number };

function sortCourseTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aCompleted = a.status === 'COMPLETED';
    const bCompleted = b.status === 'COMPLETED';
    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;

    const aDueTime = a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bDueTime = b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    if (aDueTime !== bDueTime) return aDueTime - bDueTime;

    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}

async function getCourses(): Promise<CourseWithTasks[]> {
  const courses: CourseWithTaskRelation[] = await prisma.course.findMany({
    include: { tasks: true },
    orderBy: { createdAt: 'desc' },
  });

  return courses.map((course) => {
    const tasks = sortCourseTasks(course.tasks);
    return { ...course, tasks, taskCount: tasks.length };
  });
}

async function addCourse(formData: FormData) {
  'use server';

  const name = formData.get('name')?.toString().trim();
  const code = formData.get('code')?.toString().trim() ?? '';
  const color = formData.get('color')?.toString() || DEFAULT_COLOR;

  if (!name) {
    throw new Error('שם הקורס חובה');
  }

  await prisma.course.create({
    data: {
      name,
      code: code || null,
      color,
    },
  });

  revalidatePath('/courses');
}

async function deleteCourse(formData: FormData) {
  'use server';

  const courseId = formData.get('courseId')?.toString();
  if (!courseId) return;

  await prisma.course.delete({ where: { id: courseId } });
  revalidatePath('/courses');
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">ניהול קורסים</p>
          <h1 className="text-3xl font-bold text-slate-900">ניהול קורסים</h1>
          <p className="text-slate-600">הוסף קורס חדש או ערוך קורסים קיימים דרך הרשימה.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-200">
              חזור לדף הבית
            </Link>
            <Link href="/tasks" className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-200">
              משימות
            </Link>
          </div>
        </div>

        <form action={addCourse} className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm font-medium text-slate-700" htmlFor="name">
              שם הקורס
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="לדוגמה: מתמטיקה 1"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm font-medium text-slate-700" htmlFor="code">
              קוד קורס (לא חובה)
            </label>
            <input
              id="code"
              name="code"
              placeholder="לדוגמה: MATH101"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
            <label className="text-sm font-medium text-slate-700" htmlFor="color">
              צבע קורס
            </label>
            <div className="flex items-center gap-3">
              <input
                id="color"
                name="color"
                type="color"
                defaultValue={DEFAULT_COLOR}
                className="h-12 w-12 cursor-pointer rounded-xl border border-slate-300 p-1"
              />
              <span className="text-slate-600">בחר צבע או השאר את ברירת המחדל</span>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            הוסף קורס
          </button>
        </form>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">קורסים קיימים</h2>

        {courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            עדיין אין קורסים ברשימה. הוסף קורס חדש באמצעות הטופס למעלה.
          </p>
        ) : (
          <div className="space-y-4">
            {courses.map((course: CourseWithTasks) => (
              <article key={course.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: course.color }} />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{course.name}</p>
                    <p className="text-sm text-slate-600">{course.code || 'ללא קוד'}</p>
                  </div>
                </div>
                <DeleteCourseForm
                  courseId={course.id}
                  taskCount={course.taskCount}
                  deleteCourse={deleteCourse}
                />

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-semibold text-slate-800">משימות בקורס</h3>

                  {course.tasks.length === 0 ? (
                    <p className="mt-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">
                      אין משימות בקורס הזה
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      <ul className="space-y-2">
                        {course.tasks.slice(0, 3).map((task: Task) => {
                          const isCompleted = task.status === 'COMPLETED';

                          return (
                            <li
                              key={task.id}
                              className={`rounded-2xl border border-slate-200 bg-white p-3 ${
                                isCompleted ? 'text-slate-500 opacity-80' : 'text-slate-800'
                              }`}
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <p className={`font-medium ${isCompleted ? 'line-through' : ''}`}>
                                    {task.title}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    דדליין: {formatDeadlineHebrew(task.dueDate)}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <TaskStatusBadge status={task.status} />
                                  <PriorityBadge priority={task.priority} />
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {course.tasks.length > 3 ? (
                        <p className="text-sm text-slate-600">ועוד {course.tasks.length - 3} משימות</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
