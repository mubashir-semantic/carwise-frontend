# CarWise Frontend

The web application for CarWise, a vehicle care dashboard that helps drivers manage vehicles, service records, expenses, account settings, and notifications in one place.

Built with Next.js App Router, React, TypeScript, Tailwind CSS, Axios, React Hook Form, and Zod.

## Features

- Responsive dashboard with desktop sidebar and mobile navigation
- Signup, login, email OTP verification, forgot-password, and reset-password flows
- JWT-aware API client with automatic access-token attachment
- Vehicle listing and add-vehicle flow
- Expense history listing and expense detail views
- Service history grouped by status
- Profile editing, avatar support, password change, and logout
- Light and dark theme support
- Form validation with React Hook Form and Zod
- Toast-based feedback for API actions

## Tech Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Axios for API requests
- React Hook Form and Zod for forms and validation
- `next-themes` for theme switching

## Getting Started

### Prerequisites

- Node.js 20 or newer recommended
- npm
- The CarWise backend running locally or a deployed API URL

### Installation

```bash
cd carwise-frontend
npm install
```

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

When omitted, the application uses `http://localhost:5000/api/v1` by default. Only expose public, non-secret configuration through `NEXT_PUBLIC_*` variables.

### Run Locally

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Routes

### Authentication

| Route | Purpose |
| --- | --- |
| `/login` | Sign in to an existing account |
| `/signup` | Create a new account |
| `/otp` | Verify an email address with an OTP |
| `/forgot-password` | Request a password-reset OTP |
| `/reset-password` | Set a new password |
| `/change-password` | Change the password for a signed-in user |
| `/password-success` | Password flow confirmation |

### Dashboard

| Route | Purpose |
| --- | --- |
| `/dashboard` | Overview and vehicle status |
| `/dashboard/expense` | Expense history |
| `/dashboard/expense/[id]` | Expense detail view |
| `/dashboard/service-history` | Service history and statuses |
| `/dashboard/settings` | Profile, security, and account settings |
| `/dashboard/notifications` | Notifications view |

## API Integration

The shared Axios client lives in [`src/services/api.ts`](src/services/api.ts). It:

- Uses `NEXT_PUBLIC_API_URL` as its base URL.
- Reads `accessToken` from browser `localStorage` and sends it as a Bearer token.
- Handles concurrent unauthorized requests through a refresh queue.
- Clears local tokens and redirects to `/login` when authentication recovery fails.

The backend API documentation is available in [`../carwise-backend/README.md`](../carwise-backend/README.md), with Swagger available at `/api/docs` when the backend is running.

## Project Structure

```text
src/
├── app/             # App Router pages, layouts, and dashboard sections
├── components/      # Shared UI and modal components
├── constants/       # Colors and local display data
├── services/        # API clients and integration helpers
├── utilities/       # Form validation and shared utilities
├── hooks/            # Reusable React hooks
├── layouts/          # Layout-level components
└── types/            # Shared TypeScript types
```

See [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md) for a more detailed tree of the application.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm start        # Serve the production build
npm run lint     # Run ESLint
```

## Development Notes

- Auth tokens are currently stored in browser `localStorage`; consider an httpOnly cookie strategy for production security.
- Some dashboard content is currently local or demo data while backend support is being completed.
- The frontend refresh request currently targets `/auth/refresh`; the backend controller exposes `/auth/refresh-token`. Keep these paths aligned when enabling automatic token refresh.
- The frontend requests `/vehicles/:id` for the expense detail experience, but the current backend exposes collection-level vehicle endpoints only.

## Related Project

The NestJS API is in [`../carwise-backend`](../carwise-backend).
