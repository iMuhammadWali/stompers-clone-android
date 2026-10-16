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
# Design System: Stride (working name)

## Overview

**Creative North Star: "A walking club’s people directory"**

This is a source-derived record of the implemented account, friends, requests, invitation, and profile interface. Cool light gray, charcoal ink, orange actions, multicolor initials, and divided people lists give the application a friendly club character. Stride is a working name, not an approved brand identity. No approved visual comp exists.

The implementation uses React Native Paper Material 3 with platform system typography. This is an Android-native interface; web renders are surrogates. Android-device validation remains outstanding. Native screenshots were unavailable, so the reviewer requires recapture rather than granting native approval. No detector ran for the native target; the optional helper engine refused an unverifiable download. This document records implementation, not release readiness.

**Key Characteristics:**
- Always-light neutral surfaces with orange, peach, and golden accents.
- Flat, readable people lists and explicit invitation states.
- Platform typography, outlined fields, and restrained primary actions.
- A small original geometric footprint mark.

## Colors

The user-supplied Stompers screenshots establish the color direction. Preserve the
approved layout and typography. Use a cool gray canvas (#F5F6F8), white surfaces,
charcoal text (#292A31), cool gray search fields (#E7E9F0), peach selections (#FFD0A3),
and orange contained actions (#FFAD1F) with dark text (#292A31). Golden yellow is a small
avatar accent. Text actions and focus indicators use charcoal (#292A31) for contrast.
Dark mode is removed. Semantic foreground/container pairs are defined in src/lib/palette.ts.
All buttons use AppButton, which applies primaryContainer/onPrimaryContainer to primary actions; other controls
retain their existing modes and geometry. Native-device validation remains outstanding.

## Typography

**Display Font:** Android system `sans-serif`; no bundled display font.
**Body Font:** Android system `sans-serif`; medium roles use `sans-serif-medium`.
**Platform fallbacks:** Paper selects `System` on iOS and `Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif` on web. Web availability does not establish Android rendering.

The frontmatter uses px syntax for portable token consumers; React Native text sizes are logical font units, subject to native font scaling. Source measurements below are nominal size / line-height, not raster guarantees. The native platform requirement takes precedence over a custom editorial font pairing.

- **Display small:** authentication headline (36 / 44), overridden to bold with tight tracking.
- **Headline large:** shared screen title (32 / 40), bold with tight tracking.
- **Title large:** profile identity, empty-state title, and library dialog title (22 / 28); the authentication wordmark has a separate heavy override.
- **Title medium:** section headings and people names (16 / 24); the compact wordmark is heavier.
- **Body large:** explanations (16 / 24), locally increased to line-height 25 in empty states and 26 in authentication/invitation prose.
- **Body medium:** usernames, notices, and help (14 / 20).
- **Body small:** demo help and footnotes (12 / 16).
- **Label large:** button labels and profile metadata (14 / 20).
- **Label medium:** demo banner (12 / 16).
- **Tab labels:** navigator-local size 12, weight 600; not a separate global type scale.

**The Role Before Size Rule.** Extend Paper text variants and existing overrides rather than introducing unrelated heading sizes.

## Layout

A single scrollable column uses safe areas at top, left, and right. Content is centered with a maximum width of 600 logical units, full available width, 24-unit padding, 40-unit bottom padding, and 20-unit major gaps. These are continuous width constraints, not breakpoint layouts. The app is configured portrait; no tablet-specific design is implemented.

Title rows pair a flexible title stack with an optional action, a 12-unit gap, and 12-unit top margin. Forms use 16-unit gaps. People rows use 16-unit horizontal gaps and 18-unit vertical padding; name stacks use 4-unit gaps. Request actions wrap with an 8-unit gap. Demo context sits above the scroll region with 20-unit horizontal and 10-unit vertical padding.

Primary form actions explicitly request a minimum content height of 52 units; most row actions request 48, and the incoming invitation action requests 56. The product requires at least 48 dp touch targets. Some default Paper actions do not yet have an explicit minimum: authentication toggles, dialog actions, retry, and Add another friend. Their actual Android hit areas must be measured; the source does not demonstrate universal compliance. Long names, narrow widths, keyboard avoidance, and larger font scales still require Android-device checks.

Bottom navigation has three destinations: Friends, Requests, and You. Its height is 72 plus the bottom safe-area inset, with top padding 10 and bottom padding equal to the greater of inset or 10. Active tint is primary; inactive tint is on-surface-variant. A received-request count becomes the Requests badge.

## Elevation & Depth

People lists are flat with dividers rather than cards or decorative shadows. There is no custom shadow vocabulary. Paper supplies native state layers and overlay behavior for the search field, dialog, banner, and snackbar. Its inherited elevation surfaces retain the library’s default tint; this palette drift is recorded, not established as brand doctrine. Native shadow, modal, and ripple rendering has not been visually approved.

Stack navigation explicitly disables transition animation (`animation: 'none'`). Other control feedback remains Paper’s default animation scale (1). No custom motion system exists.

## Shapes

Theme roundness is 3. In the installed Paper implementation, outlined fields use that radius directly; buttons multiply it by five, and bar-mode search multiplies it by seven. Avatars are circular: 52-unit people avatars and a 72-unit profile avatar. Loading silhouettes mirror the avatar circle and use a small rounded text block. Dividers, not enclosing cards, separate people.

## Components

### Buttons

Contained actions use primary/on-primary. Contained-tonal actions use secondary-container/on-secondary-container. Outlined actions retain the surface behind an outline; text actions use primary without a filled container. Loading and disabled states are passed to Paper; ripple, focus, and disabled appearance are inherited, not hand-designed. Preserve action labels and visible success feedback.

### Inputs / Fields

Paper outlined inputs have floating labels, nominal 56-unit standard minimum height, 16-unit horizontal input padding, themed outline, and primary focus stroke. Authentication uses a password-visibility icon with an explicit accessibility label. Username fields avoid autocapitalization and autocorrect. Search uses a separate rounded Searchbar on surface-variant. No custom web hover or focus ring is a native design token.

### Navigation

The three tab icons are inline path-based SVGs, 24 units with 1.8-unit strokes, round caps, and round joins. They are not font glyphs. Built-in Paper control icons remain package-provided assets. Labels remain visible and request badges accompany the Requests destination.

### People rows and avatars

Initials derive from the first two name segments and use mint, peach, gray, and golden yellow paired colors. Names use title-medium; usernames use supporting body-medium. Flat rows expose Manage, Accept/Decline, or Cancel as explicit controls. Received-request actions sit beneath the person description and wrap as necessary. No canonical card or chip component is implemented.

### Feedback and overlays

Notice uses the Paper error role with a polite accessibility live region. A retry Banner shows session errors. Snackbar confirms mutations. Friend removal uses a Portal/Dialog with explanatory content and separate keep/remove actions. Empty states have a title, explanatory body, and optional action; loading placeholders reuse surface-variant at reduced opacity.

### Footprint mark and app icon provenance

`Mark` in `src/components/ui.tsx` is original code-native SVG geometry: four filled ellipses in a 40 × 40 viewbox, two with opposing 25-degree rotations. It appears at 32 units on authentication and 28 in the friends header, using the active theme primary. `assets/stride-mark.svg` is the original 1024-square source drawing on the light background, using the same footprint geometry. The app icon assets (`icon.png`, `adaptive-icon.png`, `monochrome-icon.png`, `favicon.png`) are local raster derivatives of that source, not stock photography or image-generated brand art. Android adaptive background uses the light background value. Device launcher masking and monochrome treatment remain subject to native capture.

## Do's and Don'ts

### Do:
- **Do** pair semantic foreground and container colors in the current theme.
- **Do** extend Paper text variants and the existing single-column spacing rhythm.
- **Do** preserve divided people rows and explicit action labels.
- **Do** keep demo context visible and identify sample people.
- **Do** validate Android touch targets, font scaling, keyboard behavior, and fixed light appearance on a device.

### Don't:
- **Don't** treat surrogate web captures as native visual approval.
- **Don't** promote inherited lavender elevation tones or unmeasured default action sizes into brand rules.
- **Don't** invent walking statistics or dashboard components absent from this implementation.
- **Don't** treat Stride or the footprint as an approved final identity.

## Palette revision

The user requested a more playful visual character. The source of truth is src/lib/palette.ts;
all elevation, outline, inverse, error, and selection roles are explicit in both themes.
Avatar containers vary deterministically between mint, coral, lilac, and yellow.
Research, application limits, and color rationale are in COLOR-RATIONALE.md.
The password toggle uses SVG paths, independent of font loading.

## Light-only appearance

Dark mode is removed by explicit user instruction. The app does not read the system color
scheme. MD3LightTheme and the reference palette are always active; native configuration
uses userInterfaceStyle: light and the status bar uses dark content. Earlier dark-theme
inspection examples in this document are historical and are not part of the active design.

### Primary button finish

Enabled primary and tonal buttons share a static gloss: a white highlight fading down from the
top, a small side glint, a darker lower edge, and a charcoal outline. Text, outlined,
and disabled buttons stay flat. The decorative overlay ignores touch and is hidden
from accessibility. Paper retains the actual press target, ripple, and loading state.
`buttonFinish` in `src/lib/palette.ts` controls intensity, edges, corner radius, and
an application-wide enable switch. `glossy={false}` opts out for one AppButton.
Changing `brandColors.action` still recolors every primary button, including glossy ones.

## Character and track artwork

Original outlined 2D art uses a shared 120×190 character rig: oversized expressive head,
soft angular hair silhouettes, bright tee, dark shorts, and pale sneakers. Separate layers
hold skin, back/front limbs, clothing, face, and hair. Four hair silhouettes, three hair
colors, five skin tones, and four outfits combine on the shared body rig.
Dog, cat, and rabbit companions share a consistent outline, scale, and ground plane.

The race-track reference informs the side view, neutral sky, orange dirt edges, pale gold
path, and grounded character placement. Original hills, bushes, stones, dashed lane edges,
and soft contact shadows give depth. No map, leaderboard, or real race position is implied.
The 390×420 scene is shared between Home and the live creator preview. Walking is opt-in,
pauses on blur, and respects reduced motion. Persisted appearance is device-local per account.
The supplied Stompers screenshot is a direction reference; no game assets are copied.

### Walk-pose revision

Default to the contact/stride pose, with feet separated, rear heel raised, front foot
reaching forward, and opposing arm swing. Draw explicit elbows, wrists, and mitten-shaped
hands. Darker far limbs and correct back-to-front drawing order clarify overlap. Keep both
hands outside the torso silhouette in the default pose. Four offset pet legs have small
paw shapes; they are not represented by a single two-leg stroke.

The eight-pose sheet (`assets/characters/pose-sheet.svg`) is generated from the same rig
used by the app and inspected alongside the track design sheet. Normal overlap occurs in
passing poses; the default contact pose is selected for clear reading at phone size.

References studied:
- Animation Mentor, “Animating a Basic Human Walk Cycle”: https://www.animationmentor.com/blog/tutorial-animating-human-walk-cycle/
- Animation Mentor / Anthony Wong, “Building Appealing Character Poses for Animation”: https://www.animationmentor.com/blog/tutorial-building-appealing-character-poses-for-animation/

Design inference: the app's main idle image should communicate an easy walk. A contact
pose gives a clearer small silhouette than overlapping feet or a raised, waving forearm.

Layering correction: both leg layers render before the shorts, so the near thigh cannot
erase its trouser leg. Sleeves attach along each upper arm. The resting stride is narrower,
and character/pet offsets align foot contact with their ground shadows. Pet front paws
have additional horizontal separation so they do not merge in the default pose.

## Expanded face and clothing system

Eyes, nose profiles, eyebrows/mouth expressions, and shirt details are independent
layers. Noses sit within a stable, smooth face silhouette. Expressions adjust eyebrows
and mouths while retaining the selected eye style. Gender choices adjust the jaw and shirt fit. Catalog eligibility restricts Crop/Raglan
to Male and Ponytail/Striped to Female; other hair/shirt choices are shared.
Classic tees are plain, striped tees use two broad curved light bands,
raglan shirts have contrast sleeves, and hoodies have a hood, long sleeves, drawstrings,
and a pouch. Hands paint after all sleeves to avoid repeating the previous occlusion bug.
All selections update the same rig used on the track. A generated features sheet records
the individual options. Four editor sections keep the longer catalog usable on phones.

## Nose simplification and inventory rules

Noses use a minimal mark, softly shaded button, or interior bridge curve. The cheek
outline stays smooth, keeping the eyes and expression as the main facial focus. The chosen default is Button nose. Legacy nose IDs migrate to the
nearest new style. Choices were informed by Raquel Arellano and the Etherington Brothers:
- https://www.clipstudio.net/how-to-draw/archives/160376
- https://www.clipstudio.net/how-to-draw/archives/161019

These sources describe simplifying nose structure and varying the profile; the actual
small-profile designs are an application-specific interpretation. Game catalog gender
restrictions are specified by the user, not inferred rules about real-world fashion.


### Face and clothing refinement
Cartoon simplification references: Clip Studio Art Rocket,
https://www.clipstudio.net/how-to-draw/archives/155423, and CrimsyCreates,
https://tips.clip-studio.com/en-us/articles/4953. These inform compact facial marks
and fewer, bolder clothing details; the SVG geometry is original.

Minimal nose is a tiny shaded mark; Button nose uses soft volume and a short lower
curve; Soft bridge uses a light interior contour. None interrupts the cheek outline.
The tee is plain, stripes are broad curved bands clipped to the torso, raglan sleeves
use seams, and the hoodie uses a tonal pocket. Details sit beneath arms and collar.
Choices have no visible captions. Accessible labels remain, and selected tiles show
a small check badge. Face thumbnails crop around the relevant feature. Five options
wrap into two rows rather than squeezing five portraits onto one mobile row.
