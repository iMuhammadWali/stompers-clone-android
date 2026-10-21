# Verification

Local checks for the social-race update:

- Server: 28 HTTP/database integration tests, typecheck and build passed. The GitHub server workflow also passed against PostgreSQL 17.
- Mobile: typecheck and lint passed; 41 unit tests and 35 UI tests passed.
- Native accounting: 30 JVM checks passed. Synthetic signals do not establish physical step accuracy.
- Web JavaScript export passed. Browser walkthroughs exercise the actual API against a disposable embedded PostgreSQL instance, separate from release code.
- Impeccable's mechanical scan reported no findings for the new setup, lookup, confirmation and friends-race components. Existing palette and character artwork are preserved.

UI coverage includes character-first setup, handle conflicts and suggestions, explicit player preview before requesting friendship, confirmation versus cancellation on logout, saved-look behavior, and real versus unknown race totals. API checks cover session revocation, refresh rotation, uniqueness races, mandatory setup enforcement, friendship permissions, private race visibility, retry-safe step replacement and Pakistan midnight.

Windows sandbox checks required a workspace Jest cache; slower local runs used a 30-second test timeout. The local Windows Hermes compiler failed; GitHub’s Linux workflow passed the default Android bytecode export and web export. No APK signing, native Kotlin build, emulator test or physical-phone validation is claimed by these checks.

Before inviting players:
1. Deploy PostgreSQL and API, applying both migrations.
2. Configure the permanent HTTPS API URL and build/sign the updated APK.
3. Test two real Android phones: signup/setup, add/accept, step-source permissions, daily sync, removal and logout/login.
4. Verify foreground-service behavior across pause/resume, reboot, battery restrictions and midnight.

Counts are device-reported, not verified anti-cheat measurements. Email verification, password recovery and Google sign-in are outside this version.
