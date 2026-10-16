# Stride

Working product name for an Android social walking app. Current scope is the API v1
companion: sign up, sign in, manage friends, handle requests, and edit your display name.
No walking data, competitions, items, rankings, or group functionality is implemented yet.

People use this on a phone, often one-handed. Primary tasks are finding an exact username,
accepting incoming requests, and seeing who is already a friend. Navigation must match
Android expectations, preserve readable text at larger font scales, and keep touch targets
at least 48 dp. Native platform: Android, React Native with Expo and Expo Router.

The backend is not deployed yet. A clearly labeled, entirely local demo supports exploration.
Real credentials are never sent to demo mode. Demo data is synthetic and resets on restart.
Real mode uses the existing API v1 contract with refresh tokens in SecureStore.

Design direction: a playful social walking game identity, a sunshine-yellow daylight canvas,
navy text, cobalt actions, golden invitation/selection surfaces, and mint/coral/lilac/yellow
avatar backgrounds. Dark mode is removed; always use the bright theme, including on dark-mode phones. Color choices are
informed by research on color-emotion associations, not claims about exercise motivation.
Preserve flat people lists, the existing account flows, and the original footprint mark.
No invented fitness claims or activity statistics. Password visibility uses an authored SVG
control, without an icon-font dependency.

Use code-led design. Continue autonomously using the agreed scope and working name;
the user is travelling and has asked not to block work with setup questions.
