import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">מערכת משימות לסטודנטים</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            נהל מטלות, מועדים וקורסים במקום אחד.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            התחל בקורסים ומשימות ולאחר מכן הוסף סינון לפי סטטוס, עדיפות ותאריך יעד.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/courses" className="inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              קורסים
            </Link>
            <Link href="/tasks" className="inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              משימות
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">מודל משימה</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>כותרת</li>
              <li>תיאור אופציונלי</li>
              <li>דדליין</li>
              <li>סטטוס</li>
              <li>עדיפות</li>
              <li>קורס קשור</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-900">שלבים הבאים</h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              <li>הצג דדליינים מתקרבים בעמוד הבית</li>
              <li>הוסף יכולת עריכת קורס ומשימה</li>
              <li>הצג משימות מקובצות לפי קורס</li>
              <li>תמוך בסינון לפי סטטוס, עדיפות וקורס</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold text-slate-900">דדליינים מתקרבים</h2>
          <p className="mt-4 text-slate-600">כאן יוצגו בקרוב המשימות עם הדדליינים הקרובים ביותר.</p>
        </div>
      </section>
    </main>
  );
}
