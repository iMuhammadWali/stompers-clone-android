# Phone step tracking: research, implementation and validation

Research reviewed 18 October 2026. Social-race accounting updated for version 1.2.0 / Android build 6.

## Decision

Health Connect remains the existing default source. If it is missing, the user can select **Use phone tracking instead**, then **Use phone step sensor**. The native module prefers Android's cumulative step-counter sensor, then the step-detector sensor. An accelerometer-only estimator is offered only after an additional explicit opt-in when both step sensors are absent. These are capability checks, not assumptions about a brand of phone.

Only one source supplies the race total. Health Connect and phone counts are never added. Changing the source can change the displayed count. No raw sensor data is uploaded and no Health Connect records are written. For signed-in accounts, the selected daily count, source and sync time are uploaded while Home is open and shared with accepted friends. Demo counting stays local.

## Research reviewed

The first five sources below were reviewed in full text, concentrating on methods, results and limitations. The remaining three were reviewed at abstract/author-record level; they were not treated as fully reviewed papers. Published performance belongs to each study's algorithm, equipment and protocol, not to Stride.

| Primary source | Finding relevant to this implementation |
| --- | --- |
| [Lee, Choi & Lee (2015), Step Detection Robust against the Dynamics of Smartphones](https://www.mdpi.com/1424-8220/15/10/27230), DOI 10.3390/s151027230 | Peak/valley pairing and adaptive magnitude and timing thresholds address changes in carrying position and walking mode. Evaluation included transitions and sampling-rate/power tradeoffs. Stride uses magnitude, temporal filtering and peak/valley evidence, but does not reproduce their algorithm or inherit its accuracy results. |
| [Xu et al. (2022), Smartphone-Based Unconstrained Step Detection Fusing a Variable Sliding Window and an Adaptive Threshold](https://www.mdpi.com/2072-4292/14/12/2926), DOI 10.3390/rs14122926 | FIR preprocessing, FFT motion classification, changing windows and adaptive thresholds target false peaks and window-boundary errors. The study used 25 volunteers and 21 phone models. Its substantially more elaborate classifier is not implemented here. The accompanying author repository supplied a temporary real-signal replay test. |
| [Brondin et al. (2020), Open source step counter algorithm for wearable devices](https://www.diva-portal.org/smash/get/diva2:1474455/FULLTEXT01.pdf) | Windowed peak detection can run on constrained devices, but performance varied with activity; slow walking was difficult. Embedded counters performed better overall in that experiment. The hardware was a smartwatch, so its results are not transferable to this phone app. This supports preferring dedicated step sensors over an unvalidated estimator. |
| [Straczkiewicz et al. (2023), Open-Source, Step-Counting Algorithm for Smartphone Data Collected in Clinical and Nonclinical Settings](https://pmc.ncbi.nlm.nih.gov/articles/PMC10687676/), DOI 10.2196/47646 | A wavelet-based method was evaluated across eight datasets. Small aggregate bias did not imply small individual errors; short bouts, cadence harmonics and phone non-carry time matter. Stride does not implement this wavelet model. We distinguish a replay or synthetic check from physical validation, and avoid a universal accuracy percentage. |
| [INTERLIVE (2021), Recommendations for determining the validity of consumer wearable and smartphone step count](https://pmc.ncbi.nlm.nih.gov/articles/PMC8273687/) | Validation should use realistic placements, visually checked reference steps and both walking and non-walking activities. Report matched intervals, bias, limits of agreement and error distributions. A test suite or a single 100-step walk is insufficient to establish general accuracy. The physical validation protocol below follows these principles. |
| [Huang et al. (2012), An orientation free adaptive step detection algorithm using a smart phone in physical activity monitoring](https://pure.qub.ac.uk/en/publications/an-orientation-free-adaptive-step-detection-algorithm-using-a-sma/), DOI 10.1007/s12553-012-0035-2 — abstract/author record | Supports orientation-independent acceleration processing and testing multiple carrying positions. A rotation-invariant magnitude alone still cannot distinguish walking from equivalent rhythmic shaking. |
| [Höchsmann et al. (2018), Validity of activity trackers, smartphones, and phone applications to measure steps in various walking conditions](https://pubmed.ncbi.nlm.nih.gov/29460319/), DOI 10.1111/sms.13074 — abstract | Different walking conditions, speeds and placements must be tested; a result from one placement does not justify a device-wide accuracy claim. |
| [Accuracy of a smartphone pedometer application according to different speeds and mobile phone locations in a laboratory context](https://pubmed.ncbi.nlm.nih.gov/30662492/) — abstract | Walking speed and carrying location are explicit validation variables. They are included in the proposed phone test matrix, not assumed away. |

An additional Oxford author PDF for Salvi et al. (2018) could not be retrieved; it is not counted as a full-text review. Public Oxford Java/C repositories were inspected for approach and availability. No third-party algorithm code was copied into the estimator.

## Android and Expo requirements

Reviewed current [Android motion sensor documentation](https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion), [basic step-count integration](https://developer.android.com/health-and-fitness/fitness/basic-app/read-step-count-data), [foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types), [background-start restrictions](https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start), and [Expo 58](https://docs.expo.dev/versions/v58.0.0/) / [local modules](https://docs.expo.dev/modules/get-started/) / [module API](https://docs.expo.dev/modules/module-api/).

- Android's counter is cumulative since boot while activated. Its first value is a baseline, not today's total. Counter delivery can lag actual steps by about ten seconds.
- Android 10+ requires Physical activity permission. Android 14+ uses a `health` foreground service and the corresponding foreground-service permission. No location, body-sensor or high-rate-sampling permission is requested.
- The user starts tracking from the visible app. A low-priority ongoing notification provides Open and Stop. Notification denial does not justify fabricating a running count.
- A native service owns listeners and durable counting independently of JavaScript. It releases listeners, its worker thread and any wake lock on destruction. A wake lock is needed only for experimental estimation or a non-wake-up step-detector fallback; these can use more battery.
- A normal service process restart can resume its existing cumulative baseline. After a reboot or package update, a receiver attempts to resume only tracking the user left enabled, with Physical activity permission still granted. If Android or an OEM blocks it, the UI offers Resume. Force-stop is respected. Automatic recovery on every manufacturer is not promised.

## Accounting and failure behavior

`StepLedger.java` is the accounting core used by the Android service and the standalone JVM checks. Total, counter baseline, event timestamp, boot identifier and day/zone are committed together in one preferences value. Duplicate/out-of-order events are ignored. Reboot and decreasing counters establish a new baseline while retaining the current day's recorded count. Explicit resume establishes a fresh baseline and excludes the stopped interval.

Phone counts cover recorded intervals only. They cannot recover activity before activation. The daily bucket resets at midnight Asia/Karachi regardless of the phone timezone. Upgrading a ledger from another timezone starts a fresh bucket instead of mixing incompatible totals. A cumulative counter delta spanning a date/zone boundary cannot be reliably divided; it is excluded and tracked as unallocated rather than invented as today's steps. The experimental detector resets its pending bout at a day/zone change. This conservative policy can undercount around a boundary.

The current phone ledger retains the current day, not a historical daily chart. Local data can be removed by clearing app storage. The server retains uploaded daily snapshots, but cannot reconstruct missed or unallocated native intervals.

The original experimental estimator uses orientation-independent magnitude, time-based drift and noise filtering, an adaptive amplitude floor, peak/valley evidence, a 280 ms refractory interval, cadence-consistency checks against a smoothed recent interval, and a four-candidate bout gate. Sampling gaps reset its state. Very short or slow bouts may be missed; rhythmic shaking or vehicle vibration can cause false positives. It is not intended for clinical or anti-cheat use. The app labels it **Experimental phone estimate**.

## Verification

- Standalone JVM checks execute the actual production Java ledger and detector: first baseline, duplicate and stale events, midnight ambiguous delta, reboot, counter rollback, paused gaps, timezone rollover, direct detector events, invalid values, stationary signals, small oscillations, isolated bumps, cadence sweeps and magnitude invariance under rotation.
- Synthetic 30-second sinusoidal signals at 1, 1.5, 2 and 2.8 Hz returned 29/30, 44/45, 59/60 and 83/84 candidate steps respectively, unchanged by rotating the three axes. These deliberately simple signals are implementation checks, **not measured walking accuracy**.
- An unchanged real acceleration recording (`10_yuhao.txt`, `constrain` branch of [the 2022 paper's author repository](https://github.com/jackleenotjackma/StepCountingData)) was replayed at its original approximately 50 Hz and every second sample (approximately 25 Hz). Both yielded 233 estimates across about 133.24 seconds. File SHA-256: `9ac26a8ce30a75d183efe33c7bc560fbe7b39c7129acbf7421fcb67d813ab3d9`. This is a smoke test only: a trustworthy per-file mapping to the paper's ground-truth table was not established. The raw participant recording is not redistributed in this repository.
- Hook tests check that Health Connect is not read or added when phone mode is selected, source switching replaces totals, Stop shows a paused state, denied activity permission prevents Start, and accelerometer use requires a separate opt-in.
- Existing authentication, character editor, race UI, Health Connect and accessibility/contrast checks remain required.
- No physical Android phone was attached during development. Native build success, automated tests and replay do not verify a manufacturer's sensors, screen-off reliability, OEM battery behavior or real-world accuracy.

## Remaining physical validation before an accuracy claim

Use multiple Android versions and manufacturers, including phones with and without step-counter hardware. Count steps from synchronized video with two independent reviewers. Include slow/normal/fast walking, turns, stairs, short stop/start bouts, hand/front pocket/back pocket/bag placements, screen on/off, and a full-day carry test. Include sitting and typing, shaking, household tasks, cycling and car/bus travel as false-positive trials. Report per-trial signed error and absolute percentage error, participant/device distributions and Bland–Altman limits of agreement. Keep parameter-development recordings separate from final evaluation recordings.

Separately test denial and revocation of both permissions, Stop from the notification, process death, reboot and manual resume, midnight, DST/timezone changes, device clock changes, upgrade over the previous APK and restricted battery mode. Compare source totals without adding them. Record unobserved intervals and battery consumption. These tests require actual phones and are outstanding, not claimed as completed.

## Release build result

Version 1.1.0 (Android versionCode 5) was built successfully. All 95 automated checks passed, as did type checking, lint, exports and GitHub CI. Packaged permissions, native module/service components, source labels, font/license, ZIP integrity, 16 KB ZIP alignment and the update-compatible signing certificate were verified. APK SHA-256: `a2b2f2078d6571d0a25941de21b4f8f803f7a0e80d6c3f192c30b71ff256402f`. Physical-phone counting accuracy, background reliability and the physical validation protocol remain unverified.
