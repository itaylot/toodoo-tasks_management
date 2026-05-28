import type { Course } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { CoursesWidget } from '@/components/dashboard/CoursesWidget';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { QuickActionsWidget } from '@/components/dashboard/QuickActionsWidget';
import { UpcomingDeadlinesWidget } from '@/components/dashboard/UpcomingDeadlinesWidget';
import { UrgentTasksWidget } from '@/components/dashboard/UrgentTasksWidget';
import {
  getCourseSummaries,
  getUpcomingDeadlines,
  getUrgentTasks,
  type TaskWithCourse,
} from '@/lib/dashboard/dashboard-rules';
import { prisma } from '@/lib/prisma';
import type { TaskStatus } from '@/lib/taskHelpers';

const statusOptions: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED'];

async function getDashboardData(): Promise<{ courses: Course[]; tasks: TaskWithCourse[] }> {
  const [courses, tasks] = await Promise.all([
    prisma.course.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.task.findMany({
      include: { course: true },
      orderBy: { dueDate: 'asc' },
    }),
  ]);

  return { courses, tasks };
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

  revalidatePath('/');
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

  revalidatePath('/');
  revalidatePath('/tasks');
}

export default async function DashboardPage() {
  const { courses, tasks } = await getDashboardData();
  const urgentTasks = getUrgentTasks(tasks, 5);
  const upcomingDeadlines = getUpcomingDeadlines(tasks, 5);
  const courseSummaries = getCourseSummaries(courses, tasks);

  return (
    <main className="min-h-screen bg-[#f4efe4] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-5">
        <DashboardHeader />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <UrgentTasksWidget
            tasks={urgentTasks}
            statusOptions={statusOptions}
            updateTaskStatus={updateTaskStatus}
            completeTask={completeTask}
          />

          <div className="grid content-start gap-5">
            <QuickActionsWidget />
            <CoursesWidget courseSummaries={courseSummaries} />
          </div>
        </div>

        <UpcomingDeadlinesWidget
          tasks={upcomingDeadlines}
          statusOptions={statusOptions}
          updateTaskStatus={updateTaskStatus}
          completeTask={completeTask}
        />
      </div>
    </main>
  );
}
