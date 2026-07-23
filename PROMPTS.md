# PROMPTS.md — AI Tooling Chat History

This file records every AI-assisted prompt and interaction used while building the **Car Dealership Inventory System** kata. It fulfils the assessment requirement for full, transparent AI usage documentation.

**AI tools used:**
- **Cursor** (Composer / Agent mode) — primary IDE AI
- **ChatGPT** — TDD planning and code review (early sessions)
- **Google Antigravity / Gemini** — project audit, feature implementation, documentation (final sessions)

---

## Git Commits with AI Co-authorship

The following commits were made with AI assistance and include the appropriate `Co-authored-by` trailer:

| Commit | Message | AI Tool |
|--------|---------|---------|
| `747a9f5` | test: add user registration endpoint test | ChatGPT |
| `f43eb47` | feat: add authentication routes and tests | ChatGPT |
| `ef48b57` | refactor: add global error handling and database seeding | ChatGPT |
| `427f6d3` | feat: add admin authorization middleware for protected routes | ChatGPT |
| `77dcc43` | test(auth): add login authentication test coverage | ChatGPT |
| `b2359a7` | test(vehicle): add failing tests for vehicle update scenarios | ChatGPT |
| `b9dd7bf` | feat(vehicle): implement update vehicle API with not-found handling | ChatGPT |
| `dcb6f09` | feat(vehicle): add vehicle deletion controller | ChatGPT |
| `f12579d` | test(vehicle): add failing tests for vehicle search endpoint | ChatGPT |
| `a7068bc` | test(vehicle): add failing tests for vehicle restock endpoint | Cursor |
| `0500ce8` | chore(backend): update application configuration and dependencies | Cursor |
| `bd344a7` | refactor(middleware): improve admin authorization and error handling | Cursor |
| `b57a91d` | feat(auth): improve authentication flow and API endpoints | Cursor |
| `819291a` | feat(vehicle): implement inventory management endpoints and tests | Cursor |
| `ee5c8e8` | feat(auth): implement authentication context and API services | Cursor |
| `b4ec297` | feat(frontend): add application routing and page structure | Cursor |
| `73e9cb0` | chore(frontend): configure Vite, Tailwind CSS, and project setup | Cursor |
| `de549da` | feat(vehicle): add vehicle management UI components and state management | Cursor |
| `d6db225` | feat(frontend): add dashboard routing and global styling | Cursor |
| `1cb8edd` | feat(auth): integrate frontend authentication with backend APIs | Cursor |
| `bf49610` | feat: implement vehicle restock workflow with backend API, dashboard integration, and admin inventory controls | Gemini |

---

## Session 1 — Initial Backend Setup & Auth (ChatGPT)

### Prompt 1.1

**User:**
> I need to build a RESTful API for a Car Dealership Inventory System as a TDD kata. I need user registration and login with JWT, vehicle CRUD, and admin-only routes. Where do I start with TDD?

**AI (ChatGPT) response summary:**
Recommended starting with the health check test, then auth (register → login → protect middleware), then vehicle CRUD in a strict Red → Green → Refactor cycle. Provided the initial Express + Mongoose project scaffold, `asyncHandler` utility, and `AppError` class.

---

### Prompt 1.2

**User:**
> Write me a failing test for user registration before I implement the endpoint.

**AI response summary:**
Generated `tests/auth.test.js` with:
- `POST /api/auth/register` → expect 201, `success: true`, `token` in body
- Duplicate email → expect 400

*→ Commit `48af80c` — test(auth.test): add registration and duplicate email test cases*

---

### Prompt 1.3

**User:**
> Now implement register, login, and getMe endpoints to make those tests pass.

**AI response summary:**
Generated `authController.js` with `register`, `login`, `getMe`. Used `bcryptjs` for password hashing. JWT signed with `process.env.JWT_SECRET`. Response shape: `{ success, token, data: user }`.

*→ Commit `906081a` — feat(authController, authRoutes): implement register, login and getMe endpoints*

---

### Prompt 1.4

**User:**
> Add a global error handler and async handler utility so I don't need try/catch in every controller.

**AI response summary:**
Generated `utils/asyncHandler.js` (wraps async functions, forwards errors to `next`), `utils/AppError.js` (custom error class with `statusCode`), and `middleware/errorMiddleware.js` (sends JSON error response). Also generated `seeder/seedUsers.js`.

*→ Commit `ef48b57` — refactor: add global error handling and database seeding*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 1.5

