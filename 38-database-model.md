# Database Model

**Status:** Living Document  
**Version:** 1.0  
**Last Updated:** 2026-08-02  
**Owner:** Dave Stoyko

**Related Documents:**
- 12-database.md
- 13-api-endpoints.md
- 30-opening-stage.md
- 31-todays-chapter.md
- 32-experience-engine.md
- 33-todays-chapter-editorial.md
- 35-todays-chapter-data-model.md

---

# Purpose

This document describes the architectural purpose of each major data table within The Little Nest.

It does not replace the database schema.

It does not list every field.

Xano remains the source of truth for field definitions.

Instead, this document explains why each table exists, how it relates to other tables, and how together they create the parent experience.

---

# Design Philosophy

Every table should exist for a clear purpose.

A table should represent a meaningful object or relationship within the Little Nest ecosystem.

Whenever possible:

- One table should represent one concept.
- Relationships should describe how concepts connect.
- Lookup tables should standardize values.
- Data should only exist once.

The goal is to create a database that is easy to understand, maintain, and expand.

---

# Core People

## User

### Purpose

Represents authenticated application users.

Users may be parents, teachers, administrators, or future system roles.

### Primary Relationships

- Parent
- Teacher
- Admin Types

---

## Parent

### Purpose

Stores permanent parent information.

Parents experience their child's journey through the Living Stage.

### Primary Relationships

- User
- Student
- Franchise
- Experience
- Experience Activity
- Media

---

## Student

### Purpose

The student is the centre of the Little Nest experience.

Almost every meaningful event ultimately relates to a student.

### Primary Relationships

- Parent
- Franchise
- Session
- Student Attendance
- Teacher Observation
- Student Badge
- Media
- Experience

---

## Teacher

### Purpose

Teachers create the meaningful moments that become family experiences.

### Primary Relationships

- User
- Franchise
- Teacher Observation
- Student Badge
- Media

---

## Franchise

### Purpose

Represents an individual Little Nest location.

Stores operational information and controls curriculum progression.

### Primary Relationships

- Parent
- Student
- Teacher
- Session
- Student Attendance
- Experience

---

# Learning

## Session

### Purpose

Defines a recurring class schedule.

Examples include:

- Monday / Wednesday / Friday Morning
- Tuesday / Thursday / Saturday Afternoon

### Primary Relationships

- Franchise
- Student
- Student Attendance

---

## Time Slots

### Purpose

Standardizes approved class times.

Prevents inconsistent time formats across franchises.

### Primary Relationships

- Session

---

## Session Details

### Purpose

Defines the curriculum for a learning session.

Contains lesson content, objectives, category weighting, activities, and future learning.

### Primary Relationships

- Student Attendance
- Experience

---

## Student Attendance

### Purpose

Represents one student's attendance for one completed class.

This table connects curriculum, observations, media, and achievements into one classroom experience.

### Primary Relationships

- Student
- Session Details
- Teacher Observation
- Student Badge
- Media
- Experience

---

# Storytelling

## Observation Type

### Purpose

Standardizes teacher observation categories.

Examples include:

- Kindness
- Curiosity
- Confidence
- Leadership

### Primary Relationships

- Teacher Observation

---

## Teacher Observation

### Purpose

Captures meaningful moments noticed by teachers.

These observations become one of the most important sources for Today's Chapter and the Experience Engine.

### Primary Relationships

- Student
- Teacher
- Student Attendance
- Observation Type
- Experience

---

# Achievements

## Badge

### Purpose

Defines every badge available within Little Nest.

Contains presentation information including icons and animation references.

### Primary Relationships

- Student Badge

---

## Student Badge

### Purpose

Represents one badge earned by one student.

Records when, where, and why the badge was awarded.

### Primary Relationships

- Student
- Badge
- Teacher
- Student Attendance
- Experience

---

# Media

## Media Purpose

### Purpose

Standardizes why media exists.

Examples include:

- Classroom Moment
- Story Reel
- Teacher Observation
- Badge Celebration

### Primary Relationships

- Media Vault

---

## Media Vault

### Purpose

Stores photographs, videos, artwork, and other uploaded media.

Media supports experiences rather than existing independently.

### Primary Relationships

- Student
- Parent
- Teacher
- Student Attendance
- Teacher Observation
- Student Badge
- Experience

---

# Experience Engine

## Experience Type

### Purpose

Defines the different kinds of experiences presented to families.

Examples include:

- Today's Chapter
- Story Reel
- Badge Celebration
- Memory Replay

### Primary Relationships

- Experience

---

## Experience

### Purpose

Represents one meaningful experience prepared for a family.

Experiences are assembled from attendance, observations, curriculum, achievements, and media.

The Living Stage decides when each experience should be presented.

### Primary Relationships

- Student
- Parent
- Franchise
- Experience Type
- Student Attendance
- Teacher Observation
- Student Badge
- Session Details
- Media

---

# Relationship Philosophy

The Little Nest follows several guiding principles when designing relationships.

## One Source of Truth

Information should only exist once.

Other tables reference it through relationships.

---

## Controlled Values

Whenever practical, free-text values should be replaced by lookup tables.

Examples include:

- Time Slots
- Observation Types
- Media Purposes
- Experience Types

This improves consistency, reporting, and future AI analysis.

---

## Relationships Before Duplication

Whenever possible, tables should reference one another rather than duplicate information.

This creates a cleaner and more maintainable architecture.

---

## Experiences Are Built From Relationships

The parent experience is not stored in a single table.

Instead, it is assembled from many connected sources.

For example:

Student

↓

Attendance

↓

Session Details

↓

Teacher Observation

↓

Media

↓

Badge

↓

Experience

↓

Living Stage

Every table contributes part of the story.

---

# Design Goals

The data model should support:

- Today's Chapter
- Living Stage
- Story Reel
- Memory Nest
- Parent App
- Teacher App
- Badge System
- Learning Journey
- Future AI-assisted storytelling

without requiring major structural redesign.

---

# Final Principle

The purpose of the database is not simply to store information.

Its purpose is to preserve meaningful moments, connect families with their children's learning journey, and provide the foundation upon which every Little Nest experience is built.

Every table should contribute to telling the child's story.
