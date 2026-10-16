# Playful social-fitness palette

The previous cream, terracotta, and olive scheme communicated a subdued directory more
strongly than a social walking game. This revision changes color roles while preserving
the existing account and friendship flows.

## Research and limits

Jonauskaite and Mohr's systematic review covers 132 studies and 42,266 participants across
64 countries. Lighter colors were associated with more positive emotions, more saturated
colors with higher-arousal emotions, and yellow/orange with positive and higher-arousal
associations. These are associations, not proof that showing a particular app color causes
happiness, increased walking, retention, or any other behavior.

Elliot's review emphasizes contextual effects and methodological limitations. Color meaning
depends on the task, other visual elements, and learned associations; a universal rule such
as 'blue always creates trust' is not justified for this product.

Sources:

- Jonauskaite & Mohr, *Do we feel colours? A systematic review of 128 years of psychological
  research linking colours and emotions*: https://doi.org/10.3758/s13423-024-02615-z
- Elliot, *Color and psychological functioning: a review of theoretical and empirical work*:
  https://doi.org/10.3389/fpsyg.2015.00368

## Design inference implemented

| Role | Light theme | Purpose |
| --- | --- | --- |
| Canvas | Sunshine yellow #FFF5BF | A warm, brighter visual field with a game-like character |
| Main action | Cobalt #2546D8 with white text | Strong, consistent action and selection contrast |
| Invitations and selected controls | Yellow #FFE36A with navy text | A clearly differentiated social interaction surface |
| Reading text | Navy #192744 | Legibility on bright surfaces |
| People | Mint, coral, lilac, and yellow avatar backgrounds | Distinguish people without implying unimplemented activity/status |
| Errors | Red #AC2430 plus explicit text | Preserve a separate, labeled error role |

Dark mode was removed at the user's request. The bright palette is always active, including
when the operating system or browser requests dark appearance. Expo's native configuration,
Paper's theme, and status bar content are set consistently for light mode.

Automated tests check active text pairs at 4.5:1 and input outlines at 3:1, including all
four avatar pairings. Color is paired with text, icons, position, and state labels.
These checks do not replace testing on a physical Android phone.
