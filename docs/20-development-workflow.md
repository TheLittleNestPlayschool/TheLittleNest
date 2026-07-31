# Development Workflow

**Status:** Active
**Version:** 1.0
**Last Updated:** 2026-07-31
**Owner:** Dave Stoyko

**Related Documents:**
- 00-project-overview.md
- 01-vision.md
- 02-design-principles.md
- 15-design-system.md
- 16-development-standards.md
- 17-decisions.md

---

# Purpose

This document defines the workflow used to design, document, build, test, and release every feature within The Little Nest.

The objective is to ensure that every feature is intentional, well documented, maintainable, and consistent with the overall vision of the product.

This workflow applies to every new feature, regardless of size.

---

# Core Philosophy

We do not build features.

We build experiences.

The experience is designed first.

The documentation defines the experience.

The code implements the documentation.

If documentation and code disagree, the documentation is considered the source of truth until intentionally updated.

---

# Development Lifecycle

Every feature follows the same lifecycle.

```
Idea
   │
   ▼
Discussion
   │
   ▼
Documentation
   │
   ▼
Design Review
   │
   ▼
GitHub Documentation Commit
   │
   ▼
HTML / CSS Development
   │
   ▼
JavaScript Development
   │
   ▼
Xano Integration
   │
   ▼
Testing
   │
   ▼
Polish & UX Review
   │
   ▼
GitHub Code Commit
   │
   ▼
Feature Complete
```

No stage should be skipped unless there is a compelling reason.

---

# Stage 1 — Discussion

Every feature begins as a discussion.

Questions should include:

- Why are we building this?
- What problem does it solve?
- How should parents feel?
- How does it fit into the Parent Journey?
- Does it support the project vision?

Ideas are challenged before implementation begins.

---

# Stage 2 — Documentation

Before coding begins, the appropriate documentation should be updated.

Documentation should define:

- Purpose
- User experience
- Design intent
- Future expansion
- Related documents

Major architectural decisions should also be added to the Decisions document.

---

# Stage 3 — Design Review

Before implementation, review the proposed design.

Ask:

- Does it support the Vision?
- Does it follow the Design Principles?
- Is the Parent Experience improved?
- Is it simple?
- Is it expandable?
- Does it create an emotional connection?
- Does it create a moment worth remembering?

---

# Stage 4 — Documentation Commit

Documentation is committed to GitHub before implementation begins.

GitHub is the project's single source of truth.

---

# Stage 5 — Implementation

Implementation normally follows this order:

1. HTML
2. CSS
3. JavaScript
4. Xano API Integration
5. AWS Integration (when required)
6. Testing

Each stage should remain modular and easy to maintain.

---

# Stage 6 — User Experience Review

Before considering a feature complete, ask:

- Would a parent enjoy using this?
- Does it tell part of the child's story?
- Is it visually rewarding?
- Is anything confusing?
- Can unnecessary complexity be removed?

User experience takes priority over implementation convenience.

---

# Stage 7 — Completion

A feature is considered complete only when all of the following are true.

- Documentation updated
- HTML complete
- CSS complete
- JavaScript complete
- Xano integration complete
- AWS integration complete (if required)
- Mobile layout verified
- User experience reviewed
- GitHub committed
- Version updated

---

# Definition of Done

A feature is finished when another developer could understand it, maintain it, and continue building it using only the project documentation.

---

# Order of Precedence

When conflicts exist, the following order applies.

1. Vision
2. Design Principles
3. Decisions
4. Feature Documentation
5. Development Standards
6. Source Code

Documentation always supersedes implementation.

Code may require updates when documentation changes.

Documentation should never be modified simply to match existing code.

---

# Versioning

Every significant change should result in a version update.

Documentation should evolve alongside implementation.

Major design changes should also create a new Decision entry.

---

# Continuous Improvement

The workflow itself is a living document.

If a better process is discovered, the workflow should be updated.

The goal is continuous improvement rather than rigid adherence to outdated practices.

---

# Final Principle

Whenever uncertainty exists, return to one question:

**"What experience are we trying to create for the family?"**

If the answer is clear, the implementation usually becomes clear as well.
