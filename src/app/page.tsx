export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Student task tracker</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Manage assignments, deadlines, and courses in one place.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Start with courses and tasks, then add filtering by status, priority, and due date.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Task model</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>Title</li>
              <li>Optional description</li>
              <li>Deadline</li>
              <li>Status</li>
              <li>Priority</li>
              <li>Related course</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>Wire Prisma with SQLite</li>
              <li>Build course and task CRUD flows</li>
              <li>Render tasks grouped by course</li>
              <li>Support status and priority filters</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
