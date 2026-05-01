# Harmony Project Hub Frontend

React + Vite frontend for the Harmony project management application.

## Features

- JWT-backed login and signup flow
- Dashboard for projects, tasks, activity, and team metrics
- Project CRUD with team assignment
- Kanban task board with status updates
- Comments, notifications, reports, calendar, and team management
- API integration with the Express/MongoDB backend in `../harmony_servre`

## Setup

```bash
cd harmony-project-hub
npm install
copy .env.example .env
npm run dev
```

The local app runs at:

```bash
http://localhost:8080
```

## Environment Variables

Local development:

```bash
VITE_API_URL=/api
VITE_BACKEND_URL=http://localhost:5000
```

`VITE_API_URL=/api` keeps browser requests same-origin through the Vite proxy. `VITE_BACKEND_URL` tells Vite where to forward `/api` and `/health`.

Production deployment:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

Set the backend `CLIENT_ORIGIN` to the deployed frontend URL so CORS allows the app.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## Demo Credentials

After the backend seeds MongoDB:

- Admin: `aria@nova.io` / `demo1234`
- Member: `kai@nova.io` / `demo1234`

## Backend

Start the backend before using the app locally:

```bash
cd ../harmony_servre
npm run dev
```

Backend health check:

```bash
http://localhost:5000/api/health
```