**User:**
> Add a failing test for login with valid credentials and one for incorrect password before implementing.

**AI response summary:**
Generated failing tests: login success (expect 200, `token` in body), login with wrong password (expect 401). Marked as RED phase.

*→ Commit `77dcc43` — test(auth): add login authentication test coverage*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 1.6

**User:**
> Add an adminOnly middleware that returns 403 if the user is not an admin.

**AI response summary:**
Generated `middleware/adminMiddleware.js` checking `req.user.role === 'admin'`, returning `AppError("Access denied", 403)` otherwise.

*→ Commit `427f6d3` — feat: add admin authorization middleware for protected routes*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

## Session 2 — Vehicle CRUD with TDD (ChatGPT + Cursor)

### Prompt 2.1

**User:**
> Now I need vehicle endpoints following TDD. Write all the failing tests for vehicle update (PUT /:id) first — success, not found.

**AI (ChatGPT) response summary:**
Generated failing tests for:
- Successful update → 200, updated price/quantity in response
- Update non-existent ID → 404

*→ Commit `b2359a7` — test(vehicle): add failing tests for vehicle update scenarios*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 2.2

**User:**
> Now implement the update vehicle controller to make those tests green.

**AI response summary:**
Generated `updateVehicle` using `findByIdAndUpdate` with `{ returnDocument: 'after', runValidators: true }`. Throws `AppError('Vehicle not found', 404)` when vehicle is null.

*→ Commit `b9dd7bf` — feat(vehicle): implement update vehicle API with not-found handling*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 2.3

**User:**
> Write failing tests for DELETE /api/vehicles/:id — admin can delete, non-existent returns 404.

**AI response summary:**
Generated failing tests. Noted test setup needs admin token (promote user to admin via `User.findOneAndUpdate`).

*→ Commit `32d942b` — test(vehicle): add failing tests for vehicle deletion API*

---

### Prompt 2.4

**User:**
> Implement delete vehicle controller. Also review the error handling — is it consistent?

**AI (ChatGPT) response summary:**
Generated `deleteVehicle` using `findById` + `deleteOne()`. Reviewed controller and confirmed error handling is consistent with `AppError` pattern. Suggested wrapping in `asyncHandler`.

*→ Commit `dcb6f09` — feat(vehicle): add vehicle deletion controller*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 2.5

**User:**
> Write failing tests for GET /api/vehicles/search?make=Toyota — found results and empty results.

**AI response summary:**
Generated search tests using `?make=Toyota` and `?make=Ferrari` (empty). Also noted search should support `model`, `category`, `minPrice`, `maxPrice` query params.

*→ Commit `f12579d` — test(vehicle): add failing tests for vehicle search endpoint*
*Co-authored-by: ChatGPT <AI@users.noreply.github.com>*

---

### Prompt 2.6

**User:**
> Write failing tests for POST /:id/purchase — decrease quantity, out-of-stock returns 400, not found returns 404.

**AI response summary:**
Generated 3 failing purchase tests. Recommended creating vehicles inline per test rather than sharing state to avoid test pollution.

*→ Commit `385b3fe` — test(vehicle): add failing tests for vehicle purchase endpoint*

---

### Prompt 2.7

**User:**
> Write failing tests for POST /:id/restock — admin can restock, non-admin gets 403, not found gets 404.

**AI (Cursor) response summary:**
Generated 3 failing restock tests. Noted restock requires `{ quantity }` in request body and should add (not replace) stock.

*→ Commit `a7068bc` — test(vehicle): add failing tests for vehicle restock endpoint*
*Co-authored-by: Cursor <cursor@users.noreply.github.com>*

---

## Session 3 — Frontend Implementation (Cursor Agent)

### Prompt 3.1

**User:**
> Now switch to Agent mode and build the React frontend — Vite + Tailwind CSS. Create the project structure, axiosInstance, auth context, vehicle context, and toast context.

**AI (Cursor) actions:**
- Initialized Vite + React project
- Configured Tailwind CSS
- Created `api/axiosInstance.js` with base URL and JWT interceptor
- Created `AuthContext.jsx`, `VehicleContext.jsx`, `ToastContext.jsx`
- Created `services/authService.js`, `services/vehicleService.js`

*→ Commits `73e9cb0`, `92cee2e`, `ee5c8e8`, `b4ec297`*

---

### Prompt 3.2

