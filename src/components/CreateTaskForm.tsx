'use client';

import { useRef } from 'react';

interface CreateTaskFormProps {
  addTask: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
}

export function CreateTaskForm({ addTask, children }: CreateTaskFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addTask(formData);
        formRef.current?.reset();
      }}
      className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6"
    >
      {children}
    </form>
  );
}
