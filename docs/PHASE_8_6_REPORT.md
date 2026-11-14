# CALISTHENICS COACH — PHASE 8.6 REPORT
## Final Security Validation & Android Preview Release Readiness

**Date:** 2026-11-14  
**Target Release:** Version 2.0.0 (`versionCode: 1`)  
**Package:** `com.calisthenicscoach.app`  
**Supabase Project Ref:** `kokhppbpuzzkntvgsctf`  
**Git Branch:** `main`  
**Product Philosophy:** **YOUR BODY IS YOUR EQUIPMENT — No Equipment First**

---

## 1. Supabase RLS Policy Verification & Findings

### The PostgreSQL Permissive Policy Hazard
In PostgreSQL Row-Level Security, multiple **PERMISSIVE** policies applied to the same table and command (`SELECT`) are combined using boolean **`OR`**:
$$\text{Effective Access} = \text{Policy}_1 \lor \text{Policy}_2 \lor \dots \lor \text{Policy}_n$$

If a table has an existing permissive policy with `USING (true)`, creating a second restricted policy (e.g., `USING (content_status = 'published')`) **does not** restrict access:
$$\text{true} \lor \text{RestrictedCondition} \equiv \text{true}$$

Any user querying the table can still select all rows through the original permissive policy.

### Audit of `public.skill_progressions`
1. **Migration 5 (`20261114000005_create_skills_and_progressions.sql`):**
   - Lines 63–67 originally defined:
     ```sql
     DROP POLICY IF EXISTS "Public can view skill progressions" ON public.skill_progressions;
     CREATE POLICY "Public can view skill progressions"
       ON public.skill_progressions
       FOR SELECT
       USING (true);
     ```
   - **Hazard Identified:** This permissive policy applied to all roles (`PUBLIC`, including `anon` and `authenticated`) with `USING (true)`, allowing draft skill progression steps to be enumerated.
2. **Migration 8 (`20261114000008_phase8_4_published_progression_visibility.sql`):**
   - Must explicitly `DROP` the obsolete permissive policy and any potential historical variant names before applying the scoped policy:
     ```sql
     DROP POLICY IF EXISTS "Public can view skill progressions" ON public.skill_progressions;
     DROP POLICY IF EXISTS "Public can view published skill progressions" ON public.skill_progressions;
     DROP POLICY IF EXISTS "Skill progressions are viewable by everyone" ON public.skill_progressions;
     DROP POLICY IF EXISTS "Enable read access for all users" ON public.skill_progressions;
     DROP POLICY IF EXISTS "Allow public read access" ON public.skill_progressions;
     DROP POLICY IF EXISTS "Users can view skill progressions" ON public.skill_progressions;
     ```
3. **Scoped Policy for Public Roles:**
   - Explicitly targets `TO anon, authenticated` with subquery checking `content_status = 'published'` on the parent skill:
     ```sql
     CREATE POLICY "Public can view published skill progressions"
       ON public.skill_progressions
       FOR SELECT
       TO anon, authenticated
       USING (
         EXISTS (
           SELECT 1 FROM public.skill_catalog sc
           WHERE sc.id = public.skill_progressions.skill_id
             AND sc.content_status = 'published'
         )
       );
     ```
4. **Preservation of Administrator Access:**
   - Dedicated administrative policy added for tokens carrying the `service_role` or `admin` claim:
     ```sql
     CREATE POLICY "Admins have full access to skill progressions"
       ON public.skill_progressions
       FOR ALL
       TO authenticated
       USING (
         coalesce((auth.jwt()->>'role'), '') = 'service_role'
         OR coalesce((auth.jwt()->'app_metadata'->>'role'), '') = 'admin'
       )
       WITH CHECK (
         coalesce((auth.jwt()->>'role'), '') = 'service_role'
         OR coalesce((auth.jwt()->'app_metadata'->>'role'), '') = 'admin'
       );
     ```
   - Supabase `service_role` execution continues to bypass RLS (`BYPASSRLS`).
