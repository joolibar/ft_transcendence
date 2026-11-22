# 0014 — Session handling

- **Status:** accepted
- **Date:** 2026-11-22

## Context

Sign up and log in with email and password ([#18](https://github.com/joolibar/ft_transcendence/issues/18)) needs a way to remember who is logged in after the password check. The two usual options are:

- **A session cookie.** The server stores a session (a random id linked to a user) and sends only the id to the browser in a cookie.
- **A JSON Web Token (JWT).** The server signs a token that holds the user's id. The browser keeps it and sends it back, and the server checks the signature without a lookup.

Facts about Miga that matter for the choice:

- The web app and the API are served from the same origin through nginx, which already forces HTTPS ([architecture](../architecture.md)).
- Socket.io (Phase 3) opens its connection from the browser, so it can use the same cookie to know who is connected.
- Later features need a log-out that takes effect at once: account deletion, moderation and blocking users.
- The load is small, so one database read per request is not a problem.

## Decision

- **A session cookie.** The session is a row in PostgreSQL, linked to the user, with a random id and an expiry date. The cookie holds only that id.
- **Cookie flags:** `HttpOnly` (JavaScript cannot read it, so an XSS bug cannot steal it), `Secure` (sent only over HTTPS) and `SameSite=Lax` (not sent on requests started by other sites, which limits CSRF).
- **Expiry:** 7 days. Each use extends it, so an active user stays logged in and an abandoned session ends by itself.
- **Log out:** delete the session row and clear the cookie. The session is invalid at once, even if someone copied the cookie.
- **Passwords:** hashed with argon2id, which adds its own salt. The plain password is never stored or logged.
- **Log-in errors:** a wrong password and an unknown email give the same message, so the API does not reveal which emails have an account.
- **Rate limit:** the log-in endpoint limits attempts per client to slow down password guessing.

## Consequences

- Logging out, deleting an account or blocking a user revokes access immediately, which a JWT cannot do without a server-side blocklist.
- The browser stores no token in `localStorage`, so there is no token for an XSS bug to steal.
- Every authenticated request reads one row from the `Session` table. We accept that cost for revocation.
- Sessions live in the database, so old rows must be cleaned up. A scheduled job deletes the expired ones.
- A mobile app or a third-party client that cannot use cookies would need another way to authenticate. The public API keys (Phase 6) are separate and do not use sessions.
