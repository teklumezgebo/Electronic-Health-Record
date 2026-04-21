# Electronic-Health-Record

A full-stack Electronic Health Record system built to simulate the core workflows of enterprise EHR platforms like Epic. Designed as a portfolio project demonstrating healthcare domain knowledge, secure clinical data architecture, and modern full-stack engineering practices.

---

## Overview

 A provider-facing EHR platform that allows clinical staff to manage patient records, document clinical notes, track medications and diagnoses, and receive AI-powered chart summaries. The system enforces role-based access control across three clinical roles and maintains an append-only audit log of all PHI access events in alignment with HIPAA compliance principles.

---

## Features (To be fully implemented...)

### Patient Management
- Create and manage patient demographic records including name, date of birth, gender, blood type, weight, phone, and address
- Unique Medical Record Number (MRN) per patient for human-readable identification
- Search and filter patients across the provider dashboard

### Clinical Notes
- Create SOAP, Progress, and Discharge notes tied to a patient and author
- Note signing workflow — notes are unsigned until a provider explicitly finalizes them
- Notes are locked to the original author — other providers cannot edit them

### Diagnoses
- Attach ICD-10 diagnosis codes to patient records via real-time search powered by the NLM Clinical Tables API
- Track diagnosis status as Active or Resolved
- Full audit trail of who recorded each diagnosis and when

### Medications
- Prescribe medications with dosage, frequency, and active/discontinued status
- Pharmaceutical frequency enums reflecting real clinical terminology (BID, TID, QID, PRN, etc.)
- Drug interaction checking against existing patient medications via OpenFDA

### Allergies
- Document patient allergies with allergen, symptoms, and severity classification
- Severity tracked as Mild, Moderate, or Severe
- Allergy list surfaced in AI summary and checked during medication prescribing

### AI Chart Summary
- AI-powered patient chart summary panel powered by the Claude API
- Aggregates clinical notes, active medications, diagnoses, and allergies into a structured overview
- Surfaces on chart open in a sidebar panel for quick provider review
- Flags elevated values, potential concerns, and suggested follow-up actions

### Authentication & Authorization
- JWT-based stateless authentication with bcrypt password hashing
- Role-based access control across three provider roles — Admin, Doctor, and Nurse
- Ownership-based restrictions — notes and records locked to their authors
- Role enforcement on both the backend (middleware) and frontend (UI gating)

### Audit Logging
- Append-only audit log capturing every PHI access and modification event
- Records user, action, resource type, resource ID, and timestamp
- Admin-accessible audit log viewer
- Reflects HIPAA audit trail requirements

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, bcrypt |
| AI | Claude API |
| ICD-10 Search | NLM Clinical Tables API |
| Infrastructure | Docker |

---

## Architecture

This EHR uses a separated client/server architecture reflecting enterprise application design patterns.

```
ehr-app/
├── client/          # React + TypeScript frontend (Vite)
└── server/          # Node.js + Express backend
    ├── src/
    │   ├── middleware/
    │   ├── routes/
    │   ├── lib/
    │   └── generated/
    └── prisma/
        └── schema.prisma
```

The React frontend communicates exclusively with the Express API. The API handles all logic, authentication, and database access via Prisma. PostgreSQL runs in a Docker container for local development.

---

## Data Model

The schema models core clinical data with full relational integrity across all entities.

- **User** — Clinical staff with role-based access (Admin, Doctor, Nurse)
- **Patient** — Demographic records with MRN, blood type, and contact info
- **Note** — SOAP, Progress, and Discharge notes with signing workflow
- **Diagnosis** — ICD-10 coded diagnoses with active/resolved status
- **Medication** — Prescriptions with dosage, frequency, and status
- **Allergy** — Allergen records with severity classification
- **AuditLog** — Append-only access and modification event log

---

## API Endpoints (So far..)

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | /api/auth/register | Register a new provider | Public |
| POST | /api/auth/login | Login and receive JWT | Public |

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens signed with a server-side secret and expire after 8 hours
- Role enforcement via Express middleware on every protected route
- Ownership checks prevent providers from modifying other providers' records
- Append-only audit log captures all PHI access events
- Passwords stripped from all API responses

---

## Clinical Domain Notes

This project reflects real healthcare system design decisions including ICD-10-CM diagnosis coding, pharmaceutical frequency terminology (BID, TID, QID, PRN), SOAP/Progress/Discharge note types, MRN-based patient identification, and note signing workflows. Audit logging architecture reflects HIPAA audit trail requirements.