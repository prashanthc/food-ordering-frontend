# Frontend

React + TypeScript SPA. It is built as its own Docker image and the backend copies the static files from it at build time — no separate frontend server needed in production.

## Run in dev mode

The backend must already be running on `http://localhost:8080` before starting the frontend. Vite proxies `/api` and `/auth` requests to it automatically.

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Build Docker image

```bash
docker build -t food-ordering-frontend:v1.0.0 .
```

This builds the React app and stores the `dist/` output inside the image. The backend image pulls from this during its own build.

## Build static files only (optional)

```bash
npm run build
```

Output goes to `dist/`. You don't normally need this — the Docker build handles it.
