# Dr. Anna Brameli Medical Clinic System

## Overview
A complete medical clinic management system for Dr. Anna Brameli (ד״ר אנה ברמלי), an Allergy and Immunology specialist. The system includes:
1. **Public Website** - Hebrew RTL landing page for patients with appointment booking
2. **Admin Dashboard** - Protected clinic management interface for staff

## Current State
Fully functional with:
- Public website with all features (booking, contact form, chatbot)
- Admin dashboard with authentication via Replit Auth
- PostgreSQL database for all data persistence
- 18% VAT calculation on invoices

## Project Structure
```
client/
├── src/
│   ├── pages/
│   │   ├── home.tsx              # Public landing page
│   │   └── admin/
│   │       ├── dashboard.tsx     # Admin overview
│   │       ├── patients.tsx      # Patient management
│   │       ├── appointments.tsx  # Appointment scheduling
│   │       ├── visits.tsx        # Visit records
│   │       ├── invoices.tsx      # Billing with VAT
│   │       └── settings.tsx      # Doctor/clinic settings
│   ├── components/
│   │   ├── admin-layout.tsx      # Admin sidebar layout
│   │   └── ui/                   # Shadcn UI components
│   ├── hooks/
│   │   └── use-auth.ts           # Authentication hook
│   └── lib/
│       ├── queryClient.ts        # React Query setup
│       └── auth-utils.ts         # Auth error handling
server/
├── routes.ts                     # All API endpoints
├── storage.ts                    # DatabaseStorage implementation
├── db.ts                         # PostgreSQL connection
└── replit_integrations/auth/     # Replit Auth integration
shared/
├── schema.ts                     # All database tables
└── models/auth.ts                # Auth tables (users, sessions)
```

## Database Tables
- **users** - Authenticated admin users (via Replit Auth)
- **sessions** - Session storage for auth
- **patients** - Patient records (name, ID, contact, allergies)
- **visits** - Clinical visit records with diagnosis/treatment
- **prescriptions** - Medication prescriptions
- **invoices** - Billing with 18% VAT calculation
- **appointments** - Scheduled appointments
- **doctor_settings** - Doctor profile and clinic info
- **contact_messages** - Public contact form submissions

## Authentication
- Uses Replit Auth (OpenID Connect)
- Supports Google, GitHub, email/password login
- Admin routes protected with `isAuthenticated` middleware
- Access admin at `/admin` (requires login)

## API Endpoints

### Public (No Auth Required)
- `POST /api/contact` - Submit contact form
- `POST /api/appointments` - Book appointment from website

### Protected (Auth Required)
- `GET/POST/PATCH/DELETE /api/patients` - Patient CRUD
- `GET/POST/PATCH/DELETE /api/visits` - Visit records
- `GET/POST/PATCH/DELETE /api/prescriptions` - Prescriptions
- `GET/POST/PATCH/DELETE /api/invoices` - Invoices with VAT
- `GET/PATCH/DELETE /api/appointments` - Manage appointments
- `GET/PUT /api/settings` - Doctor settings
- `GET /api/contact` - View contact messages

## Invoicing & VAT
- 18% VAT rate automatically calculated
- Invoice number auto-generated
- Status tracking: pending, paid, cancelled
- Total = Subtotal + (Subtotal × 18%)

## Design System
- Font: Heebo (Google Fonts)
- Colors: Soft teals, whites, warm sand/beige
- RTL Hebrew layout throughout
- Dark mode ready (class-based)
- Shadcn UI components with consistent styling

## Running the App
- `npm run dev` - Start development server
- `npm run db:push` - Push schema to database
- Access public site at `/`
- Access admin at `/admin` (login required)
