# Password Manager — Tickets / Backlog

> Work breakdown for the password manager web app (**Angular 20 · Tailwind · Angular Material · Firebase**).
> Companion to [`password-manager-plan.md`](./password-manager-plan.md).
> **Authentication is email/password only — no social / OAuth login.**

**Legend** — Priority: 🔴 High · 🟡 Medium · 🟢 Low · Type: `setup` `feature` `chore`

| Epic | Tickets |
| --- | --- |
| A. Project Setup & Infrastructure | PM-1 → PM-4 |
| B. Authentication | PM-5 → PM-9 |
| C. Password Management (CRUD) | PM-10 → PM-15 |
| D. UX & Polish | PM-16 → PM-18 |
| E. Deployment (optional) | PM-19 |

---

## Epic A — Project Setup & Infrastructure

### PM-1 · Scaffold Angular 20 project
**Type:** `setup` · **Priority:** 🔴 High · **Depends on:** —

**Description**
Create the base Angular 20 application using standalone components (no `NgModule`) and
routing, and confirm it builds and serves.

**Acceptance criteria**
- [ ] App generated with `ng new` using **standalone** architecture and routing enabled.
- [ ] `ng serve` runs with no errors and shows the default page.
- [ ] `ng build` completes successfully.
- [ ] Repo committed with a sensible `.gitignore` (node_modules, environments secrets, etc.).

---

### PM-2 · Configure Tailwind CSS
**Type:** `setup` · **Priority:** 🔴 High · **Depends on:** PM-1

**Description**
Install and wire Tailwind CSS so utility classes are available across the app.

**Acceptance criteria**
- [ ] `tailwindcss`, `postcss`, `autoprefixer` installed and config files generated.
- [ ] `content` in `tailwind.config.js` covers `./src/**/*.{html,ts}`.
- [ ] Tailwind directives (`@tailwind base/components/utilities`) added to `styles.css`.
- [ ] A test utility class (e.g., `text-red-500`) visibly renders in the app.

---

### PM-3 · Add Angular Material + coexist with Tailwind
**Type:** `setup` · **Priority:** 🔴 High · **Depends on:** PM-1, PM-2

**Description**
Add Angular Material with a theme and animations, and resolve any base-style
conflicts between Material and Tailwind's preflight.

**Acceptance criteria**
- [ ] `ng add @angular/material` completed with a theme selected.
- [ ] Animations provider (`provideAnimationsAsync`) registered.
- [ ] A sample `mat-button` and `mat-form-field` render correctly.
- [ ] No visible style clash between Tailwind reset and Material components
      (preflight scoped/disabled if needed).

---

### PM-4 · Firebase project & app wiring
**Type:** `setup` · **Priority:** 🔴 High · **Depends on:** PM-1

**Description**
Create the Firebase project, enable Email/Password auth and Firestore, and connect
the app via `@angular/fire`.

**Acceptance criteria**
- [ ] Firebase project created; **Email/Password** sign-in method enabled.
- [ ] Cloud Firestore database created.
- [ ] Firebase web config placed in `src/environments/environment.ts` (and prod).
- [ ] `provideFirebaseApp`, `provideAuth`, `provideFirestore` registered in `app.config.ts`.
- [ ] App boots with an active Firebase connection (no init errors in console).

---

## Epic B — Authentication

### PM-5 · AuthService
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-4

**Description**
Create an injectable `AuthService` wrapping Firebase Auth for register, login, logout,
and exposing the current user.

**Acceptance criteria**
- [ ] `register(email, password)`, `login(email, password)`, `logout()` implemented.
- [ ] Current user exposed as a signal/observable (`null` when signed out).
- [ ] Firebase auth errors are surfaced (returned/thrown) for the UI to handle.

---

### PM-6 · Register screen
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-5

**Description**
A registration page where a new user creates an account with email and password.

**Acceptance criteria**
- [ ] Reactive form with `email` (required, valid email) and `password` (required, min 6).
- [ ] Submit disabled while the form is invalid or a request is in flight.
- [ ] On success, the user is signed in and redirected to `/passwords`.
- [ ] Duplicate email / weak password errors are shown to the user (inline or snackbar).
- [ ] Link to navigate to the Login screen.
- [ ] **No social login buttons present.**

---

### PM-7 · Login screen
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-5

**Description**
A login page where an existing user signs in with email and password.

**Acceptance criteria**
- [ ] Reactive form with `email` (required, valid email) and `password` (required).
- [ ] Submit disabled while the form is invalid or a request is in flight.
- [ ] On success, redirect to `/passwords`.
- [ ] Invalid credentials show a clear error message.
- [ ] Link to navigate to the Register screen.
- [ ] **No social login buttons present.**

---

### PM-8 · Logout
**Type:** `feature` · **Priority:** 🟡 Medium · **Depends on:** PM-5

**Description**
Allow a signed-in user to log out from the app shell (e.g., toolbar menu).

**Acceptance criteria**
- [ ] Logout control visible only when a user is signed in.
- [ ] Clicking it signs the user out and redirects to `/login`.
- [ ] After logout, protected routes are no longer accessible.

---

### PM-9 · Route guard for protected pages
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-5

**Description**
A functional `authGuard` protecting authenticated routes and redirecting unauthenticated
users to login.

