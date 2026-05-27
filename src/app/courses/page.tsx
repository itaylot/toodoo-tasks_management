import { prisma } from '@/lib/prisma';
import type { Course } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

const DEFAULT_COLOR = '#2563eb';

async function getCourses(): Promise<(Course & { taskCount: number })[]> {
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  
  const coursesWithTaskCount = await Promise.all(
    courses.map(async (course: Course) => {
      const taskCount = await prisma.task.count({ where: { courseId: course.id } });
      return { ...course, taskCount };
    })
  );

  return coursesWithTaskCount;
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
            {courses.map((course) => (
              <article key={course.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-4 w-4 rounded-full" style={{ backgroundColor: course.color }} />
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{course.name}</p>
                    <p className="text-sm text-slate-600">{course.code || 'ללא קוד'}</p>
                  </div>
                </div>
                <form action={deleteCourse} className="flex items-center justify-start sm:justify-end">
                  <input type="hidden" name="courseId" value={course.id} />
                  <button
                    type="submit"
                    onClick={(e) => {
                      if (course.taskCount > 0) {
                        const confirmed = window.confirm(`לקורס הזה יש ${course.taskCount} משימות משויכות. מחיקת הקורס תמחק גם את המשימות שלו. האם אתה בטוח?`);
                        if (!confirmed) {
                          e.preventDefault();
                        }
                      }
                    }}
                    className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    מחיקה
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
