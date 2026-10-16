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

## Reference palette implemented

The user's supplied Stompers screenshots are the visual reference for this revision.
They show a largely neutral shell, with bright color concentrated in actions, selections,
and game content. The approved layout is preserved; this revision changes colors only.

| Role | Color |
| --- | --- |
| Canvas | Cool light gray #F5F6F8 |
| Surfaces | White #FFFFFF |
| Text | Charcoal #292A31 |
| Search fields | Cool gray #E7E9F0 |
| Contained actions | Orange #FFAD1F with dark #292A31 text |
| Text actions and focus | Charcoal #292A31 |
| Selections and invitations | Peach #FFD0A3 with dark text |
| People | Mint, peach, gray, and golden yellow |

Dark mode remains removed. Existing automated contrast checks require active text pairs
at 4.5:1 and input outlines at 3:1. Physical Android testing remains outstanding.
