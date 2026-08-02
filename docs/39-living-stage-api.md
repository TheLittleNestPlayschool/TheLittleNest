Living Stage API

Status: Living DocumentVersion: 1.0Last Updated: 2026-08-02Owner: Dave Stoyko

Related Documents:

13-api-endpoints.md

29-living-stage.md

30-opening-experience.md

31-experience-composition.md

32-experience-ingredients.md

33-editorial-philosophy.md

35-experience-engine.md

36-main-stage.md

38-database-model.md

Purpose

This document defines the API contract between Xano and livingstage.html.

The Living Stage should not need to understand the full database structure.

It should receive one complete response containing:

The authenticated parent.

The selected child.

The child's current schedule state.

The opening experience.

Other available experiences.

Permanent navigation options.

Any information required to record parent activity.

The endpoint should return experience-ready data rather than raw database records.

Endpoint

GET /living-stage

The endpoint requires authentication.

The authenticated user determines the parent record.

The client should not send a parent_id.

Authentication

Request header:

Authorization: Bearer {authToken}

The authenticated user must:

Be active.

Have a valid parent_id.

Be authorized to view the requested student.

Belong to the student's family.

Unauthorized records must never be returned.

Optional Request Parameters

student_id

Use this when a parent has more than one child.

If student_id is not supplied:

Use the parent's default or first active student.

Return all active children in family.children.

Indicate which child is currently selected.

Example:

GET /living-stage?student_id=42

Main Response Structure

{
  "success": true,
  "generated_at": 1785632400000,
  "family": {},
  "student": {},
  "franchise": {},
  "schedule": {},
  "class_context": {},
  "opening_experience": {},
  "available_experiences": [],
  "navigation": {},
  "activity_context": {}
}

Family

{
  "family": {
    "parent": {
      "id": 12,
      "user_id": 55,
      "full_name": "Dave Stoyko",
      "first_name": "Dave"
    },
    "children": [
      {
        "id": 42,
        "name": "Emma",
        "preferred_name": "Emma",
        "is_active": true
      }
    ],
    "selected_student_id": 42
  }
}

Only return parent information needed by the Living Stage.

Do not return private contact, emergency-contact, billing, or internal fields unless the current experience requires them.

Student

{
  "student": {
    "id": 42,
    "name": "Emma",
    "preferred_name": "Emma",
    "date_of_birth": "2022-03-14",
    "age": 4,
    "gender": "Female",
    "primary_language": "English",
    "franchise_id": 3,
    "session_enrolled_id": 8,
    "start_date": "2026-05-10",
    "profile_media": null
  }
}

The selected child is always the hero of the response.

Franchise

{
  "franchise": {
    "id": 3,
    "name": "The Little Nest Playschool",
    "branch_name": "Lucban",
    "timezone": "Asia/Manila",
    "current_session": 18
  }
}

Only return franchise information needed to prepare the parent experience.

Schedule

{
  "schedule": {
    "enrolled_session": {
      "id": 8,
      "name": "Monday Wednesday Friday Morning",
      "description": "Morning Class",
      "scheduled_days": [
        "Monday",
        "Wednesday",
        "Friday"
      ],
      "start_time": "09:00",
      "end_time": "10:30"
    },
    "today": {
      "date": "2026-08-02",
      "day_name": "Sunday",
      "is_scheduled_class_day": false,
      "state": "no_class_today"
    },
    "next_class": {
      "date": "2026-08-03",
      "day_name": "Monday",
      "start_time": "09:00",
      "end_time": "10:30"
    }
  }
}

Schedule State Values

The schedule.today.state value should use one of these controlled codes:

no_class_today
class_later_today
class_in_progress
waiting_for_teacher_update
class_completed
class_missed
makeup_later_today
makeup_in_progress
makeup_completed
schedule_unknown

These states should be determined using normal Xano rules.

Artificial intelligence should not determine schedule state.

Class Context

