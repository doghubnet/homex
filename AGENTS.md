# Home-X Agent Instructions

## Product Ownership and Originality
- Build original Home-X Construction PLC software. Do not clone ERPNext, Odoo, or any GitHub product into this repository.
- Public ERP and inventory systems may be studied only for workflow inspiration. Do not copy protected source code, database dumps, logos, UI, or proprietary assets.
- Preserve license notices for any third-party package or code that is intentionally reused.

## Architecture
- Keep the repository as a monorepo with `backend/`, `frontend/`, and root Docker/deployment files.
- Backend is NestJS + TypeScript + Prisma + PostgreSQL.
- Frontend is React + Vite + Tailwind CSS.
- Stock ledger records are immutable and are the source of truth; cached stock balances must never be updated without a ledger write.
- Use UUID primary keys and clear business-readable names in database models.

## Coding Rules
- Prefer explicit DTO validation, role guards, and service-layer transactions for business logic.
- Use Decimal values for construction quantities, costs, budgets, valuations, equipment hours, and fuel amounts.
- Audit sensitive create, update, delete, approval, rejection, issue, transfer, adjustment, damage, loss, checkout, and return actions.
- Never allow negative stock unless the setting `allowNegativeStock` is enabled by a SUPER_ADMIN-controlled setting.
- Avoid try/catch blocks around imports.

## Frontend Rules
- Use a clean Home-X industrial construction style: off-white/slate/zinc/stone surfaces, deep blue and construction orange accents, red alerts, green success states.
- Build responsive cards, tables, forms, badges, and empty states suitable for managers, storekeepers, and site engineers.

## Commands
- Use `rg` and `rg --files` for searching and listing files.
- Avoid destructive git commands.
- Run relevant validation after changes, such as `npm run typecheck`, `npm run build`, `npm run lint`, `npx prisma validate`, or tests when available.
