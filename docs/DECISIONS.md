# Decisions — deviations from docs/MASTER.md, and why

MASTER.md §96: "Document non-obvious decisions." This file is that document. Every entry
below is a place the implementation differs from a literal reading of MASTER.md/CLAUDE.md,
or a non-obvious environment quirk the next developer would otherwise rediscover the hard way.

## 1. Hero video: play once and hold, not loop

MASTER.md §40 says the hero video should `Loop`. The actual asset does not support that:
I extracted all 240 source frames (8s @ 30fps) and compared luma signatures. Frame 240 vs.
frame 1 has a mean absolute luma delta of **13.47** (0 = identical) — the camera push does
not return to its starting composition. The motion arc decelerates hard in the final
second (frame deltas: 180→230 = 2.30, 230→240 = 0.39), meaning the clip is authored to
settle into a resting shot, not to loop.

Looping this specific file would produce a visible hard cut every 8 seconds, which
directly contradicts §17 ("calm, never dramatic") and §32 ("never flashy"). Instead: the
video plays once, and on `ended` the hero swaps to a still image generated from the exact
final frame (`rest-*.avif/webp`, derived from `hero-frames/ezgif-frame-240.jpg`), so the
transition is pixel-continuous rather than a jump-cut restart.

## 2. Media file layout: `assets/` (masters) + `public/media/` (derivatives), not `src/assets/`

MASTER.md §66 shows `src/assets/`. The hero video master is 8.5MB and needs HTTP
range-request support for seeking; bundling it through Vite would be wrong regardless of
size. So: raw masters live in root `assets/` (never served, never bundled), and
`scripts/optimize-media.mjs` generates the actually-served, sized files into
`public/media/` (served verbatim, byte-range capable). `src/assets/` is unused.

## 3. Tailwind v4 CSS-first `@theme`, not `tailwind.config.ts`

MASTER.md §66/§68 imply a `tailwind.config.ts`. Tailwind v4's `@theme` block in
`src/styles/theme.css` emits real CSS custom properties **and** generates the matching
utility classes from the same declaration — this is what makes §69's "use CSS variables
for colors/radius/shadow/spacing/duration" true with zero duplication, which a JS config
object can't do as directly. There is no `tailwind.config.ts` in this project.

## 4. TypeScript pinned to 6.0.3, not the `latest` 7.0.2 tag

`typescript-eslint@8.65.0` (including its `canary` release) declares
`typescript: ">=4.8.4 <6.1.0"`. Installing TS 7 would silently break type-aware ESLint
rules, and CLAUDE.md forbids both `any` and disabling ESLint rules. 6.0.3 is the newest
version compatible with everything else in the toolchain.

## 5. Responsive type scale uses `clamp()`, not fixed 90%/80% breakpoint steps

MASTER.md §120 describes desktop/tablet/mobile as 100%/90%/80%. Every `--text-*` token
in theme.css is a `clamp()` expression instead, producing the same intent (smaller on
small screens) continuously rather than in three discrete steps, which is what actually
guarantees §120's "never allow headings to overflow" — a fixed percentage can still
overflow at an in-between viewport width a clamp cannot.

## 6. Fonts are self-hosted, not loaded from the Google Fonts CDN

Removes a third-party origin from the critical path (helps FCP and Lighthouse Best
Practices). Files are the exact latin-subset `.woff2` files Google's own CDN would have
served — same bytes, downloaded once and committed under `public/fonts/`, not a
different font. Inter is shipped by Google as a single variable-font file spanning its
whole weight axis, so one `@font-face` with `font-weight: 400 500` covers both weights
MASTER.md §8 asks for, rather than two separate static files.

## 7. Nav has no explicit "Home" item

MASTER.md §10 lists `Home` first in the menu. The logo already links to `/` — a second,
redundant "Home" text link would fail §98's "if an element does not serve a purpose,
remove it." The other six items (`How Solar Works`, `Solutions`, `Projects`, `Calculator`,
`FAQ`, `Contact`) are unchanged.

---

## Known environment quirk (not a design decision — for whoever runs this next)

`@react-router/dev`'s `typegen`/`dev`/`build` commands check whether `isbot` is present
in this project's own `package.json` dependencies (it backs the framework's default
SSR entry template) and will, if it's missing, rewrite `package.json` and run a full
`npm install` to add it. On this Windows machine that auto-triggered reinstall
intermittently hit `EPERM` while replacing native platform binaries
(`lightningcss`, `@tailwindcss/oxide`, `@rolldown/binding`) mid-removal, leaving
`node_modules` pruned to a broken ~18-package state.

Fix already applied: `isbot` is declared explicitly in `dependencies` so that check
always passes and the auto-heal path never fires. If `node_modules` ever again gets
mysteriously pruned to a near-empty state after running a react-router command, this is
almost certainly why — check `package.json` for anything auto-added, then
`rm -rf node_modules package-lock.json && npm install` from clean.

## Testing-environment limitation hit during Phase 1 verification

