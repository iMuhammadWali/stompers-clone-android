# Stride — Android frontend v1

React Native + Expo SDK 58 + Expo Router + Material 3 components. A working mobile
frontend for the existing authentication and friends API. Stride is a temporary name.

## Included

- Sign in and registration, with password visibility and input validation.
- Friends list, local search, request invitations, incoming accept/decline, outgoing cancellation,
  friendship removal with confirmation, and pull-to-refresh.
- Profile editing and logout.
- Light and dark themes, safe-area handling, keyboard avoidance on forms, and accessible labels.
- Explicitly labeled demo mode with sample people. Demo changes live only in memory and reset
  when the app restarts. No real invitation is sent and no account is created in demo mode.
- API client with timeouts, structured errors, pagination, refresh-token rotation, serialized
  refresh requests, and immediate local logout even if server revocation cannot be confirmed.
- Refresh token persistence through Expo SecureStore on Android; access tokens stay in memory.
  The web preview intentionally keeps both token types in memory.

This version has no step counting, Health Connect, groups, competitions, items, push notifications,
email verification, password recovery, social login, or account deletion. No activity metrics are
invented in the UI. Avatar circles show initials; there is no avatar-upload endpoint in API v1.

## Run

Use Node 24 and an Expo Go build compatible with SDK 58, or an Android development build.

```sh
npm ci
npx expo start
```

Leave the API URL unset to use **Explore the demo**. Real account buttons remain disabled
when the API is not configured. Expo Go must be able to reach the development server;
this workspace does not provide a persistent public Metro server or tunnel.

To connect the deployed backend, copy `.env.example` to `.env` and set:

```sh
EXPO_PUBLIC_API_URL=https://your-api-host.example/api/v1
```

Restart Expo after changing environment values. This value is public configuration, not a secret.
The physical phone needs a reachable HTTPS backend. `localhost` on a physical Android phone
means the phone itself. Android emulator host-loopback is commonly `10.0.2.2`; use a suitable
local development configuration if testing with cleartext HTTP. Production should use HTTPS.

The native Android client does not need CORS. Browser-based real-API testing requires either
same-origin proxying or an explicitly allowed browser origin on the backend. No CORS change
was made to the backend merely to support the demo preview.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run test:ui
npx expo export --platform android
npm run export:web
```

Color rationale and cited research are in COLOR-RATIONALE.md. The password eye is SVG-based
and has component tests for both masking directions. Palette tests check foreground/background
contrast in both themes.

The client tests exercise storage, shared refresh, invalid sessions, offline refresh, logout,
pagination, API errors, health, and demo friendship state. Export verifies JavaScript bundling;
it is not an APK build, emulator test, or physical-device test. The client was also exercised
over real local HTTP against the Express v1 API and embedded PostgreSQL in the build workspace.
The backend's own GitHub CI passed all 21 integration tests against PostgreSQL 17.

## APK build configuration

`eas.json` contains a `preview` profile that creates an APK, and a `production` profile that
creates an Android App Bundle. EAS requires an Expo account, project configuration, and signing
credentials. Those are not configured here, and no APK or store release is included.

```sh
npx eas-cli@latest build --platform android --profile preview
```

Before publishing, replace the provisional Android package ID `com.walkingclub.stride` with
an identifier you control, connect a permanent API, and test on an actual Android phone.

## Structure

- `src/app/`: Expo Router screens and navigation.
- `src/lib/client.ts`: API transport and authentication state.
- `src/lib/session.tsx`: UI session and data provider.
- `src/lib/demo.ts`: isolated in-memory demo implementation.
- `src/lib/storage.ts`: native secure storage and web memory adapter.
- `src/components/ui.tsx`: shared interface pieces.
- `PRODUCT.md`: scope and product context.
- `DESIGN.md`: implemented visual system.

## Impeccable

Impeccable 4.6.0 design guidance was installed locally and used for this build. Its optional
helper engine refused a download whose checksum sidecar could not be verified, so its automatic
context loader and detector were not used. Native design guidance was read directly. The attempt
to persist the skill in the remote Skills workspace failed with HTTP 422; cross-session availability
is not confirmed. No unverified engine binary was executed or included in this app.
