# Belajar TypeScript RESTful API

Project ini adalah RESTful API berbasis Node.js, TypeScript, dan Prisma.

## Requirement

- Node.js >= v22
- pnpm v11
- PostgreSQL

## Instalasi

```bash
pnpm install
```

## Konfigurasi Environment

Rename file `example.env` di root project, lalu sesuaikan koneksi database:

```env
DATABASE_URL="postgres://user:pass@host-pooler:6543/db?pgbouncer=true"
```

## Prisma

Generate Prisma Client:

```bash
pnpm prisma generate
```

Jalankan migration:

```bash
pnpm prisma migrate dev
```

## Menjalankan Project

Build project:

```bash
pnpm build
```

Menjalankan hasil build:

```bash
pnpm start
```

## Catatan

- Pastikan database sudah berjalan sebelum menjalankan Prisma migration.
