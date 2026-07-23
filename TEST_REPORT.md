# Test Report — Backend Jest Suite

Date: 2026-07-23

Command run:

```powershell
Set-Location 'd:\car_dealership\backend'
npm test --silent
```

Summary:

- Test Suites: 1 failed, 2 passed, 3 total
- Tests: 15 failed, 4 passed, 19 total
- Time: ~14.79 s

Key failing symptoms:

- Many tests timed out in `beforeAll` hooks while attempting `mongoose.connect(...)`.
- Error observed: `MongoNotConnectedError: Client must be connected before running operations`.
- The test runner logs show Jest timeouts (Exceeded timeout of 5000 ms) indicating the DB connection did not establish within the default Jest hook timeout.

Relevant snippet:

```
FAIL  tests/vehicles.test.js (8.447 s)
● Vehicle API › should return 401 when creating vehicle without token

thrown: "Exceeded timeout of 5000 ms for a hook."
...
ERROR => [MongoNotConnectedError: Client must be connected before running operations]

Test Suites: 1 failed, 2 passed, 3 total
Tests:       15 failed, 4 passed, 19 total
```

Root cause & quick diagnosis:

- The backend tests expect a running MongoDB and `MONGO_URI` available to the test environment. The failures indicate either `MONGO_URI` is not set, is unreachable, or the connection is slow causing Jest's default 5s hook timeout to expire.

How to reproduce locally:

1. Ensure a MongoDB instance is running (local or Atlas) and you have a valid connection string.
2. From the repo root, run:

```powershell
# PowerShell (Windows)
Set-Location 'd:\car_dealership\backend'
$env:MONGO_URI = 'mongodb+srv://<user>:<pass>@cluster/<dbname>'
npm test
```

Or on macOS / Linux:

```bash
cd backend
MONGO_URI='mongodb+srv://<user>:<pass>@cluster/<dbname>' npm test
```

Recommended fixes:

- Add a `backend/.env` with a valid `MONGO_URI` (do NOT commit secrets). Example `.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster/<dbname>
PORT=5000
JWT_SECRET=your_secret
JWT_EXPIRATION=1d
```

- If your DB is slow to accept connections (Atlas cold start, network), increase Jest hook/test timeout in tests or globally. Options:
  - Add `jest.setTimeout(20000);` at the top of long-running test files.
  - Or run `npm test -- --testTimeout=20000`.

- Ensure tests call `await mongoose.connect(process.env.MONGO_URI)` and that `afterAll` properly closes connections (`await mongoose.disconnect()` or `await mongoose.connection.close()`), so subsequent runs are clean.

- For CI, use a test database and ensure the connection string is provided via environment variables in the CI job.

Notes for maintainers:

- Current `README.md` still shows an older "all passing" test report. This `TEST_REPORT.md` contains the live test output captured on `2026-07-23`.
- Once you fix the connection string or increase timeouts and re-run tests successfully, update `README.md` Test Report section with the new passing summary and timestamp.

If you want, I can:

- Add `jest.setTimeout(20000);` to `backend/tests/vehicles.test.js` and re-run tests.
- Create a `.env.example` in `backend/` to document required env vars.

Tell me which you'd prefer next.
