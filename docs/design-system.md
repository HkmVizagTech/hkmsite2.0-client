# Vaikuntham Blue — GVD-standard design system

The public site follows the layout language of
[guptvrindavandham.org](https://guptvrindavandham.org) (sister HKM temple,
Jaipur), re-coloured to the HKMV logo's royal navy. This page is the
reference for anyone building or restyling a page.

## Principles

1. **White canvas, tinted bands.** Pages are white; alternate sections sit on
   `vk-band` (soft blue gradient). Never a full-page coloured background.
2. **Rounded everything.** Cards `rounded-2xl`, hero/feature cards `rounded-3xl`,
   chips/pills `rounded-full`, buttons `rounded-xl`.
3. **Eyebrow pill → big tight title → muted lead.** Every section starts with
   `<SectionHeading eyebrow title subtitle />`.
4. **Imagery in tiles.** Photos live in rounded tiles with a navy bottom
   gradient (`vk-tile`) and the caption over the image.
5. **Gold = money.** `vk-btn-gold` only for Donate / Sponsor / Pay actions.
   Everything else uses `vk-btn-primary` / `vk-btn-outline`.
6. **Mobile first.** 16px gutters (`vk-container`), no horizontal page scroll,
   horizontal scrollers (`vk-scroller`) instead of squeezed grids, tap
   targets ≥ 40px, bottom nav clearance is handled by the layout.

## Tokens

| Token | Value | Use |
|---|---|---|
| `vk-700` / `primary` | `#1E3A8A` | brand, pills, primary buttons, headings accents |
| `vk-500` / `secondary` | `#2F5BD3` | links, active states, bars |
| `vk-100` | `#EEF2FF` | chips, icon backgrounds, tints |
| `vk-50` | `#F5F7FF` | band backgrounds, hover |
| `vk-800 → vk-900` | `#172B6E → #0A1233` | footer / dark bands (`bg-gradient-navy`) |
| `gold` | `#F2B41F` | donate CTAs (`vk-btn-gold`, `bg-gradient-gold`) |
| `ink` / `foreground` | `#1D1B20` | body text |
| `muted-foreground` | `#5C5C66`-ish | secondary text |

Fonts: headings **Plus Jakarta Sans** (`font-heading`, applied to h1–h6
automatically), body **Poppins**, scripture/quotes **Playfair italic**
(`font-serif-display`).

## Components (app/globals.css → `@layer components`)

| Class | What |
|---|---|
| `vk-container` | `max-w-7xl` page container with 16/24px gutters |
| `vk-section` | vertical rhythm `py-10 md:py-16` |
| `vk-band` | tinted section background |
| `vk-pill` / `vk-pill-soft` / `vk-pill-light` | eyebrow pills (solid / tinted / on dark) |
| `vk-h1` `vk-h2` `vk-h3` `vk-lead` | display type scale |
| `vk-btn-primary` `vk-btn-gold` `vk-btn-outline` `vk-btn-ghost-light` | buttons |
| `vk-card` + `vk-card-hover` | white rounded card with soft shadow, lift on hover |
| `vk-tile` + `vk-tile-caption` | image tile with navy gradient + caption |
| `vk-icon-chip` | 44px tinted rounded icon holder |
| `vk-bar-title` | heading with a blue accent bar on the left |
| `vk-input` | form field (44px, rounded-xl, blue focus ring) |
| `vk-scroller` | snap horizontal scroller |
| `vk-prose` | article body typography (blogs, policies) |

## React primitives

- `components/site/SectionHeading.tsx` — eyebrow + title + subtitle (+ optional "View All" action; `light` for dark bands; `align="center"`).
- `components/site/Reveal.tsx` — fade-up on scroll (content always rendered; respects reduced motion).
- `components/PageHero.tsx` — inner-page hero: inset rounded photo card when `backgroundImage` is set, tinted band otherwise; breadcrumbs built in.
- `components/home/*` — homepage sections; reuse patterns from here.

## Page skeleton

```tsx
<PageLayout>                       {/* Navbar + Footer + WhatsApp */}
  <div className="pt-[var(--header-h)]">
    <PageHero title="…" subtitle="…" breadcrumb="…" backgroundImage="…" />
    <section className="vk-section">
      <div className="vk-container">
        <SectionHeading eyebrow="…" title="…" subtitle="…" />
        …cards / tiles…
      </div>
    </section>
    <section className="vk-section vk-band">…</section>
  </div>
</PageLayout>
```

## Don'ts

- No gold eyebrow text + ornament dividers (old style) — use `vk-pill`.
- No full-bleed dark photo heroes with centred text — use `PageHero`.
- No `container mx-auto px-4` for new work — use `vk-container`.
- Don't hard-code hex colours in components — use `vk-*` / semantic tokens.
