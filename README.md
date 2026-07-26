# Legacy Vault

Legacy Vault is an authenticated digital-legacy dashboard with a React/Vite client and an Express/PostgreSQL API. The live Figma Make environment keeps the client source at `src/` (rather than nesting it under `client/src/`); it contains the requested client layers: `components`, `pages`, `redux`, and `services`.

## Request flow

```text
React dashboard → Redux action → Redux Saga → Axios → Express route
→ controller → service → query module → PostgreSQL
→ standardized JSON → Saga → Redux store → React UI
```

## Client structure

```text
src/
├── components/             # Presentation components (no Axios calls)
├── pages/
├── redux/
│   ├── actions/            # Saga trigger actions and shared types
│   ├── reducers/           # Redux Toolkit slices
│   ├── sagas/              # All asynchronous HTTP orchestration
│   ├── rootSaga.ts
│   └── store.ts
├── services/api.ts         # Centralized Axios configuration
└── App.tsx
```

## Server structure

```text
server/
├── config/database.js
├── controllers/assetController.js
├── controllers/authController.js
├── services/assetService.js
├── routes/assetRoutes.js
├── queries/assetQueries.js
├── queries/authQueries.js
├── middleware/errorHandler.js
├── models/schema.sql
├── app.js
└── server.js
```

## Run locally

1. Create a PostgreSQL database called `legacy_vault`.
2. Run the schema: `psql legacy_vault < server/models/schema.sql`.
3. Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`.
4. Copy `.env.example` to `.env` if your API runs on a non-default URL.
5. Run `npm install` at the repository root and `npm --prefix server install`.
6. In one terminal, run `npm run server`; in another, run `npm run dev`.

## CRUD API

All responses follow `{ success, message, data }`.

- `GET /api/assets` — list assets
- `GET /api/assets/:id` — get one asset
- `POST /api/assets` — create an asset
- `PUT /api/assets/:id` — update an asset
- `DELETE /api/assets/:id` — delete an asset

Authentication uses the existing PostgreSQL `users` table. The client never stores user accounts or sessions in `localStorage`; the signed-in user is held in the Redux store for the current browser session.

- `POST /api/auth/signup` — creates a `testator` account and stores a bcrypt password hash
- `POST /api/auth/signin` — validates an active user against `password_hash`

Example request body:

```json
{
  "name": "Google Drive Archive",
  "category": "Cloud Storage",
  "nomineeName": "Priya Sharma",
  "accessLevel": "view"
}
```
 
