# Stride — Android social walking app

Expo SDK 58 / React Native. Version 1.2.0, Android build 6.

## What works

- Email/password signup and login, secure refresh-token storage and session restoration.
- Mandatory first setup: create a character, then claim a unique @username. Availability checks suggest alternatives when a handle is taken.
- Exact @username lookup with a player preview; send, accept, decline or cancel requests and remove friends.
- A daily steps race containing you and accepted friends, with saved characters, selected step sources and last-sync times.
- Server-backed character customization and pets using original layered SVG artwork.
- Health Connect or optional phone sensors; one selected source supplies the daily total.
- Sign-out confirmation. Explicit sample-data demo mode remains separate from real accounts.

Race days reset at midnight Asia/Karachi. While Home is foregrounded, race data refreshes every 15 seconds and the selected daily total syncs to the server. Unknown or unreadable totals are never fabricated as zero. Phone counting can continue through its native foreground service; network uploads occur while Home is open. Experimental accelerometer estimates are labeled.

## Connect and run

Use Node 24. Set the public API address in .env:

```sh
EXPO_PUBLIC_API_URL=https://your-api-host.example/api/v1
npm ci
npx expo start
```

The matching server must apply migrations 001 and 002 first. Real account controls are disabled without an API address; the labeled demo still works. Restart Expo after environment changes. Physical phones require a reachable HTTPS API. Native Android requests do not require CORS; real API testing in a browser needs same-origin hosting or an allowed browser origin.

Health Connect and the custom sensor module require an Android development or standalone build, not Expo Go. See [HEALTH-CONNECT.md](HEALTH-CONNECT.md) for permissions and [STEP-TRACKING-RESEARCH.md](STEP-TRACKING-RESEARCH.md) for counting policy and validation limits.

## Build and check

```sh
npm run typecheck
npm run lint
npm test
npm run test:ui
npx expo export --platform android
npm run export:web
npx eas-cli@latest build --platform android --profile preview
```

The preview EAS profile produces an APK; production produces an Android App Bundle. Cloud builds require an Expo account, configured project and signing credentials. Those are not provisioned by this repository. Preserve the existing signing key and package identity when updating installed copies. Before a public release, replace the provisional package ID with one you control and validate on physical phones. A JavaScript export is not an APK or device test.

[VERIFICATION.md](VERIFICATION.md) records checks and remaining device work. [DESIGN.md](DESIGN.md) records the existing theme; src/lib/palette.ts and AppButton own shared colors and button finishes.

## Source map

- src/app/: authentication, setup, friends, requests, profile, creator and Home.
- src/lib/client.ts: API transport, token rotation, lookup and race contracts.
- src/lib/session.tsx: authenticated account state.
- src/lib/character/: catalog, original artwork, fixed choice previews and account appearance.
- src/lib/health/: permission-aware reads and source selection.
- modules/stride-steps/: native sensor service and pure Java accounting core.
- plugins/: generated Android configuration and privacy explanation.
- test/: unit and UI checks.

Generated character design sheets are excluded from Git. Recreate them with node --import tsx scripts/export-character-art.ts. App fonts retain their bundled license.
