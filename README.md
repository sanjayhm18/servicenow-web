# ServiceDesk Pro

A fully frontend-only Service Desk / ITSM portal inspired by enterprise service-desk workflows and based on the uploaded ticket form reference.

## Features

- Employee login and separate employee account creation/sign-up
- Demo admin and employee accounts
- Logout
- Employee profile management
- Dashboard with ticket statistics
- Create Incident or Request
- Ticket form fields based on the reference:
  - Employee Name / Employee ID
  - Location
  - Category / Subcategory
  - Configuration Item
  - Impact / Urgency / calculated Priority
  - Short description
  - Additional comments (customer visible)
  - Work notes
  - Contact Type
  - State
  - Assignment Group
  - Assigned To
- Automatic ticket number generation (`INC000xxx` / `REQ000xxx`)
- Ticket detail page
- Status, assignment and priority controls
- Activity/audit timeline
- Search and filters
- My Tickets
- Knowledge Base
- Responsive desktop/tablet/mobile UI
- LocalStorage persistence
- No backend, database, authentication server or external API

## Run

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Demo accounts

Employee:
- Email: `vikruth@company.local`
- Password: `demo123`

Admin:
- Email: `admin@company.local`
- Password: `admin123`

## Important

This is a frontend demo. Authentication is simulated and credentials are stored in browser localStorage. It is not suitable for production authentication without a backend/security layer.
