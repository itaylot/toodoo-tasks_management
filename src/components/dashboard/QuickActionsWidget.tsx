import Link from 'next/link';

const actions = [
  { href: '/tasks', label: 'הוסף משימה', variant: 'primary' },
  { href: '/courses', label: 'הוסף קורס', variant: 'secondary' },
  { href: '/tasks', label: 'כל המשימות', variant: 'light' },
  { href: '/courses', label: 'הקורסים שלי', variant: 'light' },
];

const styles: Record<string, string> = {
  primary: 'bg-emerald-800 text-white active:bg-emerald-900',
  secondary: 'bg-stone-700 text-white active:bg-stone-800',
  light: 'border border-stone-200 bg-white text-stone-800 active:bg-stone-100',
};

export function QuickActionsWidget() {
  return (
    <section className="rounded-2xl border border-stone-200 bg-emerald-50 p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-stone-950">פעולות מהירות</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={`${action.href}-${action.label}`}
            href={action.href}
            className={`flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${styles[action.variant]}`}
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
