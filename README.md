# Home-X Construction Inventory and Resource Management System

Home-X Construction Inventory and Resource Management System is a custom web platform for **Home-X Construction PLC**. It is designed for construction inventory, project-site resources, tools, equipment, procurement, and project-cost control.

This repository is an original Home-X implementation. Public ERP and inventory systems may be reviewed for workflow ideas only; protected source code, logos, UI, database dumps, and proprietary assets must not be copied into this product.

## Phase 1 Scope

Phase 1 creates the architecture and database foundation:

- Monorepo structure for backend, frontend, and Docker deployment.
- NestJS backend package setup using TypeScript, Prisma, PostgreSQL, JWT, validation, and bcrypt.
- React + Vite + Tailwind frontend package setup.
- Docker Compose for PostgreSQL, backend, and frontend.
- PostgreSQL Prisma schema with construction inventory entities, enums, relations, indexes, and UUID primary keys.
- Prisma seed file for Home-X roles/users, settings, warehouses, categories, units, suppliers, projects, sites, phases, and starter items.

## Business Capabilities Modeled in the Database

- Users and role permissions for SUPER_ADMIN, ADMIN, MANAGER, SITE_ENGINEER, STOREKEEPER, ACCOUNTANT, and WORKER.
- Projects, sites, and project phases.
- Warehouses and storage locations including main store, project site, transit, truck, damaged, returned, and scrap types.
- Items, categories, units, suppliers, purchase requests, and purchase orders.
- Stock entries, entry lines, immutable stock ledger, and cached stock balances.
- Tool checkout and return, equipment assignment/usage, fuel logs, maintenance logs, attachments, approvals, audit logs, and company settings.

## Repository Structure

```text
backend/
  src/
    auth/
    users/
    projects/
    warehouses/
    items/
    stock/
    purchase-requests/
    suppliers/
    tools/
    equipment/
    reports/
    audit/
    settings/
    prisma/
  prisma/
    schema.prisma
    seed.ts
  test/
  Dockerfile
  package.json
frontend/
  src/
    components/
    layouts/
    pages/
    routes/
    services/
    hooks/
    utils/
    styles/
  Dockerfile
  package.json
docker-compose.yml
.env.example
AGENTS.md
```

## Quick Start

### 1. Configure environment

```bash
cp .env.example .env
```

### 2. Start PostgreSQL, backend, and frontend

```bash
docker compose up --build
```

### 3. Run database migration and seed locally or inside the backend container

If running inside Docker:

```bash
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npm run prisma:seed
```

If running locally:

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Open the apps

- Frontend: <http://localhost:5173>
- Backend health: <http://localhost:3000/api/health>
- PostgreSQL: `localhost:5432`

## Seed Users

All seed users use the development password from `SEED_DEFAULT_PASSWORD` or the fallback `HomeX@2026!`.

| Role | Email |
| --- | --- |
| SUPER_ADMIN | superadmin@homex.local |
| ADMIN | admin@homex.local |
| MANAGER | manager@homex.local |
| SITE_ENGINEER | engineer@homex.local |
| STOREKEEPER | storekeeper@homex.local |
| ACCOUNTANT | accountant@homex.local |
| WORKER | worker@homex.local |

## Stock Costing Foundation

The schema supports weighted-average costing through `StockBalance.averageCost` and immutable `StockLedger.unitCost` / `totalCost`. Phase 2 should implement a safe first stock service that writes ledger rows inside Prisma transactions before updating balances. A later costing upgrade can add batch/lot costing while preserving ledger immutability.


## Vercel Frontend Deployment

Deploy only the React frontend on Vercel for now. The NestJS backend remains a separate Docker/VPS or Node backend deployment target and should not be forced into Vercel serverless.

Use these Vercel settings:

| Setting | Value |
| --- | --- |
| Project root | `frontend` |
| Framework preset | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

Set these Vercel environment variables while the backend is not deployed:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Home-X Inventory
VITE_ENABLE_MOCKS=true
```

`VITE_ENABLE_MOCKS=true` keeps Home-X pages loading with visible Demo Data badges and realistic construction inventory data even when the backend API is unavailable. When the backend is deployed, set `VITE_API_URL` to the public backend API URL and optionally set `VITE_ENABLE_MOCKS=false`.

## Phase 2 Backend Foundation

The backend now includes initial modules for authentication, dashboard summaries, items, warehouses, projects, stock entries, material requests, and reports. Stock entry posting is transaction-oriented: it validates required source/target/project fields by movement type, rejects insufficient stock unless the company setting allows negative stock, writes stock ledger rows, updates stock balances, and creates audit logs.

## Deployment Notes

- Docker Compose is the first deployment target.
- The backend stores uploaded evidence on local disk by default at `UPLOAD_DIR`.
- For VPS deployment, place the stack behind HTTPS using Nginx or Caddy, use strong secrets, schedule PostgreSQL backups, and mount persistent volumes for database and uploads.

## Backup and Restore Starter Commands

Backup:

```bash
docker compose exec postgres pg_dump -U homex homex_inventory > backups/homex_inventory_$(date +%F).sql
```

Restore:

```bash
cat backups/homex_inventory_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U homex homex_inventory
```