{
  "class_context": {
    "attendance": {
      "id": 381,
      "recorded_at": 1785610800000,
      "session_details_id": 18,
      "is_makeup": false
    },
    "session_details": {
      "id": 18,
      "session_num": 18,
      "session_plan_name": "Butterfly Discovery",
      "session_description": "Children explore colours, shapes, and movement.",
      "todays_description": "Today the children created colourful butterflies.",
      "next_description": "Next time the children will create a leaf collage.",
      "home_time_activity": "Look for different coloured leaves together.",
      "category_weights": {
        "literacy": 0.25,
        "oral_language": 0.35,
        "numeracy": 0.15,
        "gross_motor": 0.20,
        "fine_motor": 0.80,
        "creative_arts": 0.90,
        "personal": 0.25,
        "receptive_language": 0.30,
        "my_world": 0.50
      }
    },
    "teacher_observations": [
      {
        "id": 73,
        "type": {
          "id": 1,
          "code": "kindness",
          "name": "Kindness",
          "parent_display_name": "A Kind Moment"
        },
        "observation_text": "Emma helped another child put away the crayons.",
        "is_highlight": true,
        "is_memory_candidate": true,
        "teacher": {
          "id": 9,
          "first_name": "Mayumi"
        }
      }
    ],
    "media": [
      {
        "id": 912,
        "file_url": "https://example.com/media/photo.jpg",
        "file_type": "image",
        "purpose_code": "classroom_moment",
        "captured_at": 1785609000000,
        "is_featured": true
      }
    ],
    "badges_earned": [
      {
        "student_badge_id": 27,
        "earned_at": 1785610800000,
        "award_reason": "Emma completed her first literacy milestone.",
        "badge": {
          "id": 4,
          "name": "Literacy Explorer",
          "description": "Celebrates an important step in early literacy.",
          "category": "literacy",
          "icon_url": "https://example.com/badges/literacy-explorer.svg",
          "animation_key": "literacy_first_badge"
        }
      }
    ]
  }
}

If no completed class is relevant, class_context may be null.

Opening Experience

The endpoint should return one selected opening experience.

{
  "opening_experience": {
    "id": 204,
    "experience_type": {
      "id": 2,
      "code": "badge_celebration",
      "name": "Badge Celebration"
    },
    "title": "Emma has something wonderful to celebrate.",
    "subtitle": "Her first Literacy Badge is ready.",
    "story_text": "Emma reached an important new milestone today.",
    "priority": 100,
    "is_featured": true,
    "is_replayable": true,
    "is_shareable": true,
    "is_memory_candidate": true,
    "available_at": 1785610800000,
    "expires_at": null,
    "hero_media": {
      "id": 912,
      "file_url": "https://example.com/media/photo.jpg",
      "file_type": "image"
    },
    "source": {
      "student_attendance_id": 381,
      "teacher_observation_id": null,
      "student_badge_id": 27,
      "session_details_id": 18
    },
    "composition": {
      "opening": {
        "character": "tita_mayumi",
        "message": "Someone has been working very hard."
      },
      "hero": {
        "type": "badge",
        "badge_id": 4
      },
      "media_ids": [
        912,
        913,
        914
      ],
      "conversation_starter": "Ask Emma what she enjoyed most about today's activity.",
      "ending": {
        "character": "pico",
        "animation_key": "confetti_run"
      }
    },
    "activity_summary": {
      "has_been_opened": false,
      "has_been_completed": false,
      "replay_count": 0,
      "share_count": 0,
      "is_favourite": false,
      "last_activity_at": null
    }
  }
}

The client should not need to recreate the experience from raw tables.

It should receive a prepared experience.

Available Experiences

The endpoint may return additional active experiences that the parent can choose.

{
  "available_experiences": [
    {
      "id": 203,
      "experience_type": {
        "code": "todays_chapter",
        "name": "Today's Chapter"
      },
      "title": "Let us tell you about Emma's day.",
      "subtitle": "A new chapter is waiting.",
      "priority": 90,
      "is_replayable": true,
      "is_shareable": false,
      "has_been_opened": false
    },
    {
      "id": 198,
      "experience_type": {
        "code": "memory_replay",
        "name": "Memory Replay"
      },
      "title": "Remember this?",
      "subtitle": "A favourite moment is waiting.",
      "priority": 40,
      "is_replayable": true,
      "is_shareable": true,
      "has_been_opened": true
    }
  ]
}

