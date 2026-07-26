# Delvion Energy — Design System

Source of truth for every design token in [`src/styles/theme.css`](../src/styles/theme.css).
This document explains _why_ each value is what it is; the CSS is what the app actually
reads. If the two ever disagree, the CSS wins and this file is stale — fix it.

---

## 1. Color

Rebranded in docs/DECISIONS.md — Phase 6, from a brand concept sheet you provided
directly (exact hex values, not to be adjusted for "better" contrast or aesthetics —
see §2 for how to work within them instead). Supersedes the original MASTER.md §7
palette; this file is the current source of truth for color.

Token names read as the Tailwind utility they produce (`bg-surface`, `text-ink`,
`border-line`) rather than transcribing a literal variable name from the brand sheet —
`--color-bg-primary` would generate an awkward `bg-bg-primary` utility, since Tailwind's
own `bg-`/`text-`/`border-` prefix would stutter against a token name that repeats it.

| Token                      | Utility prefix        | Hex       | Role                                                                        |
| -------------------------- | --------------------- | --------- | ---------------------------------------------------------------------------|
| `--color-surface`          | `bg-surface`          | `#F6F5F1` | Paper — default page background                                            |
| `--color-surface-elevated` | `bg-surface-elevated` | `#FFFFFF` | Cards, elevated surfaces                                                    |
| `--color-surface-dark`     | `bg-surface-dark`     | `#163C2E` | Deep Solar Green — dark sections, footer, mobile menu overlay              |
| `--color-ink`              | `text-ink`            | `#14201B` | Default body/heading text                                                  |
| `--color-ink-muted`        | `text-ink-muted`      | `#636B66` | Muted/supporting text                                                      |
| `--color-ink-inverse`      | `text-ink-inverse`    | `#F6F5F1` | Text on dark surfaces                                                      |
| `--color-mercury`          | `bg-mercury`          | `#4FA97E` | Primary accent — CTAs, links, growth. **Fill/icon/border only, see §2**    |
| `--color-dawn`             | `bg-dawn`              | `#E8A94A` | Signature accent — used sparingly, small details only, never a large fill |
| `--color-panel`            | `bg-panel`             | `#C7CCC6` | Secondary — borders, panel motif                                           |
| `--color-line`             | `border-line`         | `#E1E3DE` | Default hairline border                                                    |
| `--color-line-strong`      | `border-line-strong`  | `#C7CCC6` | Emphasized border — literal Panel Silver                                   |
| `--color-success`          | `bg-success`          | `#4CAF50` | Success state — pair with an icon, not color alone                         |
| `--color-warning`          | `bg-warning`          | `#FF9800` | Warning state — pair with an icon                                          |
| `--color-error`            | `bg-error`             | `#F44336` | Error state — pair with an icon                                            |

## 2. Verified contrast pairs (WCAG 2.2, computed, not estimated)

Every ratio below was computed from the exact hex values above using the WCAG relative
luminance formula — not eyeballed. AA requires **4.5:1** for normal text, **3:1** for
large text (≥24px or ≥19px bold) and non-text UI components (icons, borders).

| Foreground            | Background                 | Ratio      | Verdict                                                                    |
| ---------------------- | -------------------------- | ---------- | -------------------------------------------------------------------------- |
| `ink`                 | `surface`                  | 15.37:1    | ✅ AAA                                                                     |
| `ink`                 | `surface-elevated` (white) | 16.77:1    | ✅ AAA                                                                     |
| `ink-muted`           | `surface`                  | 5.03:1     | ✅ AA                                                                      |
| `ink-inverse`         | `surface-dark`             | 11.19:1    | ✅ AAA                                                                     |
| `ink`                 | `mercury` fill             | 5.84:1     | ✅ AA — the only correct mercury pairing                                   |
| `mercury` (as text)   | `surface`                  | **2.63:1** | ❌ Fails — never use mercury as text/link color on a light surface         |
| `mercury` (as text)   | `surface-dark`             | 4.25:1     | ⚠️ Large text/UI (icons, eyebrow labels) only, fails normal body text      |
| `ink`                 | `dawn` fill                | 8.15:1     | ✅ AAA                                                                     |
| `dawn` (as text)      | `surface`                  | **1.89:1** | ❌ Fails — never use dawn as text color on a light surface                 |
| `dawn` (as text)      | `surface-dark`             | 5.93:1     | ✅ AA — dawn's one legible-as-text pairing; prefer it over mercury for small accent labels on dark surfaces |
| `ink`                 | `panel`/`line-strong` fill | 10.29:1    | ✅ AAA                                                                     |
| `ink`                 | `success` fill             | 6.03:1     | ✅ AA                                                                      |
| `white` (as text)     | `success` fill             | 2.78:1     | ❌ Fails                                                                   |
| `ink`                 | `warning` fill             | 7.78:1     | ✅ AAA                                                                     |
| `ink`                 | `error` fill               | 4.55:1     | ✅ AA                                                                      |
| `ink`                 | `line`                     | 12.97:1    | ✅ AAA                                                                     |
| `line`                | `surface`                  | 1.19:1     | Expected — a hairline border isn't text, no AA requirement applies         |
| `line-strong` (panel) | `surface`                  | 1.49:1     | Expected — decorative/emphasis border, not a required UI boundary; use `mercury` (not `panel`) for anything needing a real 3:1 functional boundary (e.g. focus rings) |

