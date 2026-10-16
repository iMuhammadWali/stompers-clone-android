# Character editor

Mode: Operate. Target: src/app/character.tsx. Android-first Expo screen, also delivered
as a web demo. Preserve the user's approved original cartoon artwork and light palette.
Primary task: choose a look, see it on the track, save it locally.

Gender is a two-option labeled selection (Male/Female). Other feature tiles use visual
previews and accessible names. Borders/checks identify selection. Compact track preview,
wrapping category controls and scalable card heights limit scrolling and text clipping.
Unsaved changes and Reset changes support reversible exploration. No activity claims.

Evidence: latest user phone screenshot identifies indistinguishable unlabeled gender
portraits and awkward hoodie cuffs. SVG artwork inspected after pose changes; actual
phone UI verification is performed by the user. No native screenshot sign-off.

Catalog thumbnails are fixed samples, independent of the current draft. Hair, eyes,
nose, expression, shirt and gender artwork are generated once from a standard sample
appearance. Only the main track preview reflects current character selections.

The live preview and Back are pinned outside the options ScrollView. Height scales
within 72–200 units, leaving room for scrolling controls. Defaults and static samples
use Sand skin; stored skin is preserved. Six disjoint hairstyles per gender, removable
sunglasses, and fox/dragon/alien-saucer companions extend the existing illustrated world.

The Look/Face/Clothes/Pet category controls are pinned directly below the preview.
Switching category resets only the options scroll position; draft selections are retained.
