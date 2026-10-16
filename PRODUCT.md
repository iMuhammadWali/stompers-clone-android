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

Design direction chosen for this first implementation: a friendly walking-club identity,
warm paper background, ink text, restrained burnt-orange actions, flat people lists,
large useful typography, and a small original footprint mark. Prioritize task completion
over decorative dashboard widgets. No invented fitness claims or activity statistics.

Use code-led design. Continue autonomously using the agreed scope and working name;
the user is travelling and has asked not to block work with setup questions.