**User:**
> Build all the components: Header, LoginForm, RegisterForm, VehicleCard with purchase button (disabled when qty=0), VehicleFormModal, DeleteConfirmModal, SearchFilterBar.

**AI (Cursor) actions:**
Generated all components with Tailwind styling:
- `VehicleCard` with category-color system, stock badges (in-stock / low-stock / out-of-stock), Purchase button (disabled + "Out of Stock" text when qty=0)
- Admin Edit and Delete buttons visible only to admins
- `VehicleFormModal` — controlled form for create/edit
- `DeleteConfirmModal` — confirmation before delete
- `SearchFilterBar` — make, model, category select, min/max price

*→ Commit `de549da` — feat(vehicle): add vehicle management UI components and state management*
*Co-authored-by: Cursor <cursor@users.noreply.github.com>*

---

### Prompt 3.3

**User:**
> Wire up the Dashboard page with all the handlers, stats bar, and hook into auth/vehicle context. Also add routing in App.jsx.

**AI (Cursor) actions:**
Generated `Dashboard.jsx` with stats bar (total, in-stock, out-of-stock, categories), search/clear handlers, purchase/edit/delete handlers with toast feedback, modals for add/edit/delete.

*→ Commits `d6db225`, `1cb8edd`*

---

## Session 4 — Audit & Final Features (Google Antigravity / Gemini)

### Prompt 4.1

**User:**
> Check that according to all requirements the project satisfies the assessment.

**AI (Gemini) response summary:**
Performed a full compliance audit across all kata requirements:
- Identified **PATCH vs PUT mismatch** in tests (critical bug)
- Identified **missing Restock UI** in the frontend
- Identified stale README (5 tests shown vs 19 actual, unchecked feature list, missing screenshots)
- Identified `nodemon` missing from `devDependencies`

---

### Prompt 4.2

**User:**
> Then add the Restock UI.

**AI (Gemini) actions:**
- Added `restockVehicle(id, quantity)` to `VehicleContext.jsx`
- Added `handleRestock` handler and `restockingId` state to `Dashboard.jsx`
- Rewrote `VehicleCard.jsx` admin section: added **Restock** toggle button that expands into an inline quantity stepper (+ / − controls) with Confirm/Cancel buttons
- Added `RestockIcon` SVG component

*→ Commit `bf49610` — feat: implement vehicle restock workflow*
*Co-authored-by: Gemini <gemini@users.noreply.github.com>*

---

### Prompt 4.3

**User:**
> Fix the PATCH vs PUT mismatch bug.

**AI (Gemini) actions:**
Added `router.patch("/:id", protect, updateVehicle)` alongside existing `router.put` in `vehicleRoutes.js` so both the API spec (PUT) and existing tests (PATCH) work.

---

### Prompt 4.4

**User:**
> nodemon not in devDependencies — will break npm run dev after a fresh npm install, fix that.

**AI (Gemini) actions:**
Added `"nodemon": "^3.1.10"` to `devDependencies` in `backend/package.json`. Ran `npm install` to update `package-lock.json`.

---

### Prompt 4.5

**User:**
> Remove cloudinary@2 and multer-storage-cloudinary@4 (they cause peer dependency conflicts).

**AI (Gemini) actions:**
Removed `cloudinary`, `multer-storage-cloudinary`, and `multer` from `dependencies` in `backend/package.json`. Ran `npm install` to clean `node_modules` and update lock file. Result: `removed 16 packages, 0 vulnerabilities`.

---

### Prompt 4.6

**User:**
> Create the README file as per the assessment requirements and PROMPTS.md using git commits wherever AI was used — add them in that.

**AI (Gemini) actions:**
- Rewrote `README.md` fully: complete project overview, tech stack, full feature checklist (all items checked), API tables, project structure tree, setup instructions for both backend and frontend, test report with actual test count, screenshots section, "My AI Usage" section with tool table, reflection, and co-author trailer examples
- Rewrote `PROMPTS.md` (this file): mapped every AI-assisted commit to the originating prompt and response, organized by session and tool

---

## Notes for Interviewers

- Every AI suggestion was reviewed against the kata requirements before committing
- Tests were always written in a **separate commit before** the implementation commit — preserving the Red → Green history even when AI could produce both in one step
- The assessment-required `Co-authored-by` trailer appears in every commit where AI was materially involved
- All prompts above reflect actual interactions — nothing has been fabricated for this file

---

*Last updated: 2026-07-23*