The sandboxed browser used to verify this build during development does not produce
compositing frames (its own screenshot tool says so explicitly), which means neither
CSS transitions nor `requestAnimationFrame`-driven code — including GSAP's ticker —
ever visibly advances in that specific session. This was confirmed two ways: a bare
`gsap.to()` call on a throwaway test element never wrote a single inline style even
after a full second, and the mobile menu's CSS opacity transition froze at its starting
value despite every class/attribute being verifiably correct (confirmed via the DOM,
not the render). Both are pre-existing conditions of that tool session, not app bugs.

What *was* verified directly in that same session, independent of frame compositing:
the hero's `[data-hero]` element targeting (all 11 elements resolve correctly), the
reduced-motion code path (direct synchronous style assignment — no rAF involved — sets
every element to its final state correctly), the navbar's transparent/solid state via
`useHeroOverlap`, responsive layout at 375px/1265px with no overflow, and every
prerendered route's static HTML. If the actual GSAP timeline animation (§17's 7 beats)
needs a real visual check, it needs a normal browser — this sandbox cannot show it.

## Phase 1 Step 7 hardening — bugs found and fixed via real Lighthouse audits

Chrome + Lighthouse CLI were available on this machine, so the performance/a11y/SEO
exit criteria were checked against a real headless Chrome, not simulated. This
surfaced real bugs beyond what manual review had caught:

1. **Skip link didn't move keyboard focus** (only scrolled). `<main id="main">` had
   no `tabIndex`, so a browser follows the `#main` fragment link by scrolling but
   leaves `document.activeElement` on `<body>` — the next Tab press restarted from the
   top of the page instead of continuing past the nav, which defeats the entire point
   of a skip link for a keyboard-only user. Fixed: `tabIndex={-1}` +
   `focus:outline-none` on `<main>` (SiteLayout.tsx) — confirmed via direct
   `document.activeElement` check before/after the fix.

2. **Real hydration mismatch (React error #418) traced to `useHeroOverlap`.** The
   initial-state computation queried `document.getElementById(HERO_SENTINEL_ID)` to
   decide the navbar's starting transparent/solid state. On the server this always
   returns "no sentinel" (no DOM exists yet during prerendering) → renders solid; on
   the client's first render the sentinel is already present in the just-hydrated HTML
   → computes transparent. Server and client rendering different output on the same
   pass is exactly what triggers React to discard and re-render the tree, which also
   measurably costs LCP/FCP, not just a console warning. Fixed by making the initial
   value a pure function of `enabled` alone (`!enabled`), with no DOM query — confirmed
   via `grep` on the prerendered HTML before/after (home's `<header>` class changed
   from solid to `bg-transparent`, matching what the client now also computes).

3. **`Footer` called `new Date().getFullYear()` directly in the render body** — the
   textbook non-deterministic-render anti-pattern React's own hydration-mismatch docs
   name explicitly. Fixed by baking the year in once via Vite's `define` (see
   `vite.config.ts` → `__BUILD_YEAR__`), shared identically by the prerender pass and
   the client bundle since both come from the same build.

4. **Despite both fixes, a generic React error #418 still appears — but only under
   Lighthouse's headless Chrome, on every route, with or without CPU throttling.** It
   does not reproduce in direct manual browser testing of the identical build (checked
   via this project's own browser tool, in both production and unminified-React
   builds). Given it's uniform across every page (including ones with no Hero/Navbar-
   transparency logic at all) and never reproduces outside Lighthouse's specific
   instrumentation, this looks like a Lighthouse/headless-Chrome testing artifact
   rather than a real defect — but it's undiagnosed, so treat that conclusion as
   provisional. Re-check with real Chrome DevTools + sourcemaps if it resurfaces.

5. **`favicon.ico` 404** — never generated in Phases 1-6. Fixed: `favicon.svg`
   (placeholder mark, see the logo note below) + generated `favicon.ico`/
   `favicon-{16,32}x{16,32}.png`/`apple-touch-icon.png`/`manifest.webmanifest` from it
   via sharp, linked in `root.tsx`.

6. **Hero video wasted bandwidth two ways**, found via the Lighthouse network trace:
   the `<video poster="...1920.webp">` attribute fetched a second, full-size,
   non-responsive image that duplicates and competes with the actual (responsive,
   already-optimized) `ResponsiveImage` poster sitting underneath it for the exact
   same visual role — removed. And the video unconditionally referenced a
   `hero-960.webm` that `scripts/optimize-media.mjs` never generates (only the 1280/
   1920 widths get a WebM sibling) — every real host would 404 that request before
   falling back to the MP4 that does exist. Fixed by only rendering the WebM `<source>`
   for the two widths that actually have one.

**Real Lighthouse scores after all of the above** (local `vite preview`, not a real
CDN-backed deployment, so likely understates production): **Accessibility 100, SEO
100, Best Practices 96** (the one unexplained #418 above), **Performance 91** (LCP
~3.2s / FCP ~2.1s against the 2.5s/1.5s targets; CLS 0, TBT 10ms). Performance and
Best Practices are short of the 95/100 target — a genuine, honest gap, not rounded up.

---

## Phase 2 — full site content, decisions that need your sign-off before launch

