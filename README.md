# Stride — Android frontend v1

React Native + Expo SDK 58 + Expo Router + Material 3 components. A working mobile
frontend for the existing authentication and friends API. Stride is a temporary name.

## Included

- Sign in and registration, with password visibility and input validation.
- Friends list, local search, request invitations, incoming accept/decline, outgoing cancellation,
  friendship removal with confirmation, and pull-to-refresh.
- Profile editing and logout.
- Fixed light theme, safe-area handling, keyboard avoidance on forms, and accessible labels.
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
contrast in the active light theme.

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

The app intentionally ignores system dark mode. Expo userInterfaceStyle is light, the Paper
provider always uses MD3LightTheme, and status bar content is dark.

## Theme editing

`src/lib/palette.ts` is the single source for application colors. Change
`brandColors.action` to recolor every primary button, `actionText` for its labels,
`selection` / `selectionText` for tonal buttons, and `ink` for main text and quiet actions.
Other shared surfaces, outlines, errors, and avatars are defined in the same file.
The root PaperProvider applies this palette across all screens; appearance stays light.

Every application button uses `src/components/AppButton.tsx`. This shared component
maps existing button modes to theme roles and leaves layout, loading, accessibility,
and disabled behavior with Paper. Screens should not repeat default button colors.
For an intentional one-off exception, pass `buttonColor` and `textColor` to AppButton;
it will not change other buttons. For example:

```tsx
// Change all primary buttons in palette.ts:
export const brandColors = { action: '#FFAD1F', /* other existing values */ };

// One exceptional button, using another shared palette role:
<AppButton mode="contained" buttonColor={theme.colors.tertiaryContainer}
  textColor={theme.colors.onTertiaryContainer}>Special action</AppButton>
```

When changing colors, run `npm test` for contrast checks and `npm run test:ui`
for shared theme propagation and password visibility checks.

### Primary button finish

Enabled primary and tonal buttons share a static gloss: a white highlight fading down from the
top, a small side glint, a darker lower edge, and a charcoal outline. Text, outlined,
and disabled buttons stay flat. The decorative overlay ignores touch and is hidden
from accessibility. Paper retains the actual press target, ripple, and loading state.
`buttonFinish` in `src/lib/palette.ts` controls intensity, edges, corner radius, and
an application-wide enable switch. `glossy={false}` opts out for one AppButton.
Changing `brandColors.action` still recolors every primary button, including glossy ones.

## Character, pets, and track

Home → Make it yours opens the creator. Changes preview instantly; Save look commits them
and returns to the track. Back discards the draft. Preview walk starts a small eight-pose
loop; Pause and leaving the screen stop it. Reduced-motion preferences keep the art still.

- `src/lib/character/catalog.ts`: stable option IDs, palettes, defaults, and storage validation.
- `src/lib/character/artwork.ts`: original layered SVG rig, pet designs, and side-on track.
- `src/lib/character/appearance.tsx`: account-scoped local appearance storage and state.
- `src/components/character/TrackScene.tsx`: shared native/web scene and optional animation.
- `assets/characters/design-sheet.svg`: reproducible design sheet. Rebuild with
  `node --import tsx scripts/export-character-art.ts`.

The artwork is authored in code; it uses no extracted Stompers assets or remote image URLs.
Separate hair, skin, clothing, face, limbs, and pet layers support independent customization.
This version uses one shared animated rig with interchangeable facial features and two base face/fit variants. Pets are visual companions; there is no pet
inventory, gameplay, real step tracking, or server appearance sync yet. Cosmetic choices
persist in browser localStorage for the preview and SecureStore on native devices, keyed
by account. Authentication tokens keep their existing separate storage behavior.

The character defaults to a walking contact pose with explicit hands, elbows, and
separated feet. `assets/characters/pose-sheet.svg` shows all eight walk poses and is
regenerated alongside the track design sheet by the existing export-character-art script.
Each animal companion has four offset leg and paw layers; the saucer hovers.

Layering correction: both leg layers render before the shorts, so the near thigh cannot
erase its trouser leg. Sleeves attach along each upper arm. The resting stride is narrower,
and character/pet offsets align foot contact with their ground shadows. Pet front paws
have additional horizontal separation so they do not merge in the default pose.

## Expanded creator

The creator is grouped into Look, Face, Clothes, and Pet sections. New independent options:
4 eyes (Round, Almond, Relaxed, Sparkle), 3 noses (Minimal nose, Button nose, Soft bridge),
5 expressions (Smile, Grin, Calm, Determined, Surprised), 4 shirt styles (Classic tee,
Striped, Raglan, Hoodie), and Male/Female base face and fit variants.
Hairstyles are separate catalogs with six styles per gender. Raglan shirts are male-only;
Striped shirts are female-only. Classic tee and Hoodie are shared. Colors,
eyes, noses, expressions, and pets remain available to everyone.
Shirt style and outfit color are separate choices; hoodie sleeves are drawn before hands.
Old appearance records receive defaults for missing fields without losing their saved choices.
The same device-local storage key is retained, with no backend migration required.
`assets/characters/features-sheet.svg` is generated by the existing artwork export script.

Gender eligibility is centralized in `styleAvailability` in catalog.ts. The UI filters by
those rules; parseAppearance applies the same rules to stored data. Switching gender
selects an eligible hairstyle and Classic tee when a style becomes incompatible, and
shows an inline explanation. Other selections stay unchanged. Legacy nose IDs map to
Minimal nose, Soft bridge, and Button nose respectively; Button nose is the default.

Character choices use artwork-only tiles with accessible names and selection checks.
Face previews zoom into the selected feature. Shirts use plain fabric, broad clipped
stripes, raglan seams, or a tonal hoodie pocket.

### Creator usability refinement
Only Male and Female are offered; both have visible labels and distinct representative
portraits. Old records with the retired third option migrate to Male by default, or
Female if a saved female-specific style is present, keeping other valid choices.
The editor preview crops empty sky without changing the Home track. Category controls
wrap at narrow widths or larger system text sizes; gender labels can wrap and grow their
cards. Selection uses both a border and check, not color alone. Save is enabled only
for changes; Reset changes restores the saved look.

HCI rationale and verification limits are recorded in DESIGN.md.

Catalog thumbnails are fixed samples, independent of the current draft. Hair, eyes,
nose, expression, shirt and gender artwork are generated once from a standard sample
appearance. Only the main track preview reflects current character selections.

### Pinned preview and expanded catalog
The creator passes a fixed header to Page: Back and the track preview sit outside the
options ScrollView, so neither scrolls away. Preview height follows the available window
height, clamped to 72–200 logical units. Only options and the save controls scroll.
Default skin is Sand; existing saved skin tones are preserved.

Male hair: Crop, Waves, Curls, Quiff, Side part, Spikes. Female hair: Ponytail, Bob, Bun,
Braids, Long waves, Ringlets. Catalogs do not overlap. Older female Waves/Curls looks
migrate to Long waves/Ringlets; other incompatible styles use an eligible default.
Sunglasses are independent of eyes and expression; removing them restores the selected eyes.
Companions: Biscuit (dog), Mochi (cat), Clover (rabbit), Ember (fox), Sprout (dragon),
Orbit (alien spaceship), or no companion. The saucer hovers; animal pets walk.

Fixed catalog samples include eyewear and companions.
`assets/characters/catalog-sheet.svg` records all hair, companion, and eyewear options
from the same artwork used in the UI. Tests cover fixed-preview structure, the combined
new look, legacy migration, and restoration after reopening. Native layout still needs
phone verification; no emulator or device screenshots are claimed.
