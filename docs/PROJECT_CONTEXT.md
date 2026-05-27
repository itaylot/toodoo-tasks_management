# Student Task Tracker — Project Context

## Product Goal
This is a Hebrew RTL student task tracker app for managing university courses, tasks, deadlines, and statuses.

## Tech Stack
- **Next.js 14.2.5** with App Router
- **TypeScript 5.6.2** with strict mode
- **Tailwind CSS 3.4.4** with RTL support
- **Prisma 5.9.0** with SQLite database (./dev.db)
- **Local development**: VSCode on Windows with Node.js LTS v24.16.0

## Language and Terminology Rules
- **UI must be fully in Hebrew** with RTL layout (html dir="rtl")
- **Code identifiers, file names, model names, and enum-like technical values must be in English**
- Use **"קורסים"** (courses) - not "מקצועות" (subjects) for task management UI
- Use **"משימות"** (general tasks) - not "מטלות" or "עבודות הגשה" unless referring to submitted assignments
- Use **"דדליין"** (deadline)
- Do **not** use "מקצועות" in the UI

## Current Data Model

### Models

#### Course
```
id        String (cuid, primary key)
name      String (required)
code      String (optional course code)
color     String (hex color for UI display)
createdAt DateTime (default: now)
tasks     Task[] (one-to-many relationship)
```

#### Task
```
id          String (cuid, primary key)
title       String (required)
description String (optional)
deadline    DateTime (required)
status      String (default: "NOT_STARTED")
priority    String (default: "MEDIUM")
courseId    String (foreign key to Course, onDelete: Cascade)
course      Course (relation)
createdAt   DateTime (default: now)
updatedAt   DateTime (auto-updated)
```

### Data Type Notes
- **Task.status** is stored as String (not Prisma enum due to SQLite limitations)
- **Task.priority** is stored as String (not Prisma enum due to SQLite limitations)
- **Accepted status values**: `NOT_STARTED`, `IN_PROGRESS`, `DONE`, `BLOCKED`
- **Accepted priority values**: `LOW`, `MEDIUM`, `HIGH`
- **Cascade delete**: Deleting a Course automatically deletes all related Tasks

### Key Features of Data Model
- One Course has many Tasks (one-to-many relationship)
- Each Task belongs to exactly one Course
- Cascade delete is enabled: `onDelete: Cascade` on the Task-Course relation
- Status and priority are handled as English String values in the database
- Hebrew translations are provided in `src/lib/taskHelpers.ts`

## Existing Features

The app currently has the following routes and functionality:

### / — Home Page
- Header: "מערכת משימות לסטודנטים" (Student Task Tracker)
- Hero text and navigation buttons to Courses and Tasks
- Information card: "מודל משימה" (Task Model) - lists task fields
- Information card: "שלבים הבאים" (Next Steps) - lists planned features
- Placeholder section: "דדליינים מתקרבים" (Upcoming Deadlines) - text only, no real data yet

### /courses — Course Management
- **Add Course**: Form with fields:
  - שם הקורס (Course Name) - required
  - קוד קורס (Course Code) - optional
  - צבע קורס (Course Color) - color picker, default #2563eb
- **Course List**: Display with:
  - Color dot indicator
  - Course name and code
  - Task count badge
  - Delete button
- **Delete Course**:
  - No confirmation for courses with 0 tasks
  - Hebrew confirmation dialog when course has tasks:
    - "לקורס הזה יש X משימות משויכות. מחיקת הקורס תמחק גם את המשימות שלו. האם אתה בטוח?"
  - Cascade delete removes all related tasks
- **Navigation**: Links to home page and tasks page

### /tasks — Task Management
- **Add Task**: Form with fields:
  - שם המשימה (Task Title) - required
  - תיאור (Description) - optional
  - קורס (Course) - required dropdown
  - דדליין (Deadline) - required datetime
  - סטטוס (Status) - dropdown with Hebrew labels
  - עדיפות (Priority) - dropdown with Hebrew labels
- **Task List**: Display with:
  - Title and description
  - Course name
  - Deadline (formatted in Hebrew: "14 מאי 2026 בשעה 15:30")
  - Status badge (blue)
  - Priority badge (purple)
  - Status quick-update dropdown (auto-submits)
  - Delete button
- **Empty States**:
  - "כדי ליצור משימה צריך קודם להוסיף קורס" (need to add course first)
  - "עדיין אין משימות" (no tasks yet)
- **Navigation**: Links to home page and courses page

## Product Rules

