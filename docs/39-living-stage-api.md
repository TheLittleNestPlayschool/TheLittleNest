# Living Stage API

**Status:** Living Document  
**Version:** 1.0  
**Last Updated:** 2026-08-02  
**Owner:** Dave Stoyko

**Related Documents:**
- 13-api-endpoints.md
- 29-living-stage.md
- 30-opening-experience.md
- 31-experience-composition.md
- 32-experience-ingredients.md
- 33-editorial-philosophy.md
- 35-experience-engine.md
- 36-main-stage.md
- 38-database-model.md

---

# Purpose

This document defines the API contract between Xano and `livingstage.html`.

The Living Stage should not need to understand the full database structure.

It should receive one complete response containing:

- The authenticated parent.
- The selected child.
- The child's current schedule state.
- The opening experience.
- Other available experiences.
- Permanent navigation options.
- Any information required to record parent activity.

The endpoint should return experience-ready data rather than raw database records.

---

# Endpoint

```text
GET /living-stage
