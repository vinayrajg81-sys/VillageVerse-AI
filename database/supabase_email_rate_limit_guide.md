# VillageVerse AI: Supabase Email Rate Limit Resolution Guide

## 1. Root Cause Summary
- **Error Code**: `429 Too Many Requests`
- **Error Subcode**: `over_email_send_rate_limit`
- **Error Message**: `"email rate limit exceeded"`
- **Why this happens**: Supabase projects on the Free tier use a shared default SMTP mailer that caps outgoing verification emails to **3 to 4 emails per hour**. When multiple test users sign up or when rapid submissions trigger multiple `signUp()` requests, Supabase automatically blocks outgoing emails and throws HTTP 429.

---

## 2. Instant Fix: Disable "Confirm Email" (Recommended)
By disabling email confirmation in Supabase:
1. `supabase.auth.signUp()` **stops sending emails entirely**.
2. New accounts are **instantly created and confirmed** upon submitting the form.
3. The rate limit is **100% eliminated** with zero SMTP dependencies.
4. Users get an immediate active session and are redirected directly to their role dashboard.

### Steps (Takes 10 seconds):
1. Open your Supabase Dashboard:
   👉 **[https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/auth/providers](https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/auth/providers)**
2. Click on **Email** under **Auth Providers**.
3. Scroll down and **Toggle OFF** the **"Confirm email"** switch.
4. Click **Save**.

---

## 3. Alternative Fix: Custom SMTP Configuration
If you want to send real verification emails without the 3-email/hr rate limit:
1. Go to **Project Settings** &rarr; **Authentication** &rarr; **SMTP Settings**:
   👉 **[https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/settings/auth](https://supabase.com/dashboard/project/phfrwlxssexgltvpvgap/settings/auth)**
2. Toggle **Enable Custom SMTP**.
3. Enter credentials from a transactional email provider:
   - **Resend** (Recommended, 100 free emails/day)
   - **SendGrid** / **Brevo** / **Amazon SES** / **Gmail App Password**
4. Click **Save**.

---

## 4. Frontend Protections Implemented
1. **Duplicate Request Prevention**:
   - Synchronous `useRef(false)` locks in `Signup.tsx` and `Login.tsx` prevent double-clicks and rapid enter-key presses from triggering concurrent auth requests.
   - Client-side cooldown timers prevent rapid API spamming.
2. **Duplicate Account Handling**:
   - Automatically detects if an email is already registered (`identities.length === 0` or duplicate error) and directs the user to sign in immediately.
3. **HTTP 429 Error Handling**:
   - Displays clear user-friendly guidance explaining the rate limit and offering instant demo login and dashboard toggle instructions.
   - Activates a live 60-second countdown timer.
4. **Resend Verification Flow**:
   - Added a "Resend Verification Email" action on both the Signup and Login pages with a 60-second debounce timer.
5. **Self-Healing User Profile Synchronization**:
   - Dual-layer profile creation: PostgreSQL `handle_new_user()` trigger on `auth.users` creates the profile on the server side, and client-side `syncProfile()` verifies and creates missing profile rows upon first login.