**The rule that falls out of this table, stated once so it doesn't get relearned by
trial and error:** on every accent fill in this palette — mercury, dawn, success,
warning, error — **dark `ink` passes AA and white text does not** (or barely does, for
large text only). This is the opposite of the usual "white text on a colored badge"
instinct. Default to dark text on every colored fill unless a specific pair above is
verified otherwise. Mercury and dawn are also both **fill/icon/border colors, not body
text colors** — neither passes AA as small text on the paper background; dawn does pass
as text on the deep-green dark surface specifically, which is why it — not mercury — is
used for small accent labels and icons on dark sections (the hero glow, the
scroll-cinematic eyebrow, `TrustCard`, `WhatsAppButton`).

Consequence for components: `Button` primary (mercury fill) uses dark text per
MASTER.md §48 and the 5.84:1 pairing above. Status badges (success/warning/error) use
dark text + an icon, never colored text directly on the page background, and never
white text.

## 3. Radius, shadow, spacing (§113 §114 §111 §112)

| Radius            | Value | Used by |
| ----------------- | ----- | ------- |
| `--radius-input`  | 14px  | Inputs  |
| `--radius-button` | 16px  | Buttons |
| `--radius-card`   | 20px  | Cards   |
| `--radius-image`  | 24px  | Images  |

Shadows (`--shadow-sm/md/lg`) are low-alpha neutral (`rgb(17 17 17 / 0.03–0.10)`) —
MASTER.md §114 "never use extremely dark shadows."

Section vertical rhythm: 72px mobile / 96px tablet / 120px desktop (§111). Container
widths: 1440px max / 1200px content / 720px reading / 560px form / 900px calculator
(§112).

## 4. Typography (§8 §119 §120)

Exactly 3 font weights exist in the entire system:

| Weight | Family                | Used for                                       |
| ------ | --------------------- | ---------------------------------------------- |
| 400    | Inter                 | Body text                                      |
| 500    | Inter / IBM Plex Sans | UI labels, numerics (stats, calculator output) |
| 600    | Space Grotesk         | Headings                                       |

Type scale tokens (`--text-display` → `--text-fine`) are `clamp()`-based, so the
90%/80% responsive shrink in §120 happens continuously instead of at fixed breakpoints
and cannot produce an overflow:

| Token               | Mobile | Desktop | MASTER.md role  |
| ------------------- | ------ | ------- | --------------- |
| `--text-display`    | 40px   | 64px    | Display         |
| `--text-hero`       | 36px   | 56px    | Hero heading    |
| `--text-section`    | 28px   | 40px    | Section heading |
| `--text-subheading` | 22px   | 28px    | Subheading      |
| `--text-body-lg`    | 17px   | 20px    | Body large      |
| `--text-body`       | 16px   | 16px    | Body            |
| `--text-caption`    | 14px   | 14px    | Caption         |
| `--text-fine`       | 12px   | 12px    | Fine print      |

Fonts are self-hosted, latin-subset woff2 under `public/fonts/` (docs/DECISIONS.md #6).
Inter ships as a single variable-font file spanning weights 400–500 — one `@font-face`
with a weight range covers both, rather than two separate static files.

## 5. Motion (§32 §110)

| Token               | Value                                                                       |
| ------------------- | --------------------------------------------------------------------------- |
| `--duration-fast`   | 200ms — micro-interactions                                                  |
| `--duration-normal` | 350ms — cards, standard reveals                                             |
| `--duration-slow`   | 600ms — hard ceiling per §32                                                |
| `--duration-hero`   | 2200ms — hero timeline total                                                |
| `--ease-calm`       | `cubic-bezier(0.22, 1, 0.36, 1)` — the only easing curve used for entrances |

## 6. Z-index scale

Not part of Tailwind's `@theme` (no utility class is generated), declared as plain
`:root` custom properties and read via `var()` — an explicit scale exists specifically
so nothing ever reaches for an arbitrary `z-[9999]`.

| Token             | Value | Layer                                |
| ----------------- | ----- | ------------------------------------ |
| `--z-dropdown`    | 10    | In-page dropdowns/menus              |
| `--z-sticky-nav`  | 20    | Navbar                               |
| `--z-overlay`     | 30    | Dark scrim behind modals/mobile menu |
| `--z-mobile-menu` | 40    | Mobile menu panel                    |
| `--z-modal`       | 50    | Dialogs (project gallery, etc.)      |
| `--z-toast`       | 60    | Toasts/alerts — always on top        |

## 7. Breakpoints (§94)

Tailwind's default breakpoint scale is redefined to match the spec exactly rather than
left at Tailwind's stock values (whose `2xl` is 1536px, not the 1440px MASTER.md names):

`sm` 375px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1440px · `3xl` 1920px.
Base (unprefixed) styles target 320px.
