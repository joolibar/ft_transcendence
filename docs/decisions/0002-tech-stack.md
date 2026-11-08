# 0002 — Technical stack

- **Status:** accepted
- **Date:** 2026-11-02

## Context

The subject requires a frontend, a backend and a database, HTTPS for every connection from outside, input validation on both frontend and backend, and a containerised deployment. The team has no shared stack it already masters, the product relies on real-time features (group plans, chat, notifications), and the data is strongly relational (users, places, reviews, friendships, plans).

## Decision

| Layer      | Choice                              |
| ---------- | ----------------------------------- |
| Language   | TypeScript everywhere               |
| Frontend   | React, Vite, Tailwind CSS           |
| Backend    | Fastify on Node.js 24               |
| Database   | PostgreSQL, accessed through Prisma |
| Validation | Zod schemas in `shared`             |
| Real-time  | Socket.io                           |
| Web server | nginx (HTTPS, static files, proxy)  |
| Deployment | Docker Compose                      |

- **One language** keeps the learning curve small and lets the web app and the API share types and validation.
- **Fastify over Express:** first-class TypeScript support, built-in schema validation and better performance. Express was the main alternative because more people know it.
- **PostgreSQL over MongoDB:** our data has clear relations, which a relational database models and protects best.
- **Prisma:** type-safe queries generated from the schema, and versioned migrations.

## Consequences

- A change to a shared schema fails compilation in both apps until both are updated, catching mismatches before runtime.
- nginx is the only public entry point; the API and the database are reachable only inside the Docker network.