**Acceptance criteria**
- [ ] `authGuard` (`CanActivateFn`) implemented using auth state.
- [ ] `/passwords` is guarded; unauthenticated access redirects to `/login`.
- [ ] Signed-in users can reach `/passwords` directly.
- [ ] Guard resolves once (no hanging subscription) per navigation.

---

## Epic C — Password Management (CRUD)

### PM-10 · PasswordEntry model & PasswordService
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-4

**Description**
Define the `PasswordEntry` model and a `PasswordService` that performs CRUD against the
per-user Firestore subcollection `users/{uid}/passwords`.

**Acceptance criteria**
- [ ] `PasswordEntry` interface: `web`, `password` (required), `email?`, `username?`,
      `createdAt`, `updatedAt`.
- [ ] Service methods: `list()`, `create()`, `update(id)`, `delete(id)`.
- [ ] All operations target the current user's subcollection only.
- [ ] `createdAt` / `updatedAt` set via server timestamp.

---

### PM-11 · Firestore security rules
**Type:** `chore` · **Priority:** 🔴 High · **Depends on:** PM-4

**Description**
Author and deploy Firestore rules so each user can only access their own entries.

**Acceptance criteria**
- [ ] Rules restrict read/write on `users/{uid}/passwords/**` to `request.auth.uid == uid`.
- [ ] Unauthenticated requests are denied.
- [ ] A user cannot read or write another user's entries (verified manually).
- [ ] Rules deployed to the Firebase project.

---

### PM-12 · Password list (Read)
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-9, PM-10

**Description**
The main authenticated screen listing the signed-in user's password entries.

**Acceptance criteria**
- [ ] Entries load from `PasswordService.list()` for the current user only.
- [ ] Each item shows `web`, `username`/`email`, and a masked password by default.
- [ ] List updates reactively after create/update/delete.
- [ ] Loading state shown while fetching; empty state shown when there are no entries.
- [ ] "Add" action visible to open the create form.

---

### PM-13 · Create password entry
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-12

**Description**
A form (dialog) to add a new password entry.

**Acceptance criteria**
- [ ] Fields: `web` (**required**), `password` (**required**), `email` (optional, valid
      if provided), `username` (optional).
- [ ] Save disabled until `web` and `password` are both filled.
- [ ] On save, the entry is written to Firestore and appears in the list.
- [ ] Success feedback (snackbar); errors surfaced to the user.
- [ ] Cancel closes the form without writing anything.

---

### PM-14 · Edit password entry
**Type:** `feature` · **Priority:** 🔴 High · **Depends on:** PM-13

**Description**
Edit an existing entry, reusing the create form pre-filled with current values.

**Acceptance criteria**
- [ ] Opening edit pre-fills the form with the entry's data.
- [ ] Same validation as create (`web` + `password` required).
- [ ] On save, the document is updated and the list reflects the change.
- [ ] `updatedAt` is refreshed on save.
- [ ] Cancel discards changes.

---

### PM-15 · Delete password entry
**Type:** `feature` · **Priority:** 🟡 Medium · **Depends on:** PM-12

**Description**
Delete an entry with a confirmation step to prevent accidental removal.

**Acceptance criteria**
- [ ] Delete action available per entry.
- [ ] A confirmation dialog appears before deletion.
- [ ] Confirming removes the document from Firestore and the list.
- [ ] Cancelling leaves the entry untouched.
- [ ] Success feedback shown after deletion.

---

## Epic D — UX & Polish

### PM-16 · Reveal & copy password
**Type:** `feature` · **Priority:** 🟢 Low · **Depends on:** PM-12

**Description**
Let the user toggle password visibility and copy a password to the clipboard.

**Acceptance criteria**
- [ ] Passwords are masked by default with a show/hide toggle per entry (or in edit).
- [ ] A "copy" action copies the password to the clipboard.
- [ ] Copy confirmation feedback shown (e.g., snackbar "Copied").

---

### PM-17 · Global feedback & error handling
**Type:** `chore` · **Priority:** 🟡 Medium · **Depends on:** PM-6, PM-7, PM-13

**Description**
Consistent user feedback for success and failure across auth and CRUD flows.

**Acceptance criteria**
- [ ] `MatSnackBar` used for success/error notifications app-wide.
- [ ] Firebase errors mapped to friendly messages (no raw error codes shown).
- [ ] Async actions show a busy/disabled state while in flight.

---

### PM-18 · App shell & responsive layout
**Type:** `feature` · **Priority:** 🟡 Medium · **Depends on:** PM-3, PM-8

**Description**
A consistent shell (toolbar with app title and, when signed in, the logout control) and
a responsive layout that works on mobile and desktop.

**Acceptance criteria**
- [ ] Toolbar present on authenticated pages; shows logout when signed in.
- [ ] Layout is responsive (usable on small and large screens).
- [ ] Auth screens are centered and readable on mobile.

---

## Epic E — Deployment (optional)

### PM-19 · Deploy to Firebase Hosting
**Type:** `chore` · **Priority:** 🟢 Low · **Depends on:** all core tickets

**Description**
Build the production bundle and deploy the app to Firebase Hosting.

**Acceptance criteria**
- [ ] `ng build` (production) completes without errors.
- [ ] Firebase Hosting configured for the app output directory.
- [ ] App deployed and reachable at the hosting URL.
- [ ] Register → login → CRUD flow works end-to-end on the deployed site.

---

_Note: Unit tests are intentionally excluded from this backlog per project requirements._
_Last updated: 2026-07-17_
