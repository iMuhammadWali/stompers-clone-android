# Stride

Working product name for an Android social walking app. Current scope is the API v1
companion: sign up, sign in, manage friends, handle requests, and edit your display name.
A local character creator, pet selection, and illustrated track preview are implemented.
No walking data, live competitions, items, rankings, or group functionality is implemented yet.

People use this on a phone, often one-handed. Primary tasks are finding an exact username,
accepting incoming requests, and seeing who is already a friend. Navigation must match
Android expectations, preserve readable text at larger font scales, and keep touch targets
at least 48 dp. Native platform: Android, React Native with Expo and Expo Router.

The backend is not deployed yet. A clearly labeled, entirely local demo supports exploration.
Real credentials are never sent to demo mode. Demo data is synthetic and resets on restart.
Real mode uses the existing API v1 contract with refresh tokens in SecureStore.

Design direction: preserve the approved UI and follow the supplied Stompers screenshots
for color balance: cool light gray canvas, white surfaces, charcoal text, orange actions,
peach selections, and golden avatar accents. Dark mode remains removed. Color is
concentrated in controls and small accents rather than the full background.
Preserve flat people lists, the existing account flows, and the original footprint mark.
No invented fitness claims or activity statistics. Password visibility uses an authored SVG
control, without an icon-font dependency.

Use code-led design. Continue autonomously using the agreed scope and working name;
the user is travelling and has asked not to block work with setup questions.

Characters and pets: the new Home tab shows the current avatar and companion on a side-on
orange walking track. The creator has four hairstyles, three hair colors, five skin tones,
four outfits, and dog/cat/rabbit/no-pet choices. Facial features now include independent eye, nose, and expression choices.
Appearance saves locally per account, separately from authentication. Demo social data still
resets; saved appearance persists. There are no invented step counts or race results.

The creator has Look/Face/Clothes/Pet sections. Eyes: 4; noses: 3; expressions: 5;
shirt styles: 4; base gender/face/fit variants: Male, Female, Nonbinary. Choices remain
independent, including shirt color versus style. Legacy saved looks migrate by adding
default values for missing fields; existing choices are preserved.
