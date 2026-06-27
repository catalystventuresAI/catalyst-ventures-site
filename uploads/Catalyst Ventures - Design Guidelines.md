# Catalyst Ventures — Design Guidelines
*Reference document for generating on-brand HTML design artifacts*

---

## Brand identity

Catalyst Ventures is a BC-based AI strategy firm. The visual language is **editorial and warm** — think a serious management consulting report printed on quality paper. Avoid tech-company tropes (gradients, neon, rounded glassmorphism cards). The brand should feel confident, human, and substantive.

**Tagline context:** Vendor-neutral · BC-based · Strategy before code

---

## Typography

All three families must be loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Libre+Franklin:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

| Role | Family | Weight | Notes |
|---|---|---|---|
| Display / Section titles | Spectral | 300 (Light) | Serif. Italic for emphasis in ember/clay. Letter-spacing −0.015em to −0.025em. |
| Body / UI text | Libre Franklin | 300–600 | Clean humanist sans. Primary reading text. |
| Labels / kickers / monospace | IBM Plex Mono | 400–500 | ALL CAPS, letter-spaced 0.14–0.26em. Used for kickers, tags, page numbers, stat labels. |

### Type scale (for 1920×1080 slide decks)
All text must be ≥ 24px at slide scale. Footer/micro-labels (IBM Plex Mono) are the only exception and sit at 20–22px.

| Token | Size |
|---|---|
| `--t-display` | 96px |
| `--t-title` | 60px |
| `--t-subtitle` | 40px |
| `--t-lead` | 36px |
| `--t-body` | 27px |
| `--t-small` | 24px |
| `--t-kicker` | 24px |

### Type scale (for documents / print)
Body: 14–15px / 1.55 line-height. Headings: Spectral 300. Labels: IBM Plex Mono 11–12px.

---

## Colour palette

### CSS custom properties (copy these into `:root`)

```css
:root {
  /* Surface */
  --paper: #ffffff;
  --desk: #e9e6dd;       /* warm cream — section backgrounds */
  --desk-soft: #f1eee7;

  /* Ink */
  --ink: #23211d;
  --ink-soft: #5c574e;
  --ink-faint: #8b857a;

  /* Rules / borders */
  --line: #e1ddd2;
  --line-soft: #eeeae0;

  /* Accent — clay/ember (PRIMARY BRAND COLOUR) */
  --accent: #b0532f;
  --accent-deep: #8a3f23;
  --accent-tint: #f6ede7;   /* for tinted card backgrounds */

  /* Dark panels */
  --panel: #1f1d19;
  --panel-2: #26241f;
  --panel-line: #403c34;
  --on-dark: #f2efe7;
  --on-dark-soft: #cbc5b9;
  --on-dark-faint: #938d81;

  /* Ember — accent colour on dark backgrounds */
  --ember: #d98a5c;
}
```

