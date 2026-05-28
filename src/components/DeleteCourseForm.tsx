'use client';

import { useTransition } from 'react';

interface DeleteCourseFormProps {
  courseId: string;
  taskCount: number;
  deleteCourse: (formData: FormData) => Promise<void>;
}

export function DeleteCourseForm({ courseId, taskCount, deleteCourse }: DeleteCourseFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const taskText = taskCount > 0 ? ` לקורס הזה יש ${taskCount} משימות משויכות.` : '';
    const message = `${taskText} מחיקת הקורס תמחק גם את כל המשימות שמשויכות אליו. הפעולה הזו לא ניתנת לביטול.`;
    const confirmed = window.confirm(message.trim());

    if (!confirmed) {
      return;
    }

    startTransition(() => {
      const formData = new FormData();
      formData.append('courseId', courseId);
      deleteCourse(formData);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
    >
      {isPending ? 'מוחק...' : 'מחיקה'}
    </button>
  );
}
