# 0011 — Grammatical gender and form of address

- **Status:** accepted
- **Date:** 2026-11-04

## Context

Miga speaks Spanish, Catalan and English. In Spanish and Catalan many words that describe the person change with gender: "Bienvenido" or "Bienvenida", "¿Estás listo?" or "¿Estás lista?". If nothing is decided, each developer picks a form, and the product ends up talking to everyone in the masculine.

Some copy cannot avoid it. The game's levels and some badges are nouns that describe the person ("Exploradora", "Anfitrión"), and the explanations written by the language model address the user directly.

Asking for the user's gender would solve it, but sex and gender identity are personal data we do not need, and a form that asks for them excludes people who do not fit the options.

## Decision

- **Neutral copy first.** Every string is written without gender whenever Spanish and Catalan allow it ("Te damos la bienvenida", "Todo listo", "Te han invitado a una mesa"). A gendered string needs a reason in its pull request.
- **A form of address, not a gender.** The user profile stores how the person wants to be addressed: `neutral`, `masculine` or `feminine`.
  - It is a grammatical preference, never shown to other users and never used for anything else (recommendations, analytics, ranking).
  - It is optional and **`neutral` by default**. The onboarding asks it as a light question ("¿Cómo prefieres que te hablemos?") with an example of each form, and it can be changed in the account settings.
  - It is validated with the same Zod schema in the API and the web app (`formOfAddress` in `@miga/shared`).
- **Three forms per gendered string.** A string that cannot be neutral has its neutral, masculine and feminine forms in the translation files, and the translation library picks one from the profile. The library chosen for the languages epic must support this without custom code (for example i18next contexts or ICU `select`).
- **A test keeps the forms complete.** It fails if a gendered string misses one of its three forms in Spanish or Catalan. English strings rarely need them.
- **The language model uses it too.** The prompt for the explanations includes the user's form of address and the instruction to use neutral language when it is `neutral`.

The product rules, with examples, are in the Product Brief ("Género y forma de trato"). The levels and badges with their three forms are in its game catalogue.

## Consequences

- Most screens need no extra code: the rule is mostly about how copy is written, and reviewers check it like any other copy.
- The user table gains one column with a default, and the onboarding and account settings gain one field each, which the phase 3 screens must include.
- Gendered strings are three times the translation work, which is a reason to keep them few.
- The profile holds no sensitive data: the data export (GDPR) includes the preference like any other setting.
