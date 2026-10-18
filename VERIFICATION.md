# Verification status

## Passed

- TypeScript type checking and Expo ESLint.
- Ten client tests: secure-store adapter contract, single-flight refresh, invalid-session cleanup,
  offline token retention, logout cleanup, pagination, API errors, health, and demo changes.
- Live local HTTP integration: the mobile API client against Express v1 and embedded PostgreSQL.
- Expo Android JavaScript export (Hermes bundle). This is not an APK build.
- Expo web export and browser interaction tests at phone sizes, in light and dark themes.
- Browser demo flows: enter demo, accept a request, cancel a request, send a new invitation,
  edit display name, remove a friend, and leave demo back to sign-in.
- Backend GitHub CI: 21 integration tests against PostgreSQL 17.

The browser flow test found and fixed a root-route collision that prevented leaving the demo;
the friends tab now has a distinct /friends route. Inputs have explicit accessibility labels.

## Native validation remains open

The Impeccable finish reviewer returned **recapture**, because no Android emulator or physical
device screenshots were available. The browser captures were explicitly identified as surrogate
evidence, and no native approval was issued. Native keyboard behavior, system insets, Back gestures,
TalkBack, enlarged system font sizes, SecureStore behavior, performance, and APK installation are
not verified. Android phone captures in both themes at 1.0 and 1.3 font scale are still needed.

At that initial verification, there was no hosted real API, signed installable APK, or app-store release. Later APK builds are documented in HEALTH-CONNECT.md; the backend remains unhosted.
The hosted browser preview uses local synthetic data only.

## Asset provenance

`assets/stride-mark.svg` is original code-authored geometric artwork. The app icon,
adaptive foreground, monochrome icon, and favicon PNGs were deterministically rendered from
that geometry using Sharp. They are not generated photographs or third-party character assets.
Material Community Icons are supplied by @expo/vector-icons under their upstream license.

## Palette and password revision

Six additional palette contrast tests cover text, controls, and four avatar color pairs in
each theme. Native component tests cover a visible SVG eye and show/hide masking on both
sign-in and registration. No icon font is required for that control. Physical-device testing
remains open; these component checks do not grant native release approval.

## Light-only update

Dark mode removed by user request. Runtime theme and native appearance configuration
are pinned to light; phone/browser dark preference cannot select the former navy theme.

## Phone sensor fallback v1.1.0

The Android service and its hardware/experimental sensor paths are native source under `modules/stride-steps`. The same Java accounting and detector core is exercised by `scripts/test-phone-core.sh`. Thirty checks cover event baselines, stale/duplicate readings, day changes, reboots, counter resets, pauses, timezone/clock changes and synthetic signal behavior. A public real-acceleration recording was replayed unchanged and decimated, explicitly without a validated per-file ground-truth match. These are not physical accuracy measurements.

Six hook tests exercise selected-source isolation, source replacement, retained paused totals, denied permissions, separate experimental opt-in failed native snapshots and repeated Start taps. The other 57 existing JS/component checks remain in the suite. Type checking, lint and web export are required. Internal browser captures at 393 and 320 pixels show the step menu without horizontal overflow; browser captures do not prove native behavior.

Physical-device sensor reliability, native permission dialogs, notification Stop, background/screen-off behavior, reboot recovery and OEM battery restrictions still require phone verification. No native-device approval or real-world accuracy percentage is claimed. See STEP-TRACKING-RESEARCH.md for the primary research and test protocol.

The prebuild entry-point safeguard verifies the canonical app namespace and neutralizes leftover `com.helloworld` template entry points. Two filesystem regression checks ensure canonical/unrelated sources are preserved and cleanup fails safely if replacements are missing. The suite now contains 35 Node checks, 30 component/hook checks and 30 native-core checks (95 total).

## Verified APK: 1.1.0 (5)

Android release build completed successfully on 18 October 2026. APK size: 32,400,671 bytes, arm64-v8a. SHA-256: `a2b2f2078d6571d0a25941de21b4f8f803f7a0e80d6c3f192c30b71ff256402f`.

Verified ZIP integrity, packaged version and permissions, native module ID and service/receiver components, current source labels in the bundled code, the exact bundled Lilita One font and OFL license, arm64 native libraries and 16 KB ZIP alignment. Android's APK signature verifier passed; the signing certificate matches the previous APK, so this can update it without uninstalling. App data backup is disabled. No Health Connect write, body-sensor or location permission is present.

[GitHub CI for the compiled source](https://github.com/iMuhammadWali/stompers-clone-android/actions/runs/39092153872) passed. The native accounting/signal checks were also run locally using the production Java core. The combined automated total is 95 checks. These results verify software/build behavior, not measured physical-device accuracy. The physical validation items above remain outstanding.
