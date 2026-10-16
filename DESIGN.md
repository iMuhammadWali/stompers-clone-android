---
name: "Stride (working name)"
description: "Implemented Android walking-club account and people directory; native validation pending."
colors:
  light-primary: "#A63D19"
  light-on-primary: "#FFFFFF"
  light-primary-container: "#FFDBCC"
  light-on-primary-container: "#3C1000"
  light-background: "#FAF7F0"
  light-surface: "#FAF7F0"
  light-surface-variant: "#F0E8DD"
  light-on-surface: "#252820"
  light-on-surface-variant: "#625C51"
  light-secondary-container: "#E6E9D8"
  light-on-secondary-container: "#3A4326"
  light-outline: "#81796D"
  light-outline-variant: "rgba(202, 196, 208, 1)"
  light-error: "rgba(179, 38, 30, 1)"
  dark-primary: "#FFB599"
  dark-on-primary: "#411500"
  dark-primary-container: "#60301C"
  dark-on-primary-container: "#FFDBCC"
  dark-background: "#1B1917"
  dark-surface: "#1B1917"
  dark-surface-variant: "#3A332E"
  dark-on-surface: "#F3EDE6"
  dark-on-surface-variant: "#D6C5B7"
  dark-secondary-container: "#3D4030"
  dark-on-secondary-container: "#E2E6C8"
  dark-outline: "#A79789"
  dark-outline-variant: "rgba(73, 69, 79, 1)"
  dark-error: "rgba(242, 184, 181, 1)"
typography:
  display-small:
    fontFamily: "sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: "44px"
    letterSpacing: "-1.1px"
  headline-large:
    fontFamily: "sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
    letterSpacing: "-0.8px"
  title-large:
    fontFamily: "sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0px"
  brand-large:
    fontFamily: "sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: "28px"
    letterSpacing: "-0.6px"
  brand-medium:
    fontFamily: "sans-serif-medium"
    fontSize: "16px"
    fontWeight: 800
    lineHeight: "24px"
    letterSpacing: "0.15px"
  title-medium:
    fontFamily: "sans-serif-medium"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: "24px"
    letterSpacing: "0.15px"
  body-large:
    fontFamily: "sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.15px"
  body-medium:
    fontFamily: "sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
    letterSpacing: "0.25px"
  body-small:
    fontFamily: "sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
    letterSpacing: "0.4px"
  label-large:
    fontFamily: "sans-serif-medium"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
    letterSpacing: "0.1px"
  label-medium:
    fontFamily: "sans-serif-medium"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.5px"
rounded:
  field: "3px"
  button: "15px"
  search: "21px"
  avatar: "50%"
spacing:
  step-4: "4px"
  step-8: "8px"
  step-10: "10px"
  step-12: "12px"
  step-16: "16px"
  step-18: "18px"
  step-20: "20px"
  step-24: "24px"
  step-36: "36px"
  step-40: "40px"
components:
  button-primary-light:
    backgroundColor: "{colors.light-primary}"
    textColor: "{colors.light-on-primary}"
    typography: "{typography.label-large}"
    rounded: "{rounded.button}"
    height: "52px"
  button-tonal-light:
    backgroundColor: "{colors.light-secondary-container}"
    textColor: "{colors.light-on-secondary-container}"
    typography: "{typography.label-large}"
    rounded: "{rounded.button}"
    height: "52px"
  button-primary-dark:
    backgroundColor: "{colors.dark-primary}"
    textColor: "{colors.dark-on-primary}"
    typography: "{typography.label-large}"
    rounded: "{rounded.button}"
    height: "52px"
  button-tonal-dark:
    backgroundColor: "{colors.dark-secondary-container}"
    textColor: "{colors.dark-on-secondary-container}"
    typography: "{typography.label-large}"
    rounded: "{rounded.button}"
    height: "52px"
  person-avatar-light:
    backgroundColor: "{colors.light-secondary-container}"
    textColor: "{colors.light-on-secondary-container}"
    rounded: "{rounded.avatar}"
    size: "52px"
---
# Design System: Stride (working name)

## Overview

**Creative North Star: "A walking club’s people directory"**

This is a source-derived record of the implemented account, friends, requests, invitation, and profile interface. Warm paper, ink, burnt orange, olive initials, and divided people lists give the application a friendly club character. Stride is a working name, not an approved brand identity. No approved visual comp exists.

The implementation uses React Native Paper Material 3 with platform system typography. This is an Android-native interface; web renders are surrogates. Android-device validation remains outstanding. Native screenshots were unavailable, so the reviewer requires recapture rather than granting native approval. No detector ran for the native target; the optional helper engine refused an unverifiable download. This document records implementation, not release readiness.

**Key Characteristics:**
- Warm light and ink-dark system themes.
- Flat, readable people lists and explicit invitation states.
- Platform typography, outlined fields, and restrained primary actions.
- A small original geometric footprint mark.

## Colors

The action palette is burnt orange in light mode and peach in dark mode; olive containers hold initials and secondary actions. Frontmatter colors are normative source values, not a newly generated palette.

### Primary

Light and dark primary/on-primary pairs serve contained actions, the footprint mark, and active navigation. Primary-container pairs are defined by the app theme but are not a second competing action color.

### Secondary

Secondary-container and on-secondary-container provide olive avatars, the demo banner, selected authentication mode, and the incoming-request action. The app does not explicitly retheme Paper’s standalone secondary or tertiary families; do not promote inherited unused defaults into brand colors.

### Neutral

Background and surface share a value in each mode. Surface-variant holds search and loading placeholders. On-surface is main ink; on-surface-variant supports usernames and explanation. Outline is the outlined-control stroke. Outline-variant is inherited from Paper and appears in dividers and navigation boundaries. Error is inherited from Paper and used by Notice. Disabled colors, dialog tones, inverse snackbar colors, and badge colors also remain library defaults.

**The Semantic Pair Rule.** Keep each foreground with its corresponding container in the active theme; do not carry light-mode ink onto dark-mode surfaces.

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

Initials derive from the first two name segments and use olive paired colors. Names use title-medium; usernames use supporting body-medium. Flat rows expose Manage, Accept/Decline, or Cancel as explicit controls. Received-request actions sit beneath the person description and wrap as necessary. No canonical card or chip component is implemented.

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
- **Do** validate Android touch targets, font scaling, keyboard behavior, and dark mode on a device.

### Don't:
- **Don't** treat surrogate web captures as native visual approval.
- **Don't** promote inherited lavender elevation tones or unmeasured default action sizes into brand rules.
- **Don't** invent walking statistics or dashboard components absent from this implementation.
- **Don't** treat Stride or the footprint as an approved final identity.
