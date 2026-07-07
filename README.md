# KwansoDwoo

**Report Road Incidents. Keep Ghana Safe.**

KwansoDwoo ("road safety" in Twi) is a road safety incident reporting and
monitoring system for Ghana. Citizens report incidents — anonymously or as a
registered user — and district officials review, verify, and resolve them
from a live admin dashboard.

---

## Tech stack

| Layer      | Technology                                    |
|------------|------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, React Router v6     |
| Backend    | Node.js, Express.js (REST API)                  |
| Database   | Firebase Cloud Firestore                        |
| Auth       | Firebase Authentication (email/password)        |
| Maps       | Leaflet.js + React-Leaflet, OpenStreetMap tiles  |
| Storage    | Firebase Storage (incident photos)              |
| Charts     | Recharts                                        |
| CSV export | PapaParse                                       |

---

## Project structure

```
/kwansodwoo
  /client              React frontend (Vite)
    /src
      /components      Shared UI (Navbar, StatusBadge, ConfidenceBar, PrivateRoute)
      /pages           Route-level pages (citizen portal + /pages/admin dashboard)
      /context         AuthContext (Firebase auth state)
      /utils           Axios client, shared constants
  /server              Node/Express backend
    /routes            /api/reports route definitions
    /controllers       Report business logic (confidence score, corroboration, CRUD)
    /middleware        verifyAdmin (Firebase ID token + role check)
    /config            Firebase Admin SDK init
    /utils             Confidence score, reference number, geo-distance helpers
    /scripts           seedAdmin.js — promote/create a test admin account
  firestore.rules       Firestore security rules
  firestore.indexes.json Composite indexes required by the app's queries
  .env                  Reference list of every env var used (see below)
```

---

## 1. Create a Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com) and create a new project.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → create a database (start in production mode).
4. **Storage** → enable Firebase Storage (used for incident photos).
5. **Project settings** → **General** → under "Your apps", add a **Web app** and copy the config values (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
6. **Project settings** → **Service accounts** → **Generate new private key**. This downloads a JSON file used by the backend's Firebase Admin SDK.
7. Deploy the included security rules and indexes (optional but recommended):
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at this repo, reuse the existing files when asked
   firebase deploy --only firestore:rules,firestore:indexes
   ```

---

## 2. Environment variables

Three `.env` files are involved. The root `.env` in this repo is a **reference
copy** listing every variable; Vite and Node.js each load their own `.env`
from their respective folders, so copy the matching values into:

### `server/.env` (copy from `server/.env.example`)

| Variable                  | Description                                                            |
|----------------------------|------------------------------------------------------------------------|
| `PORT`                     | Port the Express API listens on (default `5000`).                     |
| `FIREBASE_STORAGE_BUCKET`  | e.g. `your-project.appspot.com` — used to init the Admin SDK's storage client. |
| `FIREBASE_ADMIN_SDK_KEY`   | The **entire** service account JSON (step 6 above), pasted as a single-line string. Literal newlines in `private_key` should be escaped as `\n` (this happens automatically when you paste the file's raw text onto one line). |

### `client/.env` (copy from `client/.env.example`)

| Variable                              | Description                                    |
|-----------------------------------------|-------------------------------------------------|
| `VITE_FIREBASE_API_KEY`                | Firebase Web SDK API key                        |
| `VITE_FIREBASE_AUTH_DOMAIN`            | e.g. `your-project.firebaseapp.com`             |
| `VITE_FIREBASE_PROJECT_ID`             | Firebase project ID                             |
| `VITE_FIREBASE_STORAGE_BUCKET`         | e.g. `your-project.appspot.com`                 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`    | Firebase messaging sender ID                    |
| `VITE_FIREBASE_APP_ID`                 | Firebase web app ID                             |
| `VITE_API_BASE_URL`                    | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## 3. Install and run

### Backend

```bash
cd server
npm install
cp .env.example .env   # then fill in real values
npm run dev             # nodemon, restarts on change
# or: npm start
```

The API starts on `http://localhost:5000` (or `PORT` from `.env`).
Health check: `GET /api/health`.

### Frontend

```bash
cd client
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

The app starts on `http://localhost:5173`.

---

## 4. Seed a test admin user

Registered users default to `role: "citizen"`. To reach `/admin`, a user's
Firestore `users/{uid}` document needs `role: "admin"`. A helper script is
included:

```bash
cd server
node scripts/seedAdmin.js admin@example.com StrongPassw0rd "Admin User"
```

This will:
1. Create the Firebase Auth account if it doesn't already exist (or reuse it if it does).
2. Create/update the matching `users/{uid}` Firestore document with `role: "admin"`.

Log in at `/login` with those credentials, then visit `/admin`.

---

## 5. How the confidence score works

Calculated server-side on every submission, starting at 0:

- Incident type selected: **+20**
- Description ≥ 50 characters: **+20**
- GPS coordinates provided: **+25**
- Photo uploaded: **+25**
- Corroboration flag true: **+10**
- Capped at **100**

Reports scoring **below 40** are set to `under_review` instead of `pending`.

**Corroboration:** on submission, the backend looks for other reports of the
same incident type within **0.5 km** and the last **2 hours**. If any exist,
the new report's `corroboration_flag` is set to `true`, and all matching
existing reports have their `corroboration_flag` set to `true` and their
`confidence_score` bumped by +10 (capped at 100).

---

## 6. Report statuses

`pending` → `under_review` → `verified` → `under_investigation` → `resolved`
(or `rejected` at any point). Admins change status from the **Report
Management Panel** in the dashboard; every change is recorded in
`admin_logs` and shown in that report's audit trail.

---

## Notes on this build

- The citizen-facing flow (landing, report, track, register, login) needs
  no admin privileges and works whether or not Firebase Storage/Auth are
  reachable for the *photo* step specifically — photo upload is optional.
- `/admin/*` is protected by `PrivateRoute`, which checks both an active
  Firebase Auth session **and** `role === "admin"` on the user's Firestore
  document before rendering the dashboard; otherwise it redirects to `/login`.
- The backend's `verifyAdmin` middleware performs the same check
  server-side (401 if unauthenticated, 403 if authenticated but not an
  admin) — the frontend guard alone is not treated as sufficient security.
