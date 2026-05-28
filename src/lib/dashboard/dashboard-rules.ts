import type { Course, Task } from '@prisma/client';

export type TaskWithCourse = Task & { course: Course | null };

export interface CourseSummary {
  course: Course;
  openTaskCount: number;
  nearestDueDate: Date | null;
}

export const urgencyConfig = {
  overdue: 100,
  dueToday: 85,
  dueTomorrow: 65,
  dueThisWeek: 40,
  highPriority: 30,
  mediumPriority: 15,
  lowPriority: 5,
  inProgress: 10,
  todo: 0,
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysUntilDue(dueDate: Date, now = new Date()): number {
  return Math.floor((startOfDay(dueDate).getTime() - startOfDay(now).getTime()) / DAY_IN_MS);
}

function isOpenTask(task: Pick<Task, 'status'>): boolean {
  return task.status !== 'COMPLETED';
}

export function calculateUrgencyScore(task: Pick<Task, 'dueDate' | 'priority' | 'status'>): number {
  if (!isOpenTask(task)) return Number.NEGATIVE_INFINITY;

  let score = 0;

  if (task.dueDate) {
    const daysUntilDue = getDaysUntilDue(task.dueDate);

    if (daysUntilDue < 0) {
      score += urgencyConfig.overdue;
    } else if (daysUntilDue === 0) {
      score += urgencyConfig.dueToday;
    } else if (daysUntilDue === 1) {
      score += urgencyConfig.dueTomorrow;
    } else if (daysUntilDue <= 7) {
      score += urgencyConfig.dueThisWeek;
    }
  }

  if (task.priority === 'HIGH') score += urgencyConfig.highPriority;
  if (task.priority === 'MEDIUM') score += urgencyConfig.mediumPriority;
  if (task.priority === 'LOW') score += urgencyConfig.lowPriority;

  if (task.status === 'IN_PROGRESS') score += urgencyConfig.inProgress;
  if (task.status === 'TODO') score += urgencyConfig.todo;

  return score;
}

export function getUrgentTasks<T extends Task>(tasks: T[], limit = 5): T[] {
  return tasks
    .filter(isOpenTask)
    .map((task) => ({ task, score: calculateUrgencyScore(task) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aTime = a.task.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = b.task.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })
    .slice(0, limit)
    .map(({ task }) => task);
}

export function getUpcomingDeadlines<T extends Task>(tasks: T[], limit = 5): T[] {
  const today = startOfDay(new Date());

  return tasks
    .filter((task) => isOpenTask(task) && task.dueDate && task.dueDate >= today)
    .sort((a, b) => {
      const aTime = a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    })
    .slice(0, limit);
}

export function getCourseSummaries(courses: Course[], tasks: Task[]): CourseSummary[] {
  return courses.map((course) => {
    const courseOpenTasks = tasks.filter((task) => task.courseId === course.id && isOpenTask(task));
    const nearestDueDate =
      courseOpenTasks
        .filter((task) => task.dueDate)
        .sort((a, b) => {
          const aTime = a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
          const bTime = b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
          return aTime - bTime;
        })[0]?.dueDate ?? null;

    return {
      course,
      openTaskCount: courseOpenTasks.length,
      nearestDueDate,
    };
  });
}
