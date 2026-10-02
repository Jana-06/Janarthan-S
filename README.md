# Janarthan S — Personal Portfolio

A single-page personal portfolio website built with React + Vite, Tailwind CSS v4, and Framer Motion. Inspired by Apple.com's design language — minimal, premium, spacious, typography-driven.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Sticky translucent nav with blur
│   ├── Hero.jsx          # Full-bleed hero with ambient orbs
│   ├── About.jsx         # Pull-quote + stats
│   ├── Experience.jsx    # Vertical timeline cards
│   ├── Projects.jsx      # Bento-grid project cards
│   ├── Skills.jsx        # Color-coded pill groups
│   ├── Education.jsx     # Education card + awards grid
│   └── Contact.jsx       # Contact links + footer
├── App.jsx
├── main.jsx
└── index.css             # Tailwind v4 + global styles
public/
└── favicon.svg
index.html                # SEO meta tags + OG tags
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Visit `http://localhost:5173`

## Adding Your Resume

Place your resume PDF at `public/resume.pdf`. The "Download Resume" button in the navbar and hero will link to it automatically.

## Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview locally with:

```bash
npm run preview
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the project root
vercel
```

> Select "Vite" as the framework preset. Vercel auto-detects it.

## Deploy to Netlify

1. Push to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from Git**
3. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**

Or via Netlify CLI:

```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## Customization

| What | Where |
|------|-------|
| Personal info | Each component file under `src/components/` |
| Colors / accents | Per-component inline `accent` values |
| Resume PDF | `public/resume.pdf` |
| Favicon | `public/favicon.svg` |
| Meta tags | `index.html` |
| Global fonts | `src/index.css` |

## Performance Notes

- Fonts loaded with `display=swap` for zero layout shift
- Framer Motion animations only trigger on viewport entry (`once: true`)
- No external image dependencies — all visuals are CSS/SVG
- Tailwind CSS v4 with zero unused CSS (no purge needed)
