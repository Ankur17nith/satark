# Design system

**Direction: a safety notice printed in daylight.** Warm uncoated paper, ink type and three spot colours, like a public-information poster. The visual language (paper, ink, offset shadows, risograph misregistration, cut-paper waves) is adapted from the "bright daylight" design of [LifeLine](https://github.com/Prashant-thakur77/LifeLine).

## Rules

- **Calm, not alarming.** The page is bright and friendly; red and the stamp appear only on a result that needs them.
- **One job per section.** Hero (check a message), result, the scale of the problem, how it works, footer.
- **Clickable things look pressable.** 2 px ink border plus an offset ink shadow (`3px 3px 0 ink`); buttons press into it. Static cards have no shadow.
- **Readable first.** Text passes WCAG AA (checked by `tests/contrast.test.js`). Motion never delays reading a verdict or pressing a button.
- **No emoji or stock icons.** Icons are simple stroked SVG; the mark is a printed shield.

## Tokens (`public/styles.css`)

| Token | Value | Use |
|---|---|---|
| `paper` / `paper-2` / `card` / `shade` | #fff7ea / #fbeedb / #fffcf5 / #f2e6d1 | Page, hover fills, cards and inputs |
| `ink` / `ink-2` / `body` / `muted` | #0b1533 / #24305a / #3b4568 / #5e6684 | Headlines, strong text, body copy, secondary text |
| `sea` / `sea-deep` / `sea-light` | #1d4bff / #0e2fb3 / #8fb0ff | Waves, the footer, the checker card's shadow, step numbers |
| `rescue` | #ff5a1f | The main action ("Check message"), the 1930 band, the pen line |
| `rescue-big` | #f04a10 | The orange headline line (3.5:1 on paper, for large text) |
| `sun` | #ffc93c | Red-flag highlights, the stats band, hover, focus |
| `safe` / `danger` | #19c79a / #e5243b | Verdict colours only |
| `*-ink` | rescue #c2410c, safe #066c50, warn #9a5b00, danger #c0182c | The same accents as small text (AA) |
| Type | Archivo (variable width), Martian Mono, IBM Plex Mono, Noto Sans Devanagari | Condensed uppercase headlines (`wdth` 70, weight 800); body Archivo; numbers Martian Mono light; links and codes Plex Mono; Hindi in Noto Sans Devanagari |

## Motion

| Name | Value | Where |
|---|---|---|
| kin-rise | 760 ms, `cubic-bezier(.2,.8,.2,1)`, lines staggered 90 ms | Headline lines rise out of their masks |
| pen-draw | 900 ms after a 900 ms delay | The pen line under "in one second" |
| drift | 36–58 s linear, alternating directions | The three cut-paper wave sheets (transform only) |
| sheet-in | 620 ms, staggered 90 ms | Result cards slide into place (movement only, never hidden) |
| stamp | 420 ms after 380 ms | The verdict stamp is pressed onto the sheet |
| count-up | 700 ms ease-out | The risk score counts up to its value |
| pop-in | scroll timeline, where supported | Stats tiles and step cards settle as they scroll in (movement only) |
| how-slide | CSS scroll timeline; section pinned for 230vh, range `contain 4%`–`96%` | Desktop: the four step cards slide sideways as you scroll and a striped rope fills underneath. Phones, reduced motion and browsers without scroll timelines get the plain grid. No script, native scrolling |

Under `prefers-reduced-motion: reduce` every animation and transition jumps to its end state and the score is shown at once.

## Performance

- Anything that loops moves by `transform` only (the waves are background tiles one period wider than the page).
- Scroll-linked motion uses the browser's own scroll timelines, never a scroll library or a scroll listener, so scrolling stays native and smooth.
- The paper grain is one fixed layer with plain opacity, no blend mode.
- No framework, no build step; the only external request is Google Fonts.
