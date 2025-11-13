# Vue Auth Demo (skeleton)

This is a minimal skeleton for the Frontend Authentication part of the project (Vue 3 + Vite + Pinia + Vue Router + Axios).

## Quick start

1. Install deps:
   ```
   npm install
   ```

2. Run dev server:
   ```
   npm run dev
   ```

3. Configure backend API URL via `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

API endpoints expected (example):
- POST /auth/login  -> { token, user }
- POST /auth/register -> { token, user }
- POST /auth/logout
- GET /auth/me -> { user }

Adjust axios baseURL in `src/api/axiosInstance.js` if needed.
