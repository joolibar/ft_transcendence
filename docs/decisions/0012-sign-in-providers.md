# 0012 — Sign-in providers

- **Status:** accepted
- **Date:** 2026-11-04

## Context

The OAuth 2.0 module asks for remote sign-in with at least one provider. The first plan offered Google and the 42 intranet. Miga is a product for anyone who goes out to eat, not for 42 students, so a 42 account means nothing to most of its users. The providers people expect are Google and Apple.

The project is evaluated on `localhost`, with Docker, on the evaluator's machine. Each provider accepts that differently:

- **Google** accepts `localhost` as a redirect address, with any port and with HTTPS. It refuses private IP addresses and local host names.
- **Apple** only accepts a public domain with HTTPS, registered in an Apple Developer account, which costs 99 USD a year. It cannot be shown on `localhost`. It may also hide the user's email behind a relay address and sends the name only on the first sign-in.

Apple requires Sign in with Apple only from iOS apps that offer another social sign-in. Miga is a web app for now.

## Decision

- **At launch, Miga offers Google and email with password.** Google covers the OAuth 2.0 module.
- **No 42 intranet.** It does not fit the product's users.
- **Sign in with Apple waits** until Miga has a public domain and an iOS app. It is kept as a backlog issue with no phase.
- **Google works on `localhost` under two conditions**, which the setup guide explains when the feature is built:
  - The app is published in Google Cloud ("In production", not "Testing"), so any Google account can sign in, not only the test users we add. We ask only for the `openid`, `email` and `profile` scopes, which Google does not review.
  - Miga is opened at `https://localhost:8443`, the redirect address registered in Google Cloud.

## Consequences

- The evaluation shows a sign-in that works on the evaluator's machine, with no domain and no cost.
- One provider is less work in phase 3: one flow, one set of keys in `.env` and one kind of linked account.
- Adding Apple later reuses the same flow and the account linking. It will need a domain, the Apple Developer account and handling of relay emails and a missing name.
