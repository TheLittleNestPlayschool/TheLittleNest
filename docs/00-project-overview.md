# Project Overview

**Status:** Draft
**Version:** 1.0
**Last Updated:** 2026-07-31
**Owner:** Dave Stoyko

**Related Documents:**
- 01-vision.md
- 02-design-principles.md
- 17-decisions.md

---

# Purpose

The Little Nest is more than a playschool management system. It is a parent engagement platform designed to help families experience, celebrate, and understand their child's learning journey.

This repository contains both the implementation (HTML, CSS, JavaScript, APIs, database) and the documentation that defines how the product is designed and built.

The documentation is the project's source of truth.

---

# Project Governance

## Source of Truth

The documentation defines how the system should work.

The code implements the documentation.

If documentation and code ever differ, the documentation is considered correct until a new decision is made and both are updated.

---

## Document Authority

When two documents conflict, the document with the higher authority takes precedence.

### Level 1 – Product Vision

These documents define what The Little Nest is.

- 00 Project Overview
- 01 Vision
- 02 Design Principles

These documents have the highest authority.

---

### Level 2 – User Experience

These documents define how parents, teachers, and children experience the product.

- 03 Characters
- 04 Parent Journey
- 05 Learning Path
- 06 Badges
- 07 Gallery
- 08 Story Reel
- 09 Notifications
- 10 Parent App
- 11 Teacher App

These documents must support the Product Vision.

---

### Level 3 – Technical Design

These documents define how the experience is implemented.

- 12 Database
- 13 API Endpoints
- 14 AWS Storage
- 15 Design System
- 16 Coding Standards

Technical decisions must support the User Experience and Product Vision.

---

### Level 4 – Project Management

These documents manage the ongoing development of the project.

- 17 Decisions
- 18 Roadmap
- 19 Future Ideas

These documents do not override higher-level documents.

---

# Development Workflow

Every new feature follows the same process.

1. Discuss the idea.
2. Update the appropriate documentation.
3. Approve the design.
4. Implement the feature.
5. Test the implementation.
6. Update the documentation to reflect the completed work.

Documentation always comes before implementation.

---

# Project Philosophy

The Little Nest is designed around the parent experience.

Technical implementation exists to support that experience.

Whenever a technical decision conflicts with the intended user experience, the user experience should be reconsidered first before changing the product vision.

Every feature should answer three questions before implementation:

Why does it exist?
How should the user feel?
How will it be implemented?

# Feature Evaluation

Before any new feature is approved for development, it should answer the following questions:

1. Why does this feature exist?
2. Which document defines its purpose?
3. Where does it fit within the Parent Journey?
4. How should the parent feel after using it?
5. Does it strengthen the connection between parent and child?
6. Does it follow the Design Principles?
7. How will it be implemented?
8. Would this make a parent more excited to tell someone about their child?

If these questions cannot be answered clearly, the feature should be refined before implementation.
