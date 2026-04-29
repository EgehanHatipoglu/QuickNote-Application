# QuickNote 📝

A minimal, clean mobile note-taking app built with **React Native CLI** — designed for quickly jotting down notes while shopping.

> **Intern Case Study** — PRT-CASE-MOBİL | Pratech

---

## Screenshots

| Home (with notes) | Add Note | Note Detail | Empty State |
|:-:|:-:|:-:|:-:|
| FlatList + search + dark toggle | Category chips + validation | Stats bar + swipe-delete | Illustration + hint chip |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.73 (CLI) |
| Navigation | React Navigation v6 (Native Stack) |
| State | `useState` — all notes in `App.tsx`, passed via props |
| Dark Mode | `ThemeContext` — full light/dark palette, toggle in header |
| Language | TypeScript |
| Design | Custom design-system tokens (colors, spacing, radius, shadows) |

---

## Project Structure

```
QuickNote/
├── App.tsx                              # Root — note state + seed data
├── src/
│   ├── types/
│   │   └── index.ts                    # Note & RootStackParamList types
│   ├── theme/
│   │   └── index.ts                    # Typography, Spacing, Radius, Shadow tokens
│   ├── context/
│   │   └── ThemeContext.tsx            # LightColors + DarkColors + useTheme hook
│   ├── components/
│   │   ├── Button.tsx                  # Primary / Ghost / Danger variants
│   │   ├── NoteCard.tsx                # Card + colored tag + swipe-to-delete (PanResponder)
│   │   ├── EmptyState.tsx              # Illustrated empty state + hint chip
│   │   └── CategoryChips.tsx           # Shopping / List / Health / Other selector
│   ├── screens/
│   │   ├── HomeScreen.tsx              # FlatList + live search + FAB + theme toggle
│   │   ├── AddNoteScreen.tsx           # Form with validation + char counter
│   │   ├── EditNoteScreen.tsx          # Pre-populated form + isDirty tracking (BONUS)
│   │   └── NoteDetailScreen.tsx        # Full view + stats bar + delete
│   └── navigation/
│       └── AppNavigator.tsx            # Stack navigator (Home → Add / Edit / Detail)
```

---

## Prerequisites

- **Node.js** ≥ 18
- **React Native CLI** environment set up:
  - [Android] Android Studio + SDK + emulator
  - [iOS] Xcode + CocoaPods (macOS only)

Full setup guide: https://reactnative.dev/docs/environment-setup

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd QuickNote
npm install
```

### 2. iOS (macOS only)

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### 3. Android

```bash
# Start an emulator first (Android Studio → Device Manager)
npx react-native run-android
```

### 4. Start Metro bundler (if not auto-started)

```bash
npx react-native start
```

> **Tip:** The app launches with 3 seed notes so you can immediately see the list, cards, and swipe-to-delete. Delete them all to see the Empty State illustration.

---

## Features

### Core (Required)
- ✅ **3+ Screens** — Home, Add Note, Note Detail (+ Edit Note)
- ✅ **React Navigation** — Native stack, `headerShown: false`, custom nav bars
- ✅ **useState** — All notes managed at root, passed as props (no external state lib)
- ✅ **FlatList** — Virtualized note list with `keyExtractor`
- ✅ **Empty State** — Custom illustration shown when note list is empty

### UX Extras
- ✅ **Live search** — `useMemo` filtered by title or content in real time
- ✅ **Category chips** — Shopping / List / Health / Other (color-coded left tag on card)
- ✅ **Character counter** — Warns at 90 % of the 500-char limit
- ✅ **Discard alert** — Confirms before discarding unsaved note
- ✅ **Stats bar** — Word count, character count, estimated read time on Detail screen
- ✅ **KeyboardAvoidingView** — Inputs stay visible when the keyboard opens

### Bonus
- ✅ **Dark mode** — Full `ThemeContext` with `LightColors` + `DarkColors` palettes; ☀️/🌙 toggle in the Home header; all screens and components are theme-aware
- ✅ **Edit note (Edit screen)** — `EditNoteScreen` pre-populates from the existing note; `isDirty` tracking disables the Update button until a change is made; Discard Changes alert on back
- ✅ **Swipe-to-delete** — `PanResponder` in `NoteCard`; swipe left to reveal delete panel; tap to confirm with Alert; fly-out animation on confirm

---

## Design System

| Token | Values |
|---|---|
| Primary | `#6C63FF` (light) / `#8680FF` (dark) |
| Accent | `#FF6D80` |
| Success | `#33C78E` |
| Background | `#F6F6F9` (light) / `#0E0E1A` (dark) |
| Radius scale | 8 / 12 / 16 / 24 / 999 px |
| Spacing scale | 4 / 8 / 16 / 24 / 32 px |

Typography: System font (San Francisco on iOS, Roboto on Android)

---

## Submission

- **Figma:** https://www.figma.com/design/XOr7xvkrpBPCDzEqRtVvRe/QuickNote-—-UI-UX-Design
- **GitHub:** [Repository link with this README and app.json visible]
- **Email:** seyit@pratech.tr
- **Subject:** `PRT-CASE-MOBİL – [Ad Soyad]`