### Course Management Rules
- A course without tasks can be deleted immediately without confirmation
- A course with tasks requires Hebrew confirmation dialog before deletion
- The confirmation dialog must explain that deleting the course will delete its tasks
- Task count must be displayed on the course list

### Task Management Rules
- Every task must belong to exactly one course
- Task status and priority must use English storage values (NOT_STARTED, IN_PROGRESS, DONE, BLOCKED, LOW, MEDIUM, HIGH)
- Hebrew labels are provided by `taskHelpers.ts`
- Task deadline is required and displayed in Hebrew format with date and time
- Task status can be updated inline via dropdown without page reload

### Dashboard Rules
- The main dashboard (/) should later include a real upcoming deadlines card
- Show tasks with deadline within next N days, sorted by deadline
- Do **not** build a full dashboard yet unless explicitly requested
- Work step by step and avoid over-engineering

## Known Future Features

These features are planned but not yet implemented:

1. **Real Upcoming Deadlines Dashboard** — Replace placeholder with:
   - Query tasks where deadline < now + 7 days
   - Display in sorted order by deadline
   - Link to individual tasks

2. **Filtering and Search**:
   - Filter tasks by course
   - Filter tasks by status
   - Filter tasks by priority
   - Filter tasks by deadline range
   - Search tasks by title or description

3. **Task Editing**:
   - Route: /tasks/[id]/edit or modal
   - Allow editing all task fields after creation
   - Server action: prisma.task.update

4. **Course Editing**:
   - Allow updating course name, code, color after creation
   - Server action: prisma.course.update

5. **Better Empty States**:
   - Contextual empty state messages
   - Call-to-action buttons

6. **Advanced Dashboard Features** (future):
   - Statistics: task counts, completion rates
   - Visual indicators for overdue tasks
   - Charts/graphs for completion trends

7. **Possibly Later**:
   - Subtasks
   - Study/exam mode
   - Task attachments
   - Collaboration features

## Project Structure

```
c:\Users\itayl\OneDrive\Desktop\VIBE_CODING\
├── src/
│   ├── app/
│   │   ├── page.tsx                 (Home page)
│   │   ├── layout.tsx               (Root layout, RTL setup)
│   │   ├── globals.css              (Global styles)
│   │   ├── courses/
│   │   │   └── page.tsx             (Course management)
│   │   └── tasks/
│   │       └── page.tsx             (Task management)
│   └── lib/
│       ├── prisma.ts                (Singleton Prisma client)
│       └── taskHelpers.ts           (Status/priority mappings, date formatting)
├── prisma/
│   └── schema.prisma                (Data models and relations)
├── docs/
│   └── PROJECT_CONTEXT.md           (This file)
├── package.json                     (Dependencies and scripts)
├── tsconfig.json                    (TypeScript config)
├── tailwind.config.ts               (Tailwind config)
├── postcss.config.js                (PostCSS config, ESM format)
├── next.config.ts                   (Next.js config)
└── dev.db                           (SQLite database, auto-created)
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint

# Generate Prisma client
npm run prisma:generate

# Sync database with schema
npm run prisma:push
```

## Key Implementation Details

### Server Actions Pattern
All data mutations use Next.js Server Actions:
```typescript
async function actionName(formData: FormData) {
  'use server';
  // Extract and validate
  // Use prisma.* methods
  // revalidatePath() to refresh UI
}
```

### Status and Priority Handling
- Database: Stored as English strings (NOT_STARTED, IN_PROGRESS, etc.)
- Display: Translated via `taskHelpers.ts` mappings
- Forms: Select dropdowns only allow valid values via HTML options

### Cascade Delete Implementation
- Prisma schema: `onDelete: Cascade` on Task-Course relation
- Confirmation: JavaScript `window.confirm()` only shows when taskCount > 0
- Database: SQLite cascade automatically deletes related tasks

### Hebrew and RTL Support
- HTML: `lang="he" dir="rtl"`
- CSS: `body { direction: rtl }`
- Date formatting: Custom `formatDeadlineHebrew()` function with Hebrew month names
- All UI text is Hebrew; code identifiers remain English

## Important Notes for Continuation

- **Do not heavily refactor** existing code unless fixing bugs
- **Keep Hebrew UI and English code identifiers** separate
- **Always validate task status and priority** values server-side before database operations
- **Respect cascade delete** — it handles cleanup automatically
- **Use revalidatePath()** after every mutation to refresh UI
- **Keep task helpers centralized** — all mappings should be in `taskHelpers.ts`
- **Test forms** with empty courses/tasks edge cases
- **Plan features step by step** — avoid over-engineering

