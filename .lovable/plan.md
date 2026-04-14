

## Plan: Centralize Content for Large Monitors

### Problem
On large monitors, all page content is left-aligned with empty space on the right side. Pages use `max-w-6xl` or `max-w-7xl` but lack `mx-auto` to center them.

### Solution
Two changes:

**1. AppLayout.tsx — Center the main content area**
Add `mx-auto` and a consistent `max-w` to the `<main>` element so all page content is centered on wide screens.

**2. All page root containers — Add `mx-auto`**
Every page that has a `max-w-*` class needs `mx-auto` added. This affects ~17 files:
- `MentorDashboard.tsx` (max-w-[1600px])
- `MentorStudents.tsx` (max-w-7xl)
- `MentorFinancial.tsx`, `MentorAI.tsx`, `MentorSales.tsx`, `MentorProducts.tsx`, `MentorContent.tsx`, `MentorCheckout.tsx`, `MentorReports.tsx`, `MentorGamification.tsx`, `MentorStudentProfile.tsx`, `MentorSettings.tsx` (max-w-5xl/6xl)
- Student pages: `StudentHome.tsx`, `MyCourses.tsx`, `Evolution.tsx`, `Ranking.tsx`, `Achievements.tsx`, `CheckoutPage.tsx`

Each page's root `<div>` gets `mx-auto` appended (e.g., `max-w-6xl` → `max-w-6xl mx-auto`). Pages with smaller max-widths like `max-w-5xl` will be bumped to `max-w-6xl` for consistency where appropriate.

### What does NOT change
- No colors, names, logic, or functionality
- No structural changes — just adding centering

