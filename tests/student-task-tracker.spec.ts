import { expect, test, type Page } from '@playwright/test';
import { PrismaClient } from '@prisma/client';

const suffix = Date.now();
const statsCourse = `בדיקת QA - סטטיסטיקה ${suffix}`;
const historyCourse = `בדיקת QA - היסטוריה ${suffix}`;

const taskA = `משימה באיחור ${suffix}`;
const taskB = `משימה להיום ${suffix}`;
const taskC = `משימה למחר ${suffix}`;
const taskD = `משימה בלי דדליין ${suffix}`;
const taskE = `משימה שכבר הושלמה ${suffix}`;
const standaloneTask = `משימה ללא קורס ${suffix}`;
const previewCourse = `בדיקת QA - תצוגת קורס ${suffix}`;
const previewTask = `משימת תצוגה בקורס ${suffix}`;

function dateTimeLocal(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(9, 0, 0, 0);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T09:00`;
}

async function createCourse(page: Page, name: string) {
  await page.goto('/courses');
  await page.locator('input[name="name"]').fill(name);
  await page.locator('button[type="submit"]').filter({ hasText: 'הוסף קורס' }).click();
  await expect(page.getByText(name)).toBeVisible();
}

async function createTask(
  page: Page,
  options: {
    title: string;
    course?: string;
    dueDate?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status?: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  },
) {
  await page.goto('/tasks');
  const createForm = page.locator('form').first();
  await createForm.locator('input[name="title"]').fill(options.title);

  if (options.course) {
    await createForm.locator('select[name="courseId"]').selectOption({ label: options.course });
  }

  if (options.dueDate) {
    await createForm.locator('input[name="dueDate"]').fill(options.dueDate);
  }

  await createForm.locator('select[name="priority"]').selectOption(options.priority);
  await createForm.locator('select[name="status"]').selectOption(options.status ?? 'TODO');
  await createForm.locator('button[type="submit"]').click();
  await expect(page.getByText(options.title)).toBeVisible();
}

function sectionByHeading(page: Page, heading: string) {
  return page.locator('section', { has: page.getByRole('heading', { name: heading }) });
}

test.describe.serial('Student Task Tracker MVP QA', () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient();
    await prisma.task.deleteMany({
      where: {
        OR: [
          { title: { startsWith: 'משימה באיחור' } },
          { title: { startsWith: 'משימה להיום' } },
          { title: { startsWith: 'משימה למחר' } },
          { title: { startsWith: 'משימה בלי דדליין' } },
          { title: { startsWith: 'משימה שכבר הושלמה' } },
          { title: { startsWith: 'משימה ללא קורס' } },
          { title: { startsWith: 'משימת תצוגה בקורס' } },
        ],
      },
    });
    await prisma.course.deleteMany({
      where: {
        OR: [
          { name: { startsWith: 'בדיקת QA - סטטיסטיקה' } },
          { name: { startsWith: 'בדיקת QA - היסטוריה' } },
          { name: { startsWith: 'בדיקת QA - תצוגת קורס' } },
        ],
      },
    });
    await prisma.$disconnect();
  });

  test('dashboard loads with Hebrew RTL widgets', async ({ page }) => {
    const appErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && !message.text().includes('favicon')) {
        appErrors.push(message.text());
      }
    });

    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { name: 'שלום 👋' })).toBeVisible();
    await expect(page.getByText('הנה מה שדורש את תשומת הלב שלך עכשיו')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'משימות דחופות' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'דדליינים קרובים' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'הקורסים שלי' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'פעולות מהירות' })).toBeVisible();
    expect(appErrors).toEqual([]);
  });

  test('create QA courses and tasks through the UI', async ({ page }) => {
    await createCourse(page, statsCourse);
    await createCourse(page, historyCourse);

    await createTask(page, {
      title: taskA,
      course: statsCourse,
      dueDate: dateTimeLocal(-1),
      priority: 'HIGH',
    });
    await createTask(page, {
      title: taskB,
      course: statsCourse,
      dueDate: dateTimeLocal(0),
      priority: 'MEDIUM',
    });
    await createTask(page, {
      title: taskC,
      course: historyCourse,
      dueDate: dateTimeLocal(1),
      priority: 'HIGH',
    });
    await createTask(page, {
      title: taskD,
      course: historyCourse,
      priority: 'LOW',
    });
    await createTask(page, {
      title: taskE,
      course: statsCourse,
      dueDate: dateTimeLocal(0),
      priority: 'HIGH',
      status: 'COMPLETED',
    });
    await createTask(page, {
      title: standaloneTask,
      priority: 'LOW',
    });
  });

  test('dashboard ranks open tasks and excludes completed task from urgent/deadlines', async ({ page }) => {
    await page.goto('/');

    const urgent = sectionByHeading(page, 'משימות דחופות');
    await expect(urgent.getByText(taskA)).toBeVisible();
    await expect(urgent.getByText(taskB)).toBeVisible();
    await expect(urgent.getByText(taskC)).toBeVisible();
    await expect(urgent.getByText(taskE)).toHaveCount(0);
    await expect(urgent.getByText(statsCourse).first()).toBeVisible();
    await expect(urgent.getByText('סמן כהושלם').first()).toBeVisible();

    const urgentText = await urgent.innerText();
    expect(urgentText.indexOf(taskA)).toBeLessThan(urgentText.indexOf(taskB));
    expect(urgentText.indexOf(taskB)).toBeLessThan(urgentText.indexOf(taskC));

    const deadlines = sectionByHeading(page, 'דדליינים קרובים');
    await expect(deadlines.getByText(taskB)).toBeVisible();
    await expect(deadlines.getByText(taskC)).toBeVisible();
    await expect(deadlines.getByText(taskD)).toHaveCount(0);
    await expect(deadlines.getByText(taskE)).toHaveCount(0);
  });

  test('complete task from dashboard and verify on tasks page', async ({ page }) => {
    await page.goto('/');
    const urgent = sectionByHeading(page, 'משימות דחופות');
    const taskCard = urgent.locator('article', { hasText: taskA }).first();
    await taskCard.getByRole('button', { name: 'סמן כהושלם' }).click();
    await expect(urgent.locator('article', { hasText: taskA })).toHaveCount(0);

    await page.goto('/tasks');
    const completedTask = page.locator('article', { hasText: taskA }).first();
    await expect(completedTask).toContainText('הושלם');
  });

  test('quick actions navigate to expected routes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'הוסף משימה' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.goto('/');
    await page.getByRole('link', { name: 'הוסף קורס' }).click();
    await expect(page).toHaveURL(/\/courses$/);

    await page.goto('/');
    await page.getByRole('link', { name: 'כל המשימות' }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.goto('/');
    await page.getByRole('link', { name: 'הקורסים שלי' }).click();
    await expect(page).toHaveURL(/\/courses$/);
  });

  test('course deletion confirms cascade behavior and standalone tasks remain', async ({ page }) => {
    await page.goto('/courses');
    const statsCard = page.locator('article', { hasText: statsCourse }).first();

    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('מחיקת הקורס תמחק גם את כל המשימות שמשויכות אליו');
      await dialog.accept();
    });

    await statsCard.getByRole('button', { name: 'מחיקה' }).click();
    await expect(page.getByText(statsCourse)).toHaveCount(0);

    await page.goto('/tasks');
    await expect(page.getByText(taskB)).toHaveCount(0);
    await expect(page.getByText(taskE)).toHaveCount(0);
    await expect(page.getByText(standaloneTask)).toBeVisible();
  });

  test('mobile dashboard is readable and does not overflow horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'משימות דחופות' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'דדליינים קרובים' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'הקורסים שלי' })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);

    const firstButton = page.getByRole('button', { name: /סמן כהושלם|הושלם/ }).first();
    if ((await firstButton.count()) > 0) {
      const box = await firstButton.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(36);
    }
  });

  test('courses page shows compact task previews under each course', async ({ page }) => {
    await createCourse(page, previewCourse);
    await createTask(page, {
      title: previewTask,
      course: previewCourse,
      dueDate: dateTimeLocal(2),
      priority: 'MEDIUM',
    });

    await page.goto('/courses');
    const previewCard = page.locator('article', { hasText: previewCourse }).first();
    await expect(previewCard).toBeVisible();
    await expect(previewCard.getByText(previewTask)).toBeVisible();
    await expect(previewCard.getByText('דדליין')).toBeVisible();
  });
});
