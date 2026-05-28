import { prisma } from '@/lib/prisma';
import type { Course, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { statusToHebrew, priorityToHebrew, type TaskStatus, type TaskPriority } from '@/lib/taskHelpers';
import { CreateTaskForm } from '@/components/CreateTaskForm';
import { TaskCard } from '@/components/tasks/TaskCard';

const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const priorityOptions: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

async function getCourses(): Promise<Course[]> {
  return prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
}

async function getTasks(): Promise<(Task & { course: Course | null })[]> {
  return prisma.task.findMany({
    include: { course: true },
    orderBy: { dueDate: 'asc' },
  });
}

async function addTask(formData: FormData) {
  'use server';

  const title = formData.get('title')?.toString().trim();
  const description = formData.get('description')?.toString().trim() ?? '';
  const courseId = formData.get('courseId')?.toString();
  const dueDateStr = formData.get('dueDate')?.toString();
  const status = formData.get('status')?.toString() || 'TODO';
  const priority = formData.get('priority')?.toString() || 'MEDIUM';

  if (!title) throw new Error('שם המשימה חובה');
  if (!statusOptions.includes(status as TaskStatus)) throw new Error('סטטוס לא תקין');
  if (!priorityOptions.includes(priority as TaskPriority)) throw new Error('עדיפות לא תקינה');

  const dueDate = dueDateStr ? new Date(dueDateStr) : null;
  if (dueDate && isNaN(dueDate.getTime())) throw new Error('תאריך דדליין לא תקין');

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      courseId: courseId || null,
      dueDate,
      status,
      priority,
    },
  });

  revalidatePath('/tasks');
}

async function deleteTask(formData: FormData) {
  'use server';

  const taskId = formData.get('taskId')?.toString();
  if (!taskId) return;

  await prisma.task.delete({ where: { id: taskId } });
  revalidatePath('/tasks');
}

async function updateTaskStatus(formData: FormData) {
  'use server';

  const taskId = formData.get('taskId')?.toString();
  const newStatus = formData.get('status')?.toString();

  if (!taskId || !newStatus) return;
  if (!statusOptions.includes(newStatus as TaskStatus)) return;

  await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });

  revalidatePath('/tasks');
}

async function completeTask(formData: FormData) {
  'use server';

  const taskId = formData.get('taskId')?.toString();
  if (!taskId) return;

  await prisma.task.update({
    where: { id: taskId },
    data: { status: 'COMPLETED' },
  });

  revalidatePath('/tasks');
}

export default async function TasksPage() {
  const courses = await getCourses();
  const tasks = await getTasks();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">ניהול משימות</p>
          <h1 className="text-3xl font-bold text-slate-900">ניהול משימות</h1>
          <p className="text-slate-600">הוסף משימה חדשה או נהל משימות קיימות דרך הרשימה.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-200">
              חזור לדף הבית
            </Link>
            <Link href="/courses" className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-800 transition hover:bg-slate-200">
              קורסים
            </Link>
          </div>
        </div>

        <CreateTaskForm addTask={addTask}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="title">
                שם המשימה
              </label>
              <input
                id="title"
                name="title"
                required
                placeholder="לדוגמה: פתור שאלות בחודו"
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="description">
                תיאור (לא חובה)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="הערות או תיאור נוסף של המשימה..."
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                rows={2}
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="courseId">
                  קורס
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">בחר קורס</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="dueDate">
                  דדליין
                </label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="status">
                  סטטוס
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="TODO"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusToHebrew[status as TaskStatus]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="priority">
                  עדיפות
                </label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue="MEDIUM"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {priorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priorityToHebrew[priority as TaskPriority]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              הוסף משימה
            </button>
        </CreateTaskForm>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold text-slate-900">משימות קיימות</h2>

        {tasks.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
            עדיין אין משימות.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                statusOptions={statusOptions}
                updateTaskStatus={updateTaskStatus}
                completeTask={completeTask}
                deleteTask={deleteTask}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