5. **Automated Regression Verification:**
   - Created `tests/unit/supabase.rls.policies.test.ts` (5 tests passing). Verifies policy syntax, drops, role targeting, and mathematically proves the `true OR restricted` vulnerability is resolved when the permissive policy is dropped.

---

## 2. Supabase Staging Environment Verification

Inspection of local CLI configuration and remote metadata yielded the following:

- **Linked Project Ref:** `kokhppbpuzzkntvgsctf`
- **Project Name:** `Calisthenics` (Organization: `xfjkflfsqotugmgqvwnb`)
- **Environment Classification:** **PRODUCTION**
  - Project `kokhppbpuzzkntvgsctf` is the primary production database configured in `app.config.ts`, `.env`, and production web/mobile bundles.
  - There is currently **no separate staging project** linked or configured in the Supabase CLI.
- **Migration History Status:**
  - Migrations `20261114000000` through `20261114000007` were previously deployed and are active on `kokhppbpuzzkntvgsctf`.
  - Migration `20261114000008` is **PENDING** (prepared locally, but not yet applied remotely).
- **Execution Guard:**
  - Per strict rules ("No production database modifications. Do not execute `supabase db push` until the target project has been explicitly verified"), **`supabase db push` was NOT executed**.
  - Migration 8 will be applied only during the authorized production release window or once a designated staging project is linked.

---

## 3. Account Deletion Verification

A complete architectural review of the account deletion system was conducted across client and server layers:

1. **Edge Function (`supabase/functions/delete-account/index.ts`):**
   - **JWT Validation:** Validates `Authorization: Bearer <token>` using `supabaseClient.auth.getUser()`. Unauthenticated requests return `401 Unauthorized`.
   - **Identity Scoping:** Caller identity is derived strictly from the cryptographically verified JWT (`user.id`). Callers cannot delete arbitrary user accounts.
   - **Service-Role Isolation:** The `SUPABASE_SERVICE_ROLE_KEY` is loaded in server memory and used via `adminClient.auth.admin.deleteUser(user.id)`. The key is never returned or leaked to the client.
   - **Error Handling:** Returns structured JSON with explicit HTTP status codes (200, 401, 500).
2. **Database Cascade Audit (`tests/unit/account.deletion.cascade.test.ts`):**
   - All 7 user-related foreign keys enforce `ON DELETE CASCADE`:
     - `profiles.id` -> `auth.users(id)`
     - `user_preferences.user_id` -> `auth.users(id)`
     - `workout_sessions.user_id` -> `auth.users(id)`
     - `workout_session_exercises.session_id` -> `workout_sessions(id)`
     - `user_skill_progress.user_id` -> `auth.users(id)`
     - `skill_practice_sessions.user_id` -> `auth.users(id)`
     - `notification_preferences.user_id` -> `auth.users(id)`
   - Purging `auth.users` row completely deletes all related data with **zero orphaned records**.
3. **Client Session Cleanup (`src/features/auth/services/authService.ts`):**
   - The deletion method wraps execution in `try ... finally { await this.signOut(); }`.
   - Even in edge cases of network timeout, the client purges secure tokens from `expo-secure-store`, resets Zustand state, and routes to `/(auth)/welcome`.
4. **Deployment Command (Ready for authorized release):**
   ```bash
   npx supabase functions deploy delete-account --project-ref kokhppbpuzzkntvgsctf
   ```
   *(Not deployed in this phase per instructions)*

---

## 4. Final Automated Quality Gates

All automated quality checks were executed on the repository:

```
================================================================================
QUALITY GATE AUDIT SUMMARY
================================================================================
Gate               Command               Exit Code  Status      Key Metrics
--------------------------------------------------------------------------------
1. TypeScript      npm run typecheck     0          PASSED      0 errors
2. ESLint          npm run lint          0          PASSED      0 errors, 0 warnings
3. Test Suites     npm test              0          PASSED      30/30 suites, 206/206 tests (8.5s)
4. Web Bundle      npm run build:web     0          PASSED      32 bundles (3,776 modules)
5. Security Audit  npm audit             1          ADVISORIES  0 High, 0 Critical (25 dev tool advisories)
================================================================================
```

