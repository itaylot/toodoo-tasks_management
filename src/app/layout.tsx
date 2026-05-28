import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'מערכת ניהול משימות לסטודנט',
  description: 'נהל משימות לפי קורס עם דדליינים, סטטוס ועדיפות.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <header className="border-b border-slate-200 bg-white shadow-sm">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-semibold text-slate-900">
              משימות
            </Link>
            <div className="flex gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                דף הבית
              </Link>
              <Link
                href="/courses"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                קורסים
              </Link>
              <Link
                href="/tasks"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                משימות
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
