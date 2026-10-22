---
name: "Stride (working name)"
description: "Playful social walking app; physical-device validation remains pending."
colors:
  light-primary: "#292A31"
  light-onPrimary: "#FFFFFF"
  light-primaryContainer: "#FFAD1F"
  light-onPrimaryContainer: "#292A31"
  light-secondary: "#875000"
  light-onSecondary: "#FFFFFF"
  light-secondaryContainer: "#FFD0A3"
  light-onSecondaryContainer: "#38302A"
  light-tertiary: "#805600"
  light-onTertiary: "#FFFFFF"
  light-tertiaryContainer: "#FFE38A"
  light-onTertiaryContainer: "#40320A"
  light-background: "#F5F6F8"
  light-onBackground: "#292A31"
  light-surface: "#FFFFFF"
  light-onSurface: "#292A31"
  light-surfaceVariant: "#E7E9F0"
  light-onSurfaceVariant: "#656775"
  light-surfaceDisabled: "#E1E3E8"
  light-onSurfaceDisabled: "#6A6C75"
  light-outline: "#797C86"
  light-outlineVariant: "#DCDFE5"
  light-error: "#AC2430"
  light-onError: "#FFFFFF"
  light-errorContainer: "#FFE0E1"
  light-onErrorContainer: "#6C1420"
  light-inverseSurface: "#2D2E35"
  light-inverseOnSurface: "#FFFFFF"
  light-inversePrimary: "#6DECE4"

---
# Design System: Stride

Preserve the current always-light theme: cool gray canvas, white surfaces, charcoal text, orange primary actions, peach selections and small golden accents. src/lib/palette.ts is the color source; AppButton owns shared button colors, outlines and static gloss. Do not introduce a second theme or repeat primary button colors in screens.

Use React Native Paper text roles and outlined fields for account and directory screens. Home retains its outlined Lilita One wordmark and step total, illustrated orange track, original SVG characters and colorful navigation icons. Lilita One's license is bundled. Character catalog thumbnails are fixed samples; the main preview alone reflects draft choices.

## Layout and controls

Page owns safe areas and the scrollable column: maximum width 600, 24-unit side padding, 20-unit major gaps. Flat divided people lists remain the directory pattern. Allow text and category controls to wrap at narrow widths and larger text scales. Use touch targets of at least 48 dp.

The creator keeps the preview and Look/Face/Clothes/Pet controls above the options scroll region. Selection uses both a border and check. Existing gender/style eligibility and legacy appearance migration remain in catalog.ts. Saving outside setup syncs the account character; failed saves keep the draft available.

## Account setup

Signup asks for email and password. The first mandatory screen is character creation, followed by an exact unique @username. Keep availability status beside the field, offer unused suggestions for conflicts and recheck the server when claiming. Returning incomplete accounts resume setup. Setup can be exited through a confirmed sign-out.

The authenticated index remains a routing anchor so protected-route transitions land on the correct screen rather than an empty tabs group. Completed accounts go to Home; unfinished accounts go to setup.

## Friends and race

Find a player by exact @username and preview their public identity before sending a request. Distinguish self, existing friendship, incoming request, outgoing request and available invitation. Accepted friends automatically join each other's daily race; removing friendship removes that visibility.

Retain the personal Home stage and counter. The daily race below it shows the real accepted players, their saved original character/pet artwork, step totals and last-sync times on flat track lanes. Unknown totals stay unknown; estimates are labeled. Source changes replace totals rather than combining sources. Every player's day uses midnight Asia/Karachi.

Explain daily-total sharing during setup and in step-access guidance. Email remains private. Show loading, retry, empty and permission states without inventing activity. Demo people and absence of real step totals remain explicit.

## Sign-out

Use the themed Paper confirmation dialog with Stay signed in and Sign out actions. Clearing local credentials remains reliable even if the server is unreachable.

## Verification limits

Automated contrast checks cover the existing theme. UI tests cover the new interaction paths; browser previews establish web behavior, not Android touch, keyboard, font or sensor accuracy. Physical-device testing remains required before distribution. See VERIFICATION.md.

## Shared track and sizing
The home race contains accepted friends in a horizontally explorable scene, with a Find me control and unknown totals labeled Not synced. Individual walker rows are collapsed by default behind an accessible disclosure. Real height is entered in centimeters in the character editor; only derived short/average/tall proportions are exposed to other players. Top colors share the existing outfit palette and apply to tees and hoodies. Input labels sit above outlined fields to keep focus from shifting their position.
