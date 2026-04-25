# 👤 Ali — Authentication (Login & Register)

## Role
**Frontend Developer — Authentication Module**

## Pages & Components

### Login Page (`/login`)
- **File**: `src/components/Auth/loginUi.tsx`
- **Route**: `src/app/[locale]/login/page.tsx`

### Register Page (`/register`)
- **File**: `src/components/Auth/RegisterUi.tsx`
- **Route**: `src/app/[locale]/register/page.tsx`

### Splash Screen
- **File**: `src/components/LoadingUi.tsx`

---

## What Was Built

### 1. Login Page
- Pixel-perfect Instagram login design with phone mockup / promo image
- Form validation using `react-hook-form` (username & password required, min 6 chars)
- Show/Hide password toggle
- "Log in with Facebook" button
- "Forgot password?" link
- Redirect to Register page ("Don't have an account? Sign up")
- App Store & Google Play download badges
- Footer with Meta links and language selector

### 2. Register Page
- Instagram-style signup form with 5 fields: Email, Full Name, Username, Password, Confirm Password
- Real-time form validation (password match, min length)
- Show/Hide password toggles on both password fields
- Facebook signup option
- Terms, Privacy Policy, and Cookies Policy links
- Redirect to Login page ("Have an account? Log in")

### 3. Authentication Flow
- JWT token-based authentication via `src/api/Authenticator.ts`
- Token storage using cookies (`src/utils/token.ts`)
- Splash screen (Sileo) transition after successful login/register
- Automatic redirect to home page after authentication
- Middleware protection: unauthenticated users → login, authenticated users → blocked from login/register

---

## Technologies Used
- **React Hook Form** — form state management & validation
- **RTK Query** — API calls (`useLoginMutation`, `useRegisterMutation`)
- **next-intl** — internationalization (English, Russian, Tajik)
- **Cookies** — secure token storage
- **Next.js Middleware** (`proxy.ts`) — route protection

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/Account/login` | User login |
| POST | `/Account/register` | User registration |
