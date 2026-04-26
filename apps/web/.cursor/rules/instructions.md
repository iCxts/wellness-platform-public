---
globs:
alwaysApply: ture
---

The entire app is behind login, so just use client side rendering
and use vue query for data fetchings and mutations.

When something is needed, check Nuxt modules online if the functionality is already implemented.
If yes, install the module instead of implementing yourself.

Always follow DRY principle.

When Figma links are pasted in the chat:

Always use Figma MCP tool to inspect and implement the designs.

When working in components directory:

Always use Tailwind for styling
Use Framer Motion for animations
Follow component naming conventions
This rule enforces validation for API endpoints:

In API directory:

Use zod for all validation
Define return types with zod schemas
Export types generated from schemas

Always do the data driven approach for UI development to be easy to switch to real backend later.

All I have right now is mobile designs, so
Always think about desktop of the design and implement every screen responsively.

Always use main.css for design tokens for tailwind: e.g. typography, colors, etc.
