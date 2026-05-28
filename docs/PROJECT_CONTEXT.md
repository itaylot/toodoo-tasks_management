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
dueDate     DateTime (optional, mapped to existing SQLite column "deadline")
status      String (default: "TODO")
priority    String (default: "MEDIUM")
courseId    String (optional foreign key to Course, onDelete: Cascade)
course      Course? (optional relation)
createdAt   DateTime (default: now)
updatedAt   DateTime (auto-updated)
```

### Data Type Notes
- **Task.status** is stored as String (not Prisma enum due to SQLite limitations)
- **Task.priority** is stored as String (not Prisma enum due to SQLite limitations)
- **Accepted status values**: `TODO`, `IN_PROGRESS`, `COMPLETED`
- **Accepted priority values**: `LOW`, `MEDIUM`, `HIGH`
- **Course delete behavior**: Deleting a Course deletes tasks assigned to that Course. Standalone tasks with no course are unaffected.

### Key Features of Data Model
- One Course has many Tasks (one-to-many relationship)
- Each Task can belong to a Course, but the relation is optional for MVP flexibility
- Cascade delete is enabled: `onDelete: Cascade` on the Task-Course relation for assigned tasks
- Status and priority are handled as English String values in the database
- Hebrew translations are provided in `src/lib/taskHelpers.ts`

## Existing Features

The app currently has the following routes and functionality:

### / — Home Page
- Global header with navigation links (דף הבית, קורסים, משימות)
- Hero section: "נהל משימות, דדליינים וקורסים במקום אחד"
- User-facing feature cards:
  - "קורסים" — ניהול הקורסים שלך
  - "משימות" — מעקב אחרי משימות, סטטוס, עדיפות ודדליינים
- Placeholder section: "דדליינים מתקרבים" (Upcoming Deadlines) - text only, no real data yet

### Global Navigation
- Simple header with links to all main pages
- Available on all routes (implemented in src/app/layout.tsx)

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
- **Delete Course** (uses Client Component: DeleteCourseForm):
  - No confirmation for courses with 0 tasks (deletes immediately)
  - Hebrew confirmation dialog when course has tasks:
    - "מחיקת הקורס תמחק גם את כל המשימות שמשויכות אליו. הפעולה הזו לא ניתנת לביטול."
  - User can cancel or confirm deletion
  - Related tasks assigned to the course are deleted
- **Navigation**: Links to home page and tasks page

### /tasks — Task Management
- **Add Task**: Form with fields:
  - שם המשימה (Task Title) - required
  - תיאור (Description) - optional
  - קורס (Course) - required dropdown
  - דדליין (Deadline) - optional datetime
  - סטטוס (Status) - dropdown with Hebrew labels
  - עדיפות (Priority) - dropdown with Hebrew labels
- **Task List**: Display with:
  - Title and description
  - Course name
  - Deadline (formatted in Hebrew: "14 מאי 2026 בשעה 15:30")
  - Status badge (blue)
  - Priority badge (color-coded: green for LOW, amber for MEDIUM, orange for HIGH)
  - Status quick-update dropdown (auto-submits via UpdateTaskStatusForm Client Component)
  - Delete button
- **Empty States**:
  - "עדיין אין משימות" (no tasks yet)
- **Navigation**: Links to home page and courses page

## Product Rules

### Course Management Rules
- A course without tasks can be deleted immediately without confirmation
- A course with tasks requires Hebrew confirmation dialog before deletion
- The confirmation dialog must explain that deleting the course will also delete tasks assigned to it
- Task count must be displayed on the course list

### Task Management Rules
- A task may belong to a course, but course selection is optional for MVP flexibility
- Task status and priority must use English storage values (TODO, IN_PROGRESS, COMPLETED, LOW, MEDIUM, HIGH)
- Hebrew labels are provided by `taskHelpers.ts`
- Task due date / deadline is optional and displayed in Hebrew format when present
- Task status can be updated inline via dropdown without page reload

### Dashboard Rules
- The main dashboard (/) should later include a real upcoming deadlines card
- Show tasks with deadline within next N days, sorted by deadline
- Do **not** build a full dashboard yet unless explicitly requested
- Work step by step and avoid over-engineering

### Dashboard Motivational Quote Bank

The dashboard should later include a small motivational quote card.

Initial behavior:
- Use a static bank/list of real motivational quotes.
- Each quote should be attributed to a real person.
- Display format should be something like: `"Quote text" — Person Name`
- The quote should change on each page refresh.
- Random-on-refresh is preferred over daily quote for the first version.

Important quote quality rules:
- Prefer real, verified quotes from real people.
- Avoid fake or commonly misattributed quotes.
- Avoid cheesy, overly dramatic, or generic AI-sounding motivational lines.
- Keep quotes short enough to work nicely inside a dashboard card.
- The tone should be encouraging, focused, student-friendly, and warm.
- The quotes should fit the calm forest/student productivity vibe.

Possible future data structure:
- `text`
- `author`
- optional `source`
- optional `category`
- optional `verified` boolean

Possible categories for later:
- starting a task
- dealing with deadline pressure
- consistency
- focus
- exams
- feeling stuck
- progress

Visual direction:
- The quote card can later include a small fine-line illustration.
- Illustration style should be minimal, calm, and elegant.
- Possible fine-line illustration themes:
  - small tree
  - notebook
  - coffee cup
  - study desk
  - forest path
  - leaf / branch
- The illustration should match the forest-inspired color palette.
- Avoid childish, cartoonish, or overly decorative visuals.

Do not implement yet:
- the quote card
- the quote bank
- randomization
- illustrations
- dashboard changes

## UX Vision

The app should feel like a personal student dashboard, not like disconnected CRUD pages.

The user should immediately understand:
- what needs attention now
- what is urgent
- which deadlines are approaching
- which courses they are taking
- where to go next

The dashboard should be the center of the app experience.

## Main User Flow

1. User opens the app.
2. User lands on their personal dashboard.
3. The dashboard shows a quick overview:
   - top urgent tasks
   - upcoming deadlines
   - active courses
   - motivational quote card
   - future academic progress widgets
4. User can click a course card.
5. User lands on a course-specific view.
6. The course-specific view shows all tasks for that course.
7. User can add a task, update status, or mark a task as done.
8. User can return to the dashboard or view all tasks.

The flow should reduce cognitive load by showing the most actionable information first.

## Information Architecture

The app should have 3-4 main navigation anchors.

Recommended current anchors:
- Dashboard / דשבורד
- Courses / קורסים
- Tasks / משימות

Future fourth anchor:
- More / עוד
- or Profile / פרופיל

Future "More" area can include:
- settings
- academic record / degree progress
- average simulations
- account/authentication features

For mobile:
- Consider bottom navigation later.
- Keep navigation touch-friendly.
- Avoid hover-only interactions.

For desktop:
- A simple top header is enough for now.
- A sidebar may be considered later if the app grows.

## Dashboard Layout / Wireframe

Intended hierarchy:

1. Global navigation/header

2. Greeting / overview card
   - Example: "שלום, איתי 🌿"
   - Example: "הנה מה שדורש את תשומת הלב שלך עכשיו"

3. Primary card: Top urgent tasks
   - Shows top 3 or top 5 urgent tasks
   - Should be visually prominent
   - Should answer: "What should I focus on now?"

4. Secondary cards:
   - Upcoming deadlines
   - Motivational quote card

5. Course overview section:
   - Title: "הקורסים שלי"
   - Shows course cards
   - Each course card may include:
     - course name
     - course color
     - number of open tasks
     - nearest deadline in that course
     - optional progress indicator later
   - Clicking a course should lead to a course-specific task list.

6. Future academic progress section:
   - completed credits
   - weighted average
   - simulations
   - not implemented now

## Urgent Tasks UX

The urgent tasks widget should not be just another list.
It should be the primary action area of the dashboard.

Initial version:
- top 3 or top 5 tasks
- based on deadline proximity and manual priority

Future version:
- also consider estimated task size / effort
- task status
- smarter urgency score

Product rule:
A large task due in a week can be more urgent than a tiny task due in three days.

Do not implement this algorithm now. Only document it.

## Course Card UX

Course cards should be actionable, not just labels.

Each course card should eventually show:
- course name
- open task count
- nearest deadline
- color badge
- click target to course-specific page

Course cards should help the user understand where their workload is concentrated.

## UX Recommendations

1. Use quick actions
   - Examples:
     - "+ משימה חדשה"
     - "+ קורס חדש"
     - "סמן כהושלם"
     - "עדכן סטטוס"

2. Use visual hierarchy
   - urgent tasks should appear before course browsing
   - completed tasks should be visually calmer
   - priority badges should be color-coded
   - deadlines should be easy to scan

3. Keep the app mobile-friendly
   - large tap targets
   - no hover-only controls
   - cards should stack naturally on small screens
   - forms should be simple on iPhone/iPad

4. Avoid showing developer-facing content in the UI
   - Do not show sections like:
     - "מודל משימה"
     - "שלבים הבאים"
   - These belong in documentation, not in the product UI.

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

## Complete Continuation Guide

This section is the current handoff source for future work. It describes the current app, architectural constraints, product direction, roadmap decisions, and what should not be implemented yet.

### Current Project Status

Existing routes:
- `/` - home page / current dashboard placeholder
- `/courses` - course management
- `/tasks` - task management

Existing functionality:
- Hebrew global navigation
- Course management
- Add courses
- Delete courses
- Deleting a course with related tasks requires a Hebrew confirmation dialog
- Deleting a confirmed course deletes tasks assigned to that course
- Task management
- Add tasks
- Delete tasks
- Update task status inline
- Task priority badges and priority color coding
- Home page currently has a placeholder for upcoming deadlines

Recent technical state:
- The app built successfully recently with `npm run build` after fixing the task page JSX syntax issue.
- Manual QA is still recommended for adding/deleting courses, deleting a course with tasks, adding/deleting tasks, and updating task status.

### Language And Product Terminology Rules

- UI language is Hebrew.
- Layout direction should be RTL.
- Technical names, filenames, model names, and enum-like values stay in English.
- Use "קורסים", not "מקצועות".
- Use "משימות" as the general term.
- Use "דדליין".
- Use "מטלות" or "עבודות הגשה" only when specifically referring to submitted assignments.
- The product should feel like an intuitive student dashboard, not a technical CRUD demo.

### Server Components / Client Components Rule

- Pages can stay as Server Components when they fetch data with Prisma.
- Do not put browser event handlers such as `onClick` or `onChange` directly inside Server Components.
- Browser interactions should be isolated into small Client Components.
- Database mutations should remain server-side.
- Existing important Client Components:
  - `src/components/DeleteCourseForm.tsx`
  - `src/components/UpdateTaskStatusForm.tsx`
- This rule is important because previous runtime crashes were caused by event handlers inside Server Components.

### Current Git / File Awareness

- `src/components/` is important and should not be ignored; it contains the Client Components that fixed runtime crashes.
- `.next-dev-server*.log` files are likely temporary local development logs and should probably not be committed.
- `prisma/dev.db` is the local SQLite development database and should be treated carefully as local development state.

### Product Vision

The app should evolve into a personal student dashboard.

Desired user flow:
- User enters their personal dashboard.
- The dashboard immediately shows:
  - most urgent tasks
  - upcoming deadlines
  - list of the user's courses
  - future motivational quote card
  - future academic progress / GPA module
- Clicking a course should lead to a specific course page showing all tasks for that course.
- `/courses` and `/tasks` should become deeper management pages, while the dashboard is the center of the experience.

### Desired Future Route Structure

Planned direction only; do not implement these routes until explicitly requested.

- `/` or `/dashboard`
  - central dashboard
  - urgent tasks
  - upcoming deadlines
  - course cards
  - future quote card
  - future academic progress
- `/courses`
  - course management
- `/courses/[courseId]`
  - specific course page
  - all tasks for that course
  - course information
  - nearest deadline for the course
  - urgent tasks for the course
- `/tasks`
  - all tasks
  - future filtering/sorting by course, status, priority, and deadline
- future `/academic-record`
  - completed courses
  - credits / נק"ז
  - grades
  - weighted average
  - simulations

### Dashboard UX Direction

- The dashboard is the main product experience.
- At the top, the user should see what requires attention now.
- Urgent tasks should be visually more important than the courses list.
- Course cards should be actionable and include useful information:
  - course name
  - course color
  - number of open tasks
  - nearest deadline
  - link to the course page in the future
- Avoid UI text that sounds like developer notes, such as:
  - "מודל משימה"
  - "שלבים הבאים"
- Developer-facing planning text belongs in documentation, not in the product UI.

### Design Direction

The visual direction should use a calm forest-inspired palette:
- sage green
- eucalyptus green
- forest green
- deep green
- bark brown
- earth brown
- clay / terracotta
- sand / beige

The feeling should be:
- calm
- natural
- student-focused
- pleasant for studying
- not noisy
- not childish
- not neon
- not overly "traffic light"

Priority colors:
- `HIGH` / גבוהה: muted red, clay, terracotta, earth-red
- `MEDIUM` / בינונית: muted orange/yellow, sand, ochre, amber
- `LOW` / נמוכה: calm green, sage, forest green

### Mobile / iPhone / iPad Direction

- Near-term direction is a responsive web app / PWA-friendly web app.
- Do not move to React Native or native iOS now.
- A future App Store version is possible, but not relevant now.
- UI should be mobile-friendly and touch-friendly.
- Avoid hover-only interactions.
- Forms should be comfortable on iPhone/iPad.
- Future mobile UX may include bottom navigation, but not now.

### Future Task Size / Estimated Effort Field

Future only; do not implement now.

Future task creation may include estimated task size / effort.

Possible technical values:
- `SMALL` = קטנה
- `MEDIUM` = בינונית
- `LARGE` = גדולה

Possible Hebrew labels:
- "גודל משימה"
- "מאמץ משוער"

### Future Smart Urgency Engine

Future only; do not implement now.

Urgency should eventually consider:
- deadline proximity
- estimated task size / effort
- manual priority
- status

Important product idea:
- A large task due in a week may be more urgent than a tiny task due in three days.

For Dashboard v1, keep it simple:
- nearest deadline
- manual priority

Do not implement the full algorithm now.

### Future Academic Record / Weighted Average Module

Future only; do not implement now.

The app may include a module for completed courses:
- course name
- optional course code
- credits / נק"ז
- final grade
- weighted average
- total credits

Formula:
- weighted average = `sum(grade * credits) / sum(credits)`

Future simulations:
- remove a course from the weighted average
- add a future grade
- calculate what grade is needed to reach a target average

Do not implement this module now.

### Future Private Users / Authentication

Future only; do not implement now.

Long-term goal:
- each user has a private workspace
- likely Google sign-in
- possible Auth.js / NextAuth with Google Provider

Future models may need `userId` on:
- courses
- tasks
- academic records
- simulations

Do not implement authentication now.
Do not change the Prisma schema for users now.

### Future Motivational Quote Card

Future only; do not implement now.

The dashboard may include a small motivational quote card.

First version:
- static bank of real quotes
- attributed to real people
- format: `"Quote text" — Person Name`
- quote changes on refresh

Tone:
- encouraging
- short
- warm
- student-friendly
- calm forest/productivity vibe
- not cheesy
- not dramatic

Avoid fake or wrongly attributed quotes.

Possible future small fine-line illustration ideas:
- small tree
- notebook
- coffee
- forest path
- branch
- study desk

Do not implement this now.

### What Not To Do Now

- Do not implement Auth now.
- Do not implement PWA now.
- Do not implement App Store/native app now.
- Do not implement academic average module now.
- Do not implement the full smart urgency engine now.
- Do not implement motivational quotes now.
- Do not do a large refactor without a clear reason.
- Do not significantly change the Prisma schema without explaining why.
- Do not start a large feature before documentation is updated and the app is stable.

### Recommended Next Steps

1. Run or verify quick manual QA of the current app.
2. Then build Dashboard v1:
   - top 3 or top 5 urgent tasks
   - real upcoming deadlines
   - "my courses" cards
3. Then plan `/courses/[courseId]` as the next focused feature.

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
- Database: Stored as English strings (TODO, IN_PROGRESS, COMPLETED, etc.)
- Display: Translated via `taskHelpers.ts` mappings
- Forms: Select dropdowns only allow valid values via HTML options

### Cascade Course Delete Implementation
- Prisma schema: `onDelete: Cascade` on Task-Course relation
- Confirmation: JavaScript `window.confirm()` shows before deleting a course
- Database: Tasks assigned to the deleted course are deleted; standalone tasks with no course are unaffected

### Hebrew and RTL Support
- HTML: `lang="he" dir="rtl"`
- CSS: `body { direction: rtl }`
- Date formatting: Custom `formatDeadlineHebrew()` function with Hebrew month names
- All UI text is Hebrew; code identifiers remain English

## Important Notes for Continuation

- **Do not heavily refactor** existing code unless fixing bugs
- **Keep Hebrew UI and English code identifiers** separate
- **Always validate task status and priority** values server-side before database operations
- **Respect safe course deletion** — deleting a course should not delete task data
- **Use revalidatePath()** after every mutation to refresh UI
- **Keep task helpers centralized** — all mappings should be in `taskHelpers.ts`
- **Test forms** with empty courses/tasks edge cases
- **Plan features step by step** — avoid over-engineering