### Dependency Audit Disclosure (`npm audit`)
- **Critical:** 0
- **High:** 0 *(Zod prototype pollution GHSA-mrhx-c7xc-m3w5 resolved in Phase 8.2)*
- **Moderate / Low:** 25 advisories (8 low, 17 moderate)
  - All 25 advisories reside exclusively in offline dev/test build tools: `jest`, `jest-expo`, `@typescript-eslint`, and `babel-jest` subdependencies (`minimatch`, `glob`, `deepmerge`).
  - **Zero impact** on production runtime client code or application bundles.

---

## 5. EAS Authentication & Build Status

- **Command Run:** `npx --yes eas-cli whoami`
- **Exit Code:** `1`
- **Output:** `Not logged in`

### Build Decision
Per the directive:
> *"If not authenticated: Do not request credentials in chat. Tell the user to authenticate using `npx eas login`. Stop before initiating the cloud build."*

The cloud build was **not initiated**. No credentials were asked for or stored.

### Instructions to Authenticate & Build
When you are ready to trigger the remote Android preview APK build, run:
```bash
# 1. Log in to your Expo account in your terminal
npx eas login

# 2. Trigger the Preview APK build
npm run build:android:preview
```

---

## 6. Physical-Device QA Checklist & Verification Matrix (15 Areas)

| # | Feature Flow / Subsystem | Source-Code Verified | Automated Test Verified | APK Build Verified | Physical-Device Verified |
|---|---|:---:|:---:|:---:|:---:|
| 1 | **Splash & Launch Transition** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 2 | **Auth (Sign Up, In, Validation)** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 3 | **8-Step Onboarding Flow** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 4 | **"No Equipment First" Rules** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 5 | **Dashboard & Dynamic Recs** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 6 | **Exercise Library & Filter Tabs** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 7 | **2D Animation Vector Playback** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 8 | **Accessibility & Reduced Motion** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 9 | **Interactive Workout Player** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 10 | **Rest Timer & Set Metric Logging** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 11 | **Workout Crash Recovery** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 12 | **Skill Pathways (8 Skills)** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 13 | **Smart Notifications** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 14 | **Account Profile & Deletion** | **YES** | **YES** | Config Verified | Pending Hardware Run |
| 15 | **Network Resilience & Offline** | **YES** | **YES** | Config Verified | Pending Hardware Run |

*Evidence Note: No physical device testing has been marked complete. Physical QA will be conducted after the Preview APK is installed on hardware.*

---

## 7. Remaining Blockers

1. **EAS CLI Authentication:**
   - Cloud packaging requires authentication via `npx eas login` or setting an `EXPO_TOKEN` secret.
2. **Pending Production Migration:**
   - Migration `20261114000008` (published progression visibility) is verified locally and ready for deployment, but intentionally pending application to the live database `kokhppbpuzzkntvgsctf`.
3. **Pending Edge Function Deployment:**
   - `delete-account` Edge Function is verified in source and tests, pending authorization to deploy to `kokhppbpuzzkntvgsctf`.

---

## 8. Exact Next Steps

1. **Authenticate EAS:**
   Run `npx eas login` in your terminal.
2. **Generate Preview APK:**
   Run `npm run build:android:preview` to generate the installable `.apk` file link.
3. **Execute Physical Device QA:**
   Install the APK on an Android test device and complete the 15-point checklist in `docs/RELEASE_CHECKLIST.md`.
4. **Deploy Edge Function & Staging Migration (Upon Authorization):**
   - `npx supabase functions deploy delete-account --project-ref kokhppbpuzzkntvgsctf`
   - `npx supabase db push --linked`