### Colour usage rules
- **Paper (#ffffff)** — default slide/page background
- **Desk (#e9e6dd)** — summary or "at a glance" slides; print sidebar backgrounds
- **Deep ink panel (#1f1d19)** — cover slide, section dividers, closing slide; always pair with `--on-dark` text and `--ember` accents
- **Clay (#b0532f)** — kicker lines, bullet dots, numbered list markers, stat numbers, chip borders; primary interactive colour
- **Ember (#d98a5c)** — clay equivalent on dark panels ONLY
- **Accent tint (#f6ede7)** — featured card backgrounds, highlighted quadrants, note panels

---

## The "spark" logomark

A 4-line asterisk SVG — use at 24–28px. Always pair with the wordmark "Catalyst Ventures" in Libre Franklin 600, letter-spacing 0.3em, uppercase.

```html
<svg width="26" height="26" viewBox="0 0 20 20" aria-hidden="true">
  <line x1="10" y1="1" x2="10" y2="19" stroke="#d98a5c" stroke-width="1.4"/>
  <line x1="1" y1="10" x2="19" y2="10" stroke="#d98a5c" stroke-width="1.4"/>
  <line x1="3.5" y1="3.5" x2="16.5" y2="16.5" stroke="#d98a5c" stroke-width="1.4"/>
  <line x1="16.5" y1="3.5" x2="3.5" y2="16.5" stroke="#d98a5c" stroke-width="1.4"/>
</svg>
```

On light backgrounds replace stroke with `#b0532f`.

---

## Component patterns

### Kicker (section label above a title)
IBM Plex Mono, uppercase, letter-spaced. Preceded by a 42px clay dash rule. Used on every content slide above the main title.

```html
<div class="kicker">
  <span class="idx">Section label here</span>
</div>
```

```css
.kicker {
  font-family: "IBM Plex Mono", monospace;
  font-size: 24px; letter-spacing: .26em; text-transform: uppercase;
  color: var(--accent);
  display: flex; align-items: center; gap: 18px; margin: 0 0 26px;
}
.kicker::before {
  content: ""; width: 42px; height: 2px;
  background: var(--accent); flex: none;
}
/* On dark slides: */
.slide.dark .kicker { color: var(--ember); }
.slide.dark .kicker::before { background: var(--ember); }
```

### Title
Spectral 300, tight letter-spacing, `text-wrap: balance`. Use `<em>` for italic clay/ember emphasis within titles.

```css
.title {
  font-family: "Spectral", Georgia, serif;
  font-weight: 300; font-size: var(--t-title);
  line-height: 1.08; letter-spacing: -.015em;
  color: var(--ink); margin: 0; text-wrap: balance;
}
.title em { font-style: italic; color: var(--accent-deep); }
.slide.dark .title em { color: var(--ember); }
```

### Section divider slide (dark full-bleed)
Big IBM Plex Mono number in ember + Spectral light title + subtitle.

```html
<section class="slide dark divider">
  <div class="big-num">01</div>
  <h2 class="d-title">Section title here</h2>
  <p class="d-sub">One sentence describing what this section covers.</p>
</section>
```

```css
.divider { justify-content: center; align-items: flex-start; }
.big-num {
  font-family: "IBM Plex Mono", monospace;
  font-size: 150px; font-weight: 400;
  color: var(--ember); line-height: .9; margin-bottom: 30px;
}
.d-title {
  font-family: "Spectral", serif; font-weight: 300;
  font-size: 90px; line-height: 1.02; color: var(--on-dark); margin: 0;
}
.d-sub { font-size: 40px; color: var(--on-dark-soft); margin: 30px 0 0; font-weight: 300; }
```

### Tick list (positive / included items)
Small clay dots, hairline top borders between items.

```css
ul.ticks { list-style: none; margin: 0; padding: 0; }
ul.ticks li {
  position: relative; padding: 14px 0 14px 34px;
  font-size: var(--t-body); line-height: 1.4; color: var(--ink-soft);
  border-top: 1px solid var(--line-soft);
}
ul.ticks li:first-child { border-top: none; }
ul.ticks li::before {
  content: ""; position: absolute;
  left: 4px; top: 24px; width: 9px; height: 9px;
  background: var(--accent); border-radius: 50%;
}
ul.ticks li b { color: var(--ink); font-weight: 600; }
```

### Cross list (negative / excluded items)
Muted, with a small horizontal dash marker.

```css
ul.crosses { list-style: none; margin: 0; padding: 0; }
ul.crosses li {
  position: relative; padding: 14px 0 14px 34px;
  font-size: var(--t-body); line-height: 1.4; color: var(--ink-faint);
  border-top: 1px solid var(--line-soft);
}
ul.crosses li::before {
  content: ""; position: absolute;
  left: 4px; top: 25px; width: 11px; height: 1.5px;
  background: var(--ink-faint);
}
```

### Numbered rows (outcome / step lists)
Grid layout with mono number + Spectral heading + body text.

```css
.num-row {
  display: grid; grid-template-columns: 96px 1fr;
  padding: 24px 0; border-top: 1px solid var(--line);
}
.num-row .n {
  font-family: "IBM Plex Mono", monospace;
  font-size: 34px; color: var(--accent); font-weight: 500;
}
.num-row .rc .h {
  font-family: "Spectral", serif; font-size: 30px;
  font-weight: 500; color: var(--ink);
}
```

### Stat row
Large Spectral numeral + IBM Plex Mono caption. Flex row, hairline dividers between stats.

```css
.stat .num {
  font-family: "Spectral", serif; font-size: 78px;
  font-weight: 400; color: var(--accent-deep); line-height: .95;
}
.stat .cap { font-size: var(--t-small); color: var(--ink-soft); margin-top: 16px; }
.stat + .stat { border-left: 1px solid var(--line); padding-left: 40px; }
```

### Cards (feature / standard)
Thin border, 4px radius, light padding. Feature variant uses `--accent-tint` background.

```css
.card {
  border: 1px solid var(--line); border-radius: 4px;
  padding: 38px 38px 34px; display: flex; flex-direction: column;
}
.card.feature { background: var(--accent-tint); border-color: #e7cdbd; }
.card .c-kick { /* IBM Plex Mono label */ font-size: 24px; color: var(--ink-faint); }
.card .c-title { font-family: "Spectral", serif; font-size: 34px; font-weight: 500; }
```

### Pull quote
Spectral italic, clay left border rule.

```css
.pull {
  font-family: "Spectral", serif; font-weight: 300; font-style: italic;
  font-size: 34px; line-height: 1.32;
  border-left: 3px solid var(--accent); padding: 6px 0 6px 30px;
  text-wrap: pretty;
}
.pull .src {
  font-family: "Libre Franklin", sans-serif; font-style: normal;
  font-weight: 500; font-size: var(--t-small); color: var(--accent-deep);
  margin-top: 18px; display: block;
}
```

### Dark / note panels

```css
.darkpanel { background: var(--panel); color: var(--on-dark); border-radius: 4px; padding: 34px 40px; }
.darkpanel .dp-lbl { font-family: "IBM Plex Mono", monospace; font-size: 19px; letter-spacing: .2em; text-transform: uppercase; color: var(--ember); }

.notepanel { background: var(--accent-tint); border: 1px solid #ecd9cc; border-radius: 4px; padding: 30px 38px; }
.notepanel .np-lbl { font-family: "IBM Plex Mono", monospace; font-size: 19px; color: var(--accent-deep); }
```

### Chips (tag pills)

```css
.chip {
  font-family: "IBM Plex Mono", monospace; font-size: 18px;
  letter-spacing: .14em; text-transform: uppercase; font-weight: 500;
  color: var(--accent-deep); background: var(--accent-tint);
  border: 1px solid #ecd9cc; border-radius: 999px;
  padding: 7px 16px; white-space: nowrap;
}
```

### Runner / footer
Absolute-positioned at bottom, full width. Three spans: mark (left), section name (centre), page number (right).

```css
.runner {
  position: absolute; left: 112px; right: 112px; bottom: 46px;
  display: flex; justify-content: space-between; align-items: center;
  font-family: "IBM Plex Mono", monospace; font-size: 20px;
  letter-spacing: .14em; text-transform: uppercase; color: var(--ink-faint);
  padding-top: 18px; border-top: 1px solid var(--line-soft);
}
.runner .mark { color: var(--ink); font-weight: 500; }
```

---

## Layout system

- Slide padding: `112px` horizontal, `84px` vertical
- Grid gap standard: `34px`
- Columns: use CSS Grid `1fr 1fr`, `repeat(3,1fr)`, `repeat(4,1fr)` — always with `gap: 48px` between columns
- Hairline rules: `1px solid var(--line)` — use liberally between sections on a slide
- Avoid drop shadows. Avoid rounded corners > 6px. Avoid gradient fills.

---

## Slide background rhythm

For a multi-slide deck:

| Background | When to use |
|---|---|
| Paper `#ffffff` | Default content slides |
| Desk `#e9e6dd` | Summary / reference / "at a glance" slides |
| Panel `#1f1d19` | Cover, section dividers, closing slide |

---

## Voice & content guidelines

- **Mono kicker** always precedes a title — e.g. `OUTCOME 01` or `BC PRIVACY LAW`
- Titles are **declarative and action-oriented** — "Know the risks that actually matter", not "Risks"
- Use `<em>` sparingly within titles for the italic clay emphasis — one phrase max
- Never use emoji
- Stat numbers use Spectral (not mono) for the large numeral — mono is for labels only
- Column heads use IBM Plex Mono, border-bottom 2px solid `var(--ink)` (on light) or `var(--panel-line)` (on dark)

---

## Accent bar on dark slides

Every dark slide gets a 6px clay top edge:

```css
.slide.dark::before {
  content: ""; position: absolute;
  top: 0; left: 0; right: 0; height: 6px;
  background: var(--accent);
}
```

---

*End of Catalyst Ventures design guidelines.*