The opening experience should also appear in this collection only if the frontend benefits from it.

Avoid unnecessary duplication.

Navigation

Permanent destinations should remain available even when the Living Stage recommends an opening experience.

{
  "navigation": {
    "learning_path_available": true,
    "memory_nest_available": true,
    "gallery_available": true,
    "story_reel_available": true,
    "messages_available": true,
    "settings_available": true
  }
}

This section describes availability, not visual layout.

Activity Context

This section provides the information required when recording experience activity.

{
  "activity_context": {
    "parent_id": 12,
    "student_id": 42,
    "user_id": 55,
    "session_token_valid": true
  }
}

The frontend should still rely on the authenticated user.

It should not be allowed to submit arbitrary parent or student ownership values.

Opening Experience Selection

Version 1 should use deterministic rules.

Recommended priority:

1. Unseen active badge celebration
2. Unseen active special celebration
3. Unseen completed-class experience
4. Class later today
5. Class currently in progress
6. Waiting for teacher update
7. Missed class or makeup opportunity
8. Unseen Story Reel
9. Meaningful Memory Nest replay
10. Next Adventure
11. General welcome

The endpoint should select one opening experience.

The frontend should not decide between competing experiences.

Parent Freedom

The endpoint recommends an opening experience.

It does not restrict the parent.

The response should also contain the information needed to:

Replay a previous experience.

Visit Memory Nest.

Open the Learning Path.

View available media.

See what is coming next.

Change the selected child.

Open settings.

Empty State

The endpoint must always return a valid opening experience.

If no prepared experience exists, return a temporary system-generated welcome object:

{
  "opening_experience": {
    "id": null,
    "experience_type": {
      "code": "welcome",
      "name": "Welcome"
    },
    "title": "Welcome back.",
    "subtitle": "The Little Nest is ready.",
    "story_text": "Whenever you are ready, let us continue your child's story together.",
    "priority": 0,
    "is_replayable": false,
    "is_shareable": false,
    "composition": {}
  }
}

This welcome does not require an experience database record.

Error Responses

Unauthorized

{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication is required."
  }
}

HTTP status:

401

Parent Not Found

{
  "success": false,
  "error": {
    "code": "PARENT_NOT_FOUND",
    "message": "No active parent account was found."
  }
}

HTTP status:

404

Student Not Found

{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "No active student was found for this parent."
  }
}

HTTP status:

404

Student Not Authorized

{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_AUTHORIZED",
    "message": "This student does not belong to the authenticated parent."
  }
}

HTTP status:

403

Server Error

{
  "success": false,
  "error": {
    "code": "LIVING_STAGE_ERROR",
    "message": "The Living Stage could not be prepared."
  }
}

HTTP status:

500

Frontend Flow

livingstage.html should:

Read authToken
↓
Call GET /living-stage
↓
Receive the complete Living Stage response
↓
Store the current response in memory
↓
Render opening_experience
↓
Record experience activity when appropriate
↓
Allow the parent to choose another experience

The frontend should not make separate startup calls for parent, student, franchise, schedule, attendance, observations, badges, and media.

The /living-stage endpoint should compose the complete startup response.

Performance

The endpoint should be optimized for startup.

It should:

Return only fields needed by the parent experience.

Avoid returning private or internal database fields.

Limit media returned in the startup response.

Avoid sending full historical collections.

Return the opening experience immediately.

Load deeper history only when the parent requests it.

The Living Stage should feel ready, not assembled in front of the parent.

Security

Every query must be scoped through the authenticated user's parent_id.

The endpoint must never trust a client-supplied:

parent_id

franchise_id

user_id

A supplied student_id must be verified against the authenticated parent.

Private teacher observations must never be returned.

Media must only be returned when:

is_active = true
is_parent_visible = true

Expired or unauthorized media must not be exposed.

Final Principle

The /living-stage endpoint should not return everything the database knows.

It should return everything required to create the most meaningful experience available to the family right now.

The database prepares the truth.

The Experience Engine prepares the experience.

The Living Stage welcomes the family.
