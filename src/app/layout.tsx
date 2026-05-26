import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'מערכת ניהול משימות לסטודנט',
  description: 'נהל משימות לפי מקצוע עם תאריכים, סטטוס ועדיפות.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