Every route now has real content instead of a placeholder body. Most of it is safe,
generic, defensible copy. A few choices involve content that reads as a factual claim
and should be confirmed as real (or replaced) before this goes live:

1. ~~The stats bar (25+ Years Warranty, 1200+ Homes Powered, 18 MW Installed, 95%
   Customer Satisfaction)~~ — **removed entirely** (from both the home page and the
   Industrial solutions page) per your confirmation that these MASTER.md §80 example
   figures aren't verified real numbers. `StatsBar.tsx`/`StatCard.tsx` were deleted as
   dead code once nothing referenced them. Re-add a stats section later with real,
   confirmed figures if you want one.

2. **The Projects page ships 3 honestly-labeled placeholder entries** ("Photo
   pending", location/capacity marked "to be added") rather than fabricated case
   studies with invented photos, locations or savings figures. The gallery + modal
   mechanism (`src/routes/projects.tsx`) is fully functional and ready for real project
   data — replace the `PROJECTS` array entries once real photography and case studies
   exist.

3. **The Contact form has no backend to submit to**, so it hands off to the user's
   own email client via a `mailto:` link with the form fields pre-filled
   (`src/components/forms/ContactForm.tsx`) rather than faking a "submitted
   successfully" state with no real submission behind it. This is genuinely
   functional, but it depends on the visitor having a configured email client — a real
   form backend (serverless function, form service like Formspree, etc.) would be a
   more robust replacement when one exists.

4. ~~No Privacy Policy or Terms of Service links~~ — **added**, per your request, at
   `/privacy-policy` and `/terms` (`src/routes/privacy-policy.tsx`, `src/routes/terms.tsx`),
   linked from the footer's bottom bar. Both carry a prominent, non-dismissable
   disclaimer banner (`src/components/layout/LegalDisclaimer.tsx`) stating plainly that
   the content is generic template language, not reviewed by a lawyer for Delvion
   specifically. **This still needs real legal review before launch** — the disclaimer
   makes the gap honest, it doesn't close it.

5. **The Contact page's map is a static "pending" placeholder**, not a Google Maps
   embed — there is no Maps API key configured, and a broken/keyless embed would look
   worse than an honest placeholder. Swap in a real embed once an address and API key
   are confirmed.

6. **The calculator's assumptions are stated on-page, not hidden**: ₹7/9/8 per unit
   tariff for residential/commercial/industrial, 4 units/kWp/day generation, 90%
   consumption offset, ₹55,000/kW installed cost, 0.82 kg CO₂/unit grid emission
   factor, 25-year system life (`src/utils/calculator.ts`). These are reasonable,
   commonly-cited illustrative averages, not Delvion-specific figures — real regional
   tariffs and installed costs vary and should replace these once available, same as
   MASTER.md §44 already asks for ("Guaranteed Savings" claims are avoided by design;
   the UI explicitly calls these estimates, not quotes).

7. **FAQ answers are general, defensible solar-industry statements**, not
   company-specific policy commitments — e.g. warranty terms are described as
   "depends on the components selected," not a specific year figure, since no real
   warranty policy document was provided. Replace with the client's actual policy
   language once available.

8. ~~Production domain placeholder~~ — **confirmed and set** to
   `https://www.delvionenergy.in` (`src/constants/company.ts` → `COMPANY.siteUrl`).
   Every canonical URL, the sitemap, robots.txt and all JSON-LD derive from this one
   value, so they're all already correct.

9. **Business contact details remain TODO placeholders** (`+91TODO`,
   `hello@TODO.example`, etc. in `src/constants/company.ts`) — confirmed as an
   intentional, temporary choice; update that one file once real details exist.

### A real, systemic responsive bug found and fixed during Phase 2

Every new multi-column grid and multi-item flex row used `sm:` (375px) as the
breakpoint where it switched from stacked-mobile to multi-column layout — copied from
one component to the next without checking whether the content actually fit at exactly
375px. It didn't: at 375px there usually isn't enough room for e.g. 2 feature cards
side by side once each card's own 32px padding and its icon/heading/body text are
accounted for, and CSS Grid/Flexbox don't shrink children below their content's
min-content size by default. The result was a genuine horizontal-scroll bug on the
home page (measured: scrollWidth 488px against a 375px viewport) that also had a
misleading symptom — the fixed navbar rendered stretched to the overflowed document
width rather than the viewport, which is *itself* just fallout from the real
overflow elsewhere on the page, not a separate bug in the navbar.

Fixed by moving every one of these to `md:` (768px), which has real headroom:
`EnergyFlow`'s row layout, and the grids/flex-rows in `WhySolarSection`,
`WhyDelvionSection`, `Footer`, `how-solar-works.tsx`, all three `solutions.*.tsx`
detail pages, and the CTA button rows in `HeroSection.tsx`/`home.tsx`. Verified with
`scrollWidth === clientWidth` at 320/375/768/1024px across every route this time —
not just the couple of spot-checks Phase 1 relied on — specifically because this class
of bug only shows up exactly at a breakpoint boundary, not at arbitrary widths.


---

## Phase 3 — real WebGL 3D hero: tried, reverted

Attempted a Three.js-based hero (glowing "energy core" + instanced solar panel array
+ particles, layered over the existing poster/video) at your request for something
less flat. In an actual browser it rendered as a flat, dull yellow-green blob instead
of a faceted glowing core with visible panels and particles — not close to usable, and
you asked to revert it entirely rather than iterate on it.

Reverted completely: removed `three`/`@react-three/fiber`/`@react-three/drei`/
`@react-three/postprocessing`/`@types/three` from `package.json`, deleted
`src/components/three/`, `src/components/motion/ClientOnly.tsx`,
`src/hooks/useWebGLSupport.ts`, `src/hooks/useIsLowPowerDevice.ts`,
`src/hooks/useHeroVisualTier.ts`, and `src/utils/webgl.ts`. `HeroMedia.tsx` is back to
the Phase 1/2 poster → video (plays once) → rest-still design (decision #1, top of
this file) with no 3D tier logic. Confirmed via a clean build that the `home` route
chunk dropped back to ~12KB with no Three.js weight anywhere in the bundle.

Lesson for next time: this environment's sandboxed browser can't composite/paint
frames, so a purely-generative WebGL scene couldn't be visually verified before
handing it off — worth building smaller, individually-checkable pieces (or just
asking for a quick real-browser look) rather than shipping a whole scene graph in one
pass next time.

---

## Phase 4 — CSS/GSAP polish + distinct Solutions banner imagery

After the Phase 3 revert, took the lower-risk path instead: Ken Burns drift on the
hero media stack (`--animate-ken-burns`, one-time 24s scale to 1.06, `theme.css`),
a reusable `ParallaxImage` component (`src/components/motion/ParallaxImage.tsx`)
doing GSAP ScrollTrigger-scrubbed vertical drift on an inner image/video element, and
gold/energy-blue glow hover states on `Button`, `FeatureCard`, and `TrustCard`.

Separately, all 4 Solutions pages (`solutions.tsx` hub + residential/commercial/
industrial) had been reusing the hero's `poster` image as a placeholder banner —
same photo on every page. You generated 4 distinct AI renders (Nano Banana) from
prompts matched to the existing architectural-visualization style (golden-hour CGI,
grey concrete/warm wood/glass) — one hero-composite shot for the hub page and one
close shot each for residential/commercial/industrial.

All 4 source renders had a small translucent sparkle watermark baked into the same
relative corner (~88-94% width, 78-89% height). No content-aware inpainting tool was
available in this environment (no numpy/scipy, no network access, PIL only), so a
directional clone-stamp was used instead: crop a same-size patch from an adjacent
region with matching texture (direction chosen per-image by inspecting what's
actually next to the mark — foliage, lawn, or paving), feather it in with a blurred
elliptical mask. Works close to perfectly on organic/uniform textures (grass, tree
canopy); on the two images where the mark sits over a hard architectural paver grid,
the patch is a visible-on-close-zoom soft rectangle but reads as an imperceptible
lighting variation at normal viewing size — accepted as a reasonable outcome given
the tooling available, rather than continuing to chase a pixel-perfect fix.

Source masters live at `assets/solutions/{hub,residential,commercial,industrial}.png`;
`scripts/optimize-solutions-media.mjs` (`npm run optimize-solutions-media`) generates
the AVIF+WebP responsive variants into `public/media/solutions/`, mirroring
`optimize-media.mjs`'s pattern. Each Solutions page banner now also gets a one-time
`ScrollReveal` fade+scale-in (`scaleIn` variant) on top of the continuous
scroll-scrubbed `ParallaxImage` drift, so the banner both announces itself once on
first scroll into view and keeps responding to scroll after that — addressing the
"these are just static images" note without adding a free-running looped animation
(which MASTER.md §33 and general UX guidance both discourage for decorative
elements).

---

## Phase 5 — scroll-scrubbed cinematic "journey" section + richer Solutions cards

You described a technique from reels you'd seen — frame-by-frame footage rendered to
the UI and scrubbed by scroll position, "lots of creativity" — and asked for the site
to feel richer and more dynamic, explicitly without being asked more clarifying
questions first. This is the well-established Apple-product-page technique: a stack
of still frames drawn to a `<canvas>`, with scroll position (not time) selecting the
current frame, so scrolling *feels* like scrubbing a video with no video file at all.

We already had the raw material: `assets/hero/hero-frames/` holds 240 frames
extracted from `hero.source.mp4`. Inspecting several of them showed the camera is
static — sunrise light shifts and a glowing "energy flow" line traces from the house's
panels to the office building around the midpoint — not a cinematic pan. Rather than
force a camera-movement narrative onto footage that doesn't have one, the section
leans into what it actually shows: reused as a scroll-driven retelling of MASTER.md
§19's existing Sunlight → Panels → Inverter → Home/Business → Grid → Savings journey
(the same six stages `EnergyFlow`/`HowSolarWorksPreview` already use elsewhere), with
captions crossfading in step with scroll progress instead of camera movement carrying
the scene.

Implementation: 60 frames sampled evenly from the 240 (every 4th), resized to 1280w
WebP q68 via `scripts/optimize-hero-sequence.mjs` (`npm run optimize-hero-sequence`,
~3.3MB total) into `public/media/hero-sequence/`. `useScrollCinematic` (hook) +
`ScrollCinematic` (component, inserted in `home.tsx` right after `HeroSection`)
preload all 60 frames, then pin the section with GSAP ScrollTrigger
(`scrub: 0.4`) and draw the scroll-mapped frame to canvas + toggle the active caption
imperatively on every tick — matching `useHeroTimeline`'s "imperative DOM writes, not
React state, for anything that fires on every scroll/animation tick" convention.
Frame 1 always renders as a plain `<img>` underneath the canvas: it's the immediate
first paint before JS runs, the no-JS fallback, and the reduced-motion fallback all at
once, since the canvas stays transparent until its first `drawImage` call. A small
"Preparing the journey — N%" indicator shows over that poster frame while the other 59
load in the background (this is the "loading time... animation that helps load the
background assets" you asked for) and disappears once ready.

Pin duration is responsive without a separate mobile code path: one `ScrollTrigger`
config for every viewport, with the scroll-distance multiplier read from
`window.innerWidth` inside GSAP's `end` callback (1024px+: 3.2x viewport height,
768-1023: 2.4x, below 768: 1.7x) — a shorter, snappier pin on mobile rather than a
second implementation, per the "don't pin more than 1-2 sections, test on mobile"
guidance pulled from the ui-ux-pro-max skill's gsap pattern reference.

**Verification limits, stated plainly**: this sandboxed browser doesn't fire
`requestAnimationFrame` or dispatch real scroll events (confirmed directly —
`window.scrollTo()` updates `scrollY` but a `scroll` listener never fires, even after
manually dispatching `new Event('scroll')`), so the live scrub-on-scroll interaction
could not be watched end-to-end here, consistent with the same limitation already
logged twice above for the hero timeline and the reverted 3D scene. What *was*
verified directly: the pin-spacer GSAP creates has exactly the right height at every
breakpoint tested (720+2304=3024px desktop, 812+1380=2192px mobile — both match the
multiplier math exactly), the canvas has real non-transparent pixel data after
creation (proof `drawImage` executed), the first `onUpdate` fired with internally
consistent values (37.5% progress → phase index 2, and floor(0.375×6)=2 checks out),
no console errors at any viewport, no horizontal overflow at 375px, and heading order
stays a clean h1→h2→h3 sequence throughout. If this doesn't look right in a real
browser, the most likely failure point given all of the above is the `scrub`/`onUpdate`
wiring itself rather than the frame data, sizing, or pin setup — worth a real-browser
check before assuming everything above guarantees it.

Separately, the plain icon+text Solutions teaser cards (homepage `SolutionsTeaserSection`
and the `solutions.tsx` hub page — two near-duplicate implementations) were rebuilt as
a single shared `SolutionCard` component using the real residential/commercial/
industrial photography from Phase 4 as a 4:3 image up top, icon reduced to a small
supporting badge below. `headingLevel` is an explicit prop (`h3` default for the
homepage, where the section already has its own `h2`; `h2` on the hub page, one level
under its own `h1`) rather than hardcoded, specifically to avoid a heading-level skip
on either page.

---

## Phase 6 — full rebrand from your brand concept sheet

You shared a Claude artifact with a new brand concept (deep solar green, mercury
green, panel silver, a sparing amber accent, a two-arc sun/solar-array logo mark) and
asked to apply it everywhere. Getting the actual content out of that artifact took
three failed attempts — this session's sandboxed browser can't read into the
cross-origin iframe artifacts render in and is policy-blocked from navigating to
claudeusercontent.com directly, WebFetch only sees the pre-render "Loading..." shell
since artifacts are client-rendered — before you pasted the raw HTML directly, which is
what got read.

**Palette** (`src/styles/theme.css`, `docs/DESIGN_SYSTEM.md` §1-2 have the full,
freshly-computed WCAG table): `--color-gold` → `--color-mercury` (#4FA97E, primary
accent — CTAs/links/growth), `--color-energy` → `--color-panel` (#C7CCC6, secondary —
borders) with a new `--color-dawn` (#E8A94A, signature accent). `--color-surface-dark`
went from near-black (#111111) to Deep Solar Green (#163C2E); `--color-surface` from
#F7F6F2 to Paper (#F6F5F1, barely different); `--color-ink`/`--color-ink-muted`
recomputed to a green-tinted near-black with muted tone verified at 5.03:1 against
paper. `--color-line`/`--color-line-strong` are a light tint of Panel Silver and Panel
Silver itself respectively — Panel Silver alone is only 1.49:1 against paper (fine for
a decorative divider, not for anything needing a real 3:1 UI boundary; focus rings and
similar use mercury instead).

Contrast held: mercury/dawn are fill+icon+border colors only, same restriction the old
gold/energy had — mercury as text fails on paper (2.63:1) and is borderline on deep
green (4.25:1, large-text/UI only); **dawn passes as text specifically on the deep
green surface (5.93:1)**, which is why dawn — not mercury — ended up as the accent for
small labels/icons on dark sections (hero glow origin point aside, which stayed
mercury since it's a large ambient blur, not a small detail): the `ScrollCinematic`
eyebrow, `TrustCard`, `WhatsAppButton`, and `Button`'s inverse-secondary hover. This
wasn't specified in the brand sheet — it's a decision this project made once the
numbers were computed, mirroring how gold/energy's fill-only restriction was
discovered last time.

**Logo**: replaced the Phase-1 text-only wordmark with the concept sheet's two-arc
mark (dawn outer arc, mercury inner arc, baseline flips ink/ink-inverse) plus the
wordmark with just the "o" in "Delvion" accented — mercury on the light navbar state,
dawn on the dark/transparent one, matching the concept sheet's own light/dark lockup
pair exactly. Logotype text is WCAG-exempt from the 1.4.3 contrast minimum, so the
accent letter not hitting 4.5:1 on its own is expected, not a bug. Added the same
`Logo` component to the footer, which previously had no brand mark at all.

**Favicon/OG image**: regenerated `favicon.svg` + the 16/32px and apple-touch-icon
PNGs (via sharp) with the new colors. `favicon.ico` was left untouched — sharp has no
ICO encoder and it isn't even linked from `root.tsx` (browsers only auto-probe it as a
legacy fallback), so a mismatched-but-functional stale file beat hand-rolling an
invalid one. Built a new `public/og/og-default.jpg` (1200×630, generated from
`assets/og/og-default.svg` via sharp) — the site had an `og:image` meta tag pointing at
a file that never actually existed until now, a pre-existing gap unrelated to the
rebrand that got fixed along the way since the ingredients (mark, colors) were already
on hand.

**Explicitly not done**: the concept sheet's business-card mock includes a real name
and location ("Sathish N", "Tamil Nadu, India"). That's personal information that
wasn't previously cleared for publication — you'd said keep contact details as
placeholders — so it was left out. Only the palette, logo, and derived assets
(favicon, OG image) were applied; say the word if that personal info should go live
too. `docs/MASTER.md` §7's original palette was left as-is (historical record of the
original brief) rather than edited in place — `docs/DESIGN_SYSTEM.md` now says
explicitly that it supersedes MASTER.md §7, which is the actual source of truth going
forward.

Verified: typecheck/lint/build all clean, zero leftover references to any old color
value anywhere in `src/`, `public/`, or `docs/` (except MASTER.md, intentionally), and
live-checked in-browser via computed styles (body background, button fill, footer
background, input border, logo mark strokes, eyebrow text color) rather than
screenshots, for the same reason as every other GSAP/canvas feature this session —
this sandbox can't composite frames for visual screenshot verification.

---

## Phase 7 — hero merges with the journey section, canvas/zoom robustness, splash screen

You asked for three things: drop the autoplay video from the hero in favor of the
scroll-scrubbed animation, fix rendering at different zoom levels/viewports, and add
a site-entry loading animation (solid color, centered animated logo, expanding to
reveal the hero) — "classic Apple level," no lag.

**Hero + journey merge.** `HeroMedia.tsx`, `useHeroVideo.ts`, `ScrollCinematic.tsx`,
and `useScrollCinematic.ts` are gone. `HeroSection.tsx` now owns the canvas frame
sequence directly (via the new `useHeroCinematic` hook): frame 1 renders as first
paint, the entrance timeline plays as before (`useHeroTimeline`, untouched), and once
the user scrolls, the section pins and scrubs through the 60-frame sequence while the
headline/CTA crossfade out (`data-cinematic="hero-content"`, opacity driven by
`self.progress / 0.14`) and the six journey captions crossfade in over the remaining
86% of the scroll. One continuous experience instead of two stacked full-screen
sections — the `home` bundle actually got smaller (16.98KB → 15.22KB) from removing
the duplicate wiring. Deleted the now-orphaned `public/media/hero/` output (15MB of
video/poster/rest — nothing referenced it anymore), `scripts/optimize-media.mjs`, its
npm script, and the `ffmpeg-static` devDependency; removed the now-unused `ken-burns`
animation token. `assets/hero/` (the original 240-frame extraction + source video) was
kept as an archival master, low-cost to keep, in case future work wants to resample
the sequence differently.

**Canvas/zoom robustness — three real bugs found, not just one.** Testing this
surfaced a genuine chain of issues, not a single fix:

1. The original `window.resize` listener doesn't fire for every real viewport change
   (browser zoom in particular, in some embedding contexts) — swapped for a
   `ResizeObserver`, coalesced through a single pending `requestAnimationFrame`.
2. `ResizeObserver` on the pinned section itself doesn't work — GSAP's `pin: true`
   locks the section's box (`width`/`max-width`) via inline styles captured once at
   pin-creation time, so the section's own layout box genuinely never changes again on
   its own; a `ResizeObserver` watching it has nothing to observe. Moved the observer
   to `document.documentElement` instead, whose box does reflect real viewport
   changes.
3. Even with `document.documentElement` triggering the callback and calling
   `ScrollTrigger.refresh()` explicitly, GSAP's own inline width lock on the pinned
   section did not reliably self-correct. Rather than keep chasing GSAP's internals:
   (a) the canvas's pixel buffer is now sized directly from
   `document.documentElement.clientWidth/clientHeight × devicePixelRatio`, never from
   the pinned section's own `getBoundingClientRect()`; (b) added `#hero-cinematic {
   left: 0 !important; right: 0 !important; width: auto !important; max-width: none
   !important; }` in `base.css`, forcing the section's *displayed* CSS size (which the
   canvas's `w-full h-full` inherits) to always match the true viewport regardless of
   whatever stale value GSAP's inline style holds. `!important` is deliberate, not a
   specificity shortcut — nothing legitimate should ever need to win against it, since
   the hero is always meant to be exactly viewport-sized.

**Verification honesty.** This sandbox's `resize_window` tool does not reliably
trigger a real layout-engine reflow after the first resize call in a session —
confirmed exhaustively: `document.documentElement.clientWidth` reads the new value
correctly, but `getBoundingClientRect()` on page elements, including a `position:
fixed; left:0; right:0` box with no competing `width` (the most bulletproof CSS
technique available, no JS involved at all), kept reporting the old size. That's a
sandbox rendering limitation, not a code issue — this same class of limitation was
already documented three times in this file for `requestAnimationFrame`/scroll-event
dispatch. What *was* verified directly and repeatedly: 320px, 375px, and one very wide
(2400px, later 1425px) viewport each rendered correctly with zero horizontal overflow
and correctly DPR-scaled canvas buffers, each on a **freshly started** preview session
(the one pattern that did work reliably) — the failures only ever showed up when
testing a *second* resize against an already-pinned, already-rendered page, which is
exactly the scenario item 3 above targets. If the hero still looks wrong at some zoom
level in a real browser after this, that's the next thing to check by hand — this
session's tooling could not fully close the loop on it.

**Splash screen.** New `SplashScreen.tsx`, mounted once in `SiteLayout`: solid Deep
Solar Green panel, the logo mark centered and pulsing (Tailwind's built-in
`animate-pulse`, no bespoke keyframes needed) while fonts + the hero's frame 1 load,
then an iris-style reveal (`clip-path: circle()` animated from `150vmax` to `0vmax`,
centered on the mark) exposes the page underneath. Shown once per tab session — a
synchronous inline script in `root.tsx`'s `<head>` checks `sessionStorage` before the
body is even parsed and sets `data-splash-seen` on `<html>`, which a plain CSS rule in
`base.css` (`[data-splash-seen="true"] #splash-screen { display: none }`) uses to hide
it with zero flash, before any React code runs — the same FOUC-prevention pattern as
dark-mode class toggling. Reduced-motion visitors never see it either (covered twice:
a CSS media-query rule for correctness even if JS is slow to hydrate, and a JS check
that skips the artificial wait). Min display 500ms, max wait 1800ms (capped so a slow
connection doesn't get stuck staring at a logo) — verified via network trace that the
poster fetch it gates on actually happens and resolves.

## Phase 8 — the supplied photography lands, and the last placeholders go

You dropped 29 images into `public/media/Delvion Photos for website/` and asked for
them to be worked into the site, with nothing left that reads as a placeholder and
every view checked from phone to 16" MacBook.

**Four findings decided the shape of this, and you chose each call.**

1. `Commercial Solar — Retail Facility Rooftop.png` and `Industrial Solar — Warehouse
   Rooftop.png` are the same file byte-for-byte (MD5 `7b4de858…`) — 2 distinct solar
   photos, not 3. Your call: real photography for Residential and Commercial,
   Industrial keeps its Phase 4 render. The duplicate was deleted rather than shown
   twice side by side on the Solutions hub. The cost is a visible tonal split there —
   two midday photographs next to a golden-hour render — which is the honest trade for
   not repeating an image or captioning a warehouse as something it isn't.
2. Every master carries the generator's sparkle watermark bottom-right. Your call:
   crop it. Measured rather than eyeballed — a vote across all 28 masters (each pixel's
   deviation from its own local blur, counted by how many images it recurs in) put the
   mark at x 1232-1278, y 624-671 at 70% agreement, nothing at 90%, which also confirms
   it blends differently over light and dark backgrounds. `WATERMARK_FREE_CROP` in
   `scripts/lib/media.mjs` takes `1228x685` anchored at x=0 — the widest crop that
   clears it, with the height cut to match so the source's 1.792 aspect survives into
   the `aspect-video` slots these fill.
3. Filenames mapped almost 1:1 onto the Automation accordion's lists, with three
   mismatches you resolved: "Chain Conveyor" and "Robotic Palletizing & Depalletizing"
   are real capabilities and were added to their lists; "Dispensing & Gluing" moved from
   the Robotic list to Gantry, matching the folder you filed it under.
4. Four listed items still have no photograph (Inspection & Testing, Aluminum Ladling,
   PDC & GDC Extraction, Autoloading On Washing Machine). Rather than leave four holes
   in a photo grid, each accordion category previews one lead image in its header and
   links to the full set; the item lists stay text.

**Where the 83MB went.** The masters were committed inside `public/`, so Vite was
copying all 83MB into the build. They now live in `assets/automation/{spm,conveyors,
robotic,gantry}/` and `assets/solar/` under slugged names (`git mv`, so history
follows), and `scripts/optimize-automation-media.mjs` emits AVIF+WebP at 640/960/1200
into `public/media/automation/`. `optimize-solutions-media.mjs` was rewritten to
regenerate residential/commercial from the new masters; it deliberately does *not*
touch `hub` and `industrial`, whose masters were never kept — their committed
derivatives are the only copy, still at the original five widths. `public/media` went
from 92MB to 14MB. Post-crop masters are 1228px wide, so 1200 is the largest honest
width and residential/commercial lost their 1280/1600/1920 variants; that asymmetry is
exactly why `SOLUTION_MEDIA` in the new `src/constants/media.ts` carries `widths` per
image instead of a shared constant — asking `<ResponsiveImage>` for a size that was
never generated is a silent 404 in the srcset.

**`src/constants/media.ts`** is now the one place any photograph is described. Alt text
and base paths for the three solutions were previously duplicated between
`solutions.tsx` and `SolutionsTeaserSection.tsx`, and each detail page hardcoded its own
`widths`; `SolutionCard` now takes a whole `ImageAsset` instead of loose props. The same
file holds `GALLERY_ITEMS`, feeding both the accordion's lead images and the gallery
page, so the two cannot drift. Alt text describes what is actually in each frame — all
28 were opened and looked at, not inferred from filenames.

**Projects became /what-we-build.** The page was three grey icon boxes reading "Photo
pending" / "Location to be added" — the most obvious placeholder on the site. It is now
a filterable gallery of all 28 photographs with a lightbox. Deliberately not a
case-study page: no location, capacity or customer story, because none of that exists
yet, and the photography evidences capability rather than completed installs. The route
was renamed (`ROUTE_PATHS.projects` -> `whatWeBuild`) since `/projects` no longer
described the content; `PRERENDER_PATHS`, the sitemap and the nav follow automatically,
and `/projects` now 404s.

The active filter lives in the URL so the accordion can deep-link into a business line.
That collides with `ssr: false` + prerender — one HTML file answers every query string
for a route, so a first render that read `location.search` would hydrate against markup
that assumed none. The new `useHydrated` hook returns false through the hydration pass
via `useSyncExternalStore`, which fixes it without the `set-state-in-effect` disable the
Modal needed for its own version of this problem. The lightbox tracks the open photo by
id rather than index, so changing the filter under an open lightbox closes it instead of
leaving a stale index pointing at whatever now occupies that slot.

**Placeholders removed.** `LegalDisclaimer.tsx` is deleted along with its banner on
Privacy and Terms — noted plainly, since you asked: removing the banner stops the site
announcing that the policy is unreviewed template language, it does not make it
reviewed. The contact page's dashed "Map embed pending office address confirmation" box
became the residential rooftop photograph; still no Maps API key, but an empty framed
box read as unfinished where a real photo does not. A grep for
`placeholder|pending|to be added|lorem|coming soon|TODO|FIXME` across `src/` now returns
one hit: a code comment about CSS class ordering in `Button.tsx`.

**Two real bugs the responsive pass caught, both from one cause.** This theme sets
`--breakpoint-sm` to **375px** (`theme.css`), so `sm:` utilities fire *on phones*, not
above them. The gallery's `sm:grid-cols-2` therefore rendered two columns on a 375px
handset — cards barely wider than their own titles — and the accordion's `sm:block`
thumbnail showed there too, squeezing "Special Purpose Machines (SPM)" into four
wrapped lines. Both moved to `md:` (768px). The same mistake was already latent in the
Automation item list (`sm:grid-cols-2`), which is why "Jigs & Fixtures (Machining &
Assembly)" wrapped mid-phrase on a phone; that moved to `md:` too. Worth remembering
before writing another `sm:` in this project.

Also found: the lightbox's arrow-key handler was attached to the dialog's *content*,
below the close button that `useFocusTrap` moves focus to — so keydown never bubbled
through it and the arrows silently did nothing. It is a document-level listener now,
the same shape as Modal's own Escape handler.

**Verification.** Playwright against a static server that serves the prerendered
`<route>/index.html` the way Vercel does — `vite preview` is not usable for this, as it
answers every path with the homepage shell (`/calculator` returns the homepage title
too; pre-existing, not caused by this work). 12 routes x 9 viewports (375, 393, 852x393
landscape, 768, 1024x768, 1280, 1512, 1728, 1920): zero horizontal overflow, zero broken
images, zero console or page errors. 16 interaction assertions pass, covering the cold
deep-link with a query string, chip filtering and URL sync, keyboard open/arrow/wrap/
Escape in the lightbox, the accordion's deep link, and `/projects` 404ing. Screenshots
of every changed surface were reviewed by eye at 375/768/1024/1512/1728.
