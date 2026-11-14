# Calisthenics Coach (Version 2.0)

Production-ready mobile coaching application built with **React Native**, **Expo SDK 58**, **Expo Router**, and **Supabase**.

---

## 🎨 Visual Identity & Design System

The application strictly adheres to the approved light-theme design direction specified in [`docs/design.md`](docs/design.md):

- **Cascading White (Background)**: `#F6F6F6`
- **Chinese Silver (Lavender Surface)**: `#E0DBF3`
- **Brand Purple (Primary Strong)**: `#8B70D6`
- **Deep Purple (Primary Deep / Pressed)**: `#6E55B8`
- **Crunch (Accent Warm Orange)**: `#F3BA60`
- **Dreamland (Muted Secondary Surface)**: `#B6B1C0`
- **Warm Haze (Secondary Text)**: `#736A6A`
- **Lead (Charcoal Text)**: `#202022`

No dark neon or 3D-first interfaces are used.

---

## 🏗 Architecture & Stack

- **Mobile Framework**: React Native 0.88.1 + Expo SDK 58
- **Language**: TypeScript with `strict: true`
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Supabase (`kokhppbpuzzkntvgsctf`) Auth, PostgreSQL, Storage, Edge Functions
- **Local Persistence**: `expo-secure-store`
- **Server State**: `@tanstack/react-query`
- **Client State**: `zustand` (transient UI only)
- **Forms & Validation**: `react-hook-form` + `zod`
- **UI Motion**: `react-native-reanimated`
- **2D Animation**: `lottie-react-native` with static fallback for reduced-motion accessibility
- **Icons**: `lucide-react-native`

---

## 📂 Project Structure

```text
calisthenics-coach/
├── app/                          # Expo Router routes
│   ├── _layout.tsx               # Root provider stack (QueryClient, SafeArea)
│   ├── index.tsx                 # Main entry screen
│   ├── animation-demo.tsx        # Phase 0 Motion & Theme showcase
│   ├── (auth)/                   # Authentication routes shell
│   ├── (onboarding)/             # Onboarding flow shell
│   └── (tabs)/                   # 5-tab navigation shell (Home, Plan, Library, Progress, Profile)
├── src/
│   ├── components/
│   │   ├── ui/                   # AppButton, AppText, AppCard, AppInput, ProgressBar, SelectionCard
│   │   ├── cards/                # AnimatedCard (Reanimated)
│   │   ├── feedback/             # LoadingState, EmptyState, ErrorState
│   │   └── layout/               # ScreenContainer
│   ├── features/                 # Modular domain features
│   ├── domain/                   # Models, schemas, business rules
│   ├── services/                 # Supabase client with SecureStore adapter
│   ├── animations/               # Lottie vector player, motion config, sample assets
│   ├── hooks/                    # useReducedMotion
│   └── theme/                    # colors, typography, spacing, radii, shadows
├── assets/                       # Static fonts, icons, illustrations, animations
├── docs/                         # Project source of truth (prd, architecture, rules, phases, design, memory)
├── tests/
│   ├── unit/                     # Jest unit test suites
│   ├── integration/
│   └── e2e/
├── .env.example                  # Environment variable template
├── app.config.ts                 # Dynamic Expo configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are populated.

### 3. Available Scripts
- `npm start`: Start Expo Metro development server.
- `npm run android`: Launch on Android device / emulator.
- `npm run ios`: Launch on iOS simulator.
- `npm run web`: Launch web preview.
- `npm run typecheck`: Run TypeScript compiler type checking (`tsc --noEmit`).
- `npm run lint`: Run ESLint check.
- `npm test`: Run Jest unit tests.

---

## 📋 Verification & Phase 0 Status

Phase 0 — Foundation and Design System has been completed and verified against all exit criteria:
- **TypeScript**: 0 errors (`npm run typecheck`)
- **ESLint**: 0 errors (`npm run lint`)
- **Unit Tests**: All suites passing (`npm test`)
- **2D Motion & Fallback**: Verified via `app/animation-demo.tsx`
- **Memory Log**: Tracked in [`docs/memory.md`](docs/memory.md)
