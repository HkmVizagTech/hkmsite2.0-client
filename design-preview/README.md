# GVD-Style Design Preview

This folder contains a **standalone HTML preview** of the upcoming HKM Vaikuntham
site redesign, modeled after [Gupt Vrindavan Dham](https://guptvrindavandham.org/)
but using a **Vishnu Blue** palette instead of GVD's purple.

## How to view

Open `index.html` in any browser — no build step, no server required.

```bash
# From repo root, after pulling this branch:
open design-preview/index.html        # macOS
xdg-open design-preview/index.html    # Linux
start design-preview/index.html       # Windows
```

Or use any static server:
```bash
cd design-preview
python3 -m http.server 8765
# Visit http://localhost:8765
```

## What's inside

**10 page templates** that together cover all ~75 URLs across the main domain
and the donations subdomain:

| File | Template | Covers |
|---|---|---|
| `home.html` | ① Home | `/` |
| `about.html` | ② About / Mandir | About, Mandir, Explore, Architecture, History, Leadership (6 URLs) |
| `prabhupada.html` | ③ Prabhupada profile | Prabhupada About, Biography, Teachings, Contributions (4 URLs) |
| `category.html` | ④ Category index | Activities, Events list, Education hub (5 URLs) |
| `event-detail.html` | ⑤ Activity / Event detail | All 14 events + 4 food + 1 cow page (~20 URLs) |
| `festivals.html` | ⑥ Festivals | `/festivals` |
| `blog.html` | ⑦ Blog list + Post | `blogs/*` (~10 URLs) |
| `contact.html` | ⑧ Contact & Get Involved | contact, volunteer, schedule (4 URLs) |
| `donate-home.html` | ⑨ Donate Home (subdomain) | `donate.harekrishnavaikuntham.org/` (2 URLs) |
| `donate-seva.html` | ⑩ Donate Single Seva | All 14 seva URLs |

**Shared files:**
- `index.html` — landing page that lists all templates
- `styles.css` — design system (colors, typography, components)
- `shared.js` — top bar, nav, footer auto-injection + "◀ All pages" FAB on every page

## Design tokens

- **Primary:** Vishnu Blue ramp from `#EBF1FF` to `#142575`
- **Accent (CTA):** Gold `#F6C341` (donate pills)
- **Body text:** Near-black `#1D1B20`
- **Background:** Pure white with `#F1F4FF` lavender-blue tinted sections
- **Fonts:** Manrope (headings) + DM Sans (body) via Google Fonts
- **Radii:** 12px, 16px, 24px, 999px (pill)
- **Floating sticky pill nav** with rounded edges
- **Lavender wave SVG transitions** between sections
- **Rounded image cards** with gradient overlays
- **Circle hero photo** with blob shadows (Welcome section)

## What this preview is NOT

- Not connected to the backend — uses sample/mock content
- Not yet built as Next.js components — that's the next step
- Placeholder gradients where real photos will go

## Next step

Once this design is approved, the preview will be ported to actual Next.js +
TypeScript + Tailwind components in `app/` and `components/` to replace the
current temple-aesthetic implementation.
