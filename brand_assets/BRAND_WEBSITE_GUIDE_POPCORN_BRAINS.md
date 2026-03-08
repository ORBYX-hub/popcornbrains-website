# Popcorn Brains — Website Brand Build Brief

## Purpose
This document is the single source of truth for building the Popcorn Brains website.

Popcorn Brains is an **artist management** brand.

The brand should feel:
- creative
- culturally aware
- modern
- warm
- sharp
- premium
- non-corporate

It should **not** feel:
- childish
- gimmicky
- chaotic in a messy way
- over-designed
- loud for no reason
- generic “agency template”

The core tension of the brand is:
**playful concept + serious execution**

The name is expressive.
The website should therefore be **clean, intentional, and tastefully restrained**.

---

## Brand Positioning
Popcorn Brains is built around the idea of creative minds where ideas constantly pop.

This is not a joke brand.
This is not a novelty popcorn brand.
This is not a quirky startup mascot brand.

It is a **modern management identity for artists and creative minds who think differently**.

Interpret the name as:
- creative energy
- fast thinking
- cultural sensitivity
- instinct
- momentum
- strong taste
- turning ideas into careers

---

## Visual Direction
Use a **minimal, editorial, premium** visual language.

### Design principles
- lots of breathing room
- clear typography hierarchy
- restrained use of color
- strong contrast
- subtle warmth
- smooth radius
- modern grid layout
- elegant motion, not flashy motion

### Overall feel
Think:
- music industry
- modern culture brand
- boutique artist management
- understated confidence
- art direction over decoration

Avoid:
- cartoon popcorn illustrations
- obvious brain clipart
- cheesy entertainment visuals
- overuse of gradients
- startup SaaS look
- tech bro aesthetics

---

## Brand Assets Available
The following brand assets exist and should be used consistently across the website build.

### Main logo assets
- full logo, transparent background
- white/inverted full logo for dark backgrounds
- high-resolution full logo for print and large placements
- text-only transparent logo
- icon-only transparent logo (brain + popcorn, no text)

### Favicon assets
Favicons already exist and should be included in the website build:
- `favicon.ico`
- PNG favicon set: 16, 32, 48, 64, 128, 256, 512 px

### Suggested usage
- **full logo**: header, footer, hero, brand sections
- **icon-only logo**: favicon, browser tab, app icon, compact UI placements
- **text-only logo**: wide header lockups, footer branding, minimal hero treatments
- **white/inverted logo**: dark sections and dark mode surfaces

### Asset implementation note
Claude Code should assume these files live in `brand_assets/` and wire them into the site properly.

Recommended file naming:
- `brand_assets/logo-full-transparent.png`
- `brand_assets/logo-full-white.png`
- `brand_assets/logo-full-4000px.png`
- `brand_assets/logo-text-transparent.png`
- `brand_assets/logo-icon-transparent.png`
- `brand_assets/favicon.ico`
- `brand_assets/favicon-16.png`
- `brand_assets/favicon-32.png`
- `brand_assets/favicon-48.png`
- `brand_assets/favicon-64.png`
- `brand_assets/favicon-128.png`
- `brand_assets/favicon-256.png`
- `brand_assets/favicon-512.png`

---

## Logo Usage
Use the existing Popcorn Brains logo from the brand assets.

### Rules
- preserve aspect ratio
- do not stretch
- do not add effects
- do not add drop shadows
- do not outline it
- do not place on busy backgrounds without enough contrast
- prefer generous clear space around the logo

### Preferred placements
- top-left in header
- centered in hero when appropriate
- clean footer lockup
- dark-mode white logo on dark surfaces
- transparent version on light surfaces
- icon-only version for favicons and compact UI moments

---

## Typography Direction
Use a clean modern sans-serif.

### Current logo typography reference
The logo typography appears closest to:
- **Montserrat ExtraBold**
- or **Montserrat Black**

If the exact original font is unknown, use **Montserrat ExtraBold** as the closest practical match for brand consistency.

### Website typography feel
Preferred feel:
- Swiss / editorial
- contemporary grotesk
- premium but neutral

Acceptable examples:
- Inter
- Montserrat
- Söhne-inspired
- Helvetica Neue-style
- Geist
- General Sans
- Suisse-style alternatives

### Recommended web pairing
A good practical pairing is:
- **Montserrat ExtraBold / Bold** for large headings or brand-led titles
- **Inter** for body copy, UI text, labels, and supporting copy

### Typography rules
- large confident headlines
- restrained body text
- clear spacing between sections
- avoid overly playful display fonts
- avoid handwritten or novelty fonts

### Tone of type
The logo and brand name carry the personality.
Typography should carry the structure.

---

## Color System
Use the following exact tokens.

```css
:root {
  --card: #fcfcfc;
  --ring: #644a40;
  --input: #d8d8d8;
  --muted: #efefef;
  --accent: #e8e8e8;
  --border: #d8d8d8;
  --radius: 0.5rem;
  --chart-1: #644a40;
  --chart-2: #ffdfb5;
  --chart-3: #e8e8e8;
  --chart-4: #ffe6c4;
  --chart-5: #66493e;
  --popover: #fcfcfc;
  --primary: #644a40;
  --sidebar: #fbfbfb;
  --secondary: #ffdfb5;
  --background: #f9f9f9;
  --foreground: #202020;
  --destructive: #e54d2e;
  --sidebar-ring: #b5b5b5;
  --sidebar-accent: #f7f7f7;
  --sidebar-border: #ebebeb;
  --card-foreground: #202020;
  --sidebar-primary: #343434;
  --muted-foreground: #646464;
  --accent-foreground: #202020;
  --popover-foreground: #202020;
  --primary-foreground: #ffffff;
  --sidebar-foreground: #252525;
  --secondary-foreground: #582d1d;
  --destructive-foreground: #ffffff;
  --sidebar-accent-foreground: #343434;
  --sidebar-primary-foreground: #fbfbfb;
}

.dark {
  --card: #191919;
  --ring: #ffe0c2;
  --input: #484848;
  --muted: #222222;
  --accent: #2a2a2a;
  --border: #201e18;
  --radius: 0.5rem;
  --chart-1: #ffe0c2;
  --chart-2: #393028;
  --chart-3: #2a2a2a;
  --chart-4: #42382e;
  --chart-5: #ffe0c1;
  --popover: #191919;
  --primary: #ffe0c2;
  --sidebar: #18181b;
  --secondary: #393028;
  --background: #111111;
  --foreground: #eeeeee;
  --destructive: #e54d2e;
  --sidebar-ring: #d4d4d8;
  --sidebar-accent: #27272a;
  --sidebar-border: #27272a;
  --card-foreground: #eeeeee;
  --sidebar-primary: #1d4ed8;
  --muted-foreground: #b4b4b4;
  --accent-foreground: #eeeeee;
  --popover-foreground: #eeeeee;
  --primary-foreground: #081a1b;
  --sidebar-foreground: #f4f4f5;
  --secondary-foreground: #ffe0c2;
  --destructive-foreground: #ffffff;
  --sidebar-accent-foreground: #f4f4f5;
  --sidebar-primary-foreground: #ffffff;
}

@theme inline {
  --color-card: var(--card);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --color-radius: var(--radius);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-popover: var(--popover);
  --color-primary: var(--primary);
  --color-sidebar: var(--sidebar);
  --color-secondary: var(--secondary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-destructive: var(--destructive);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-border: var(--sidebar-border);
  --color-card-foreground: var(--card-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary-foreground: var(--primary-foreground);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
}
```

### Color intent
- `--primary`: core brand signal, warm brown, use for primary CTA, links, active states, key accents
- `--secondary`: soft popcorn warmth, use for tags, pills, subtle highlights, soft panels
- `--background` and `--card`: clean editorial base
- `--foreground`: main readable text
- `--muted-foreground`: secondary copy
- dark mode should feel premium, not gamer-like

### Color behavior
- use warm neutrals heavily
- use accent colors sparingly
- preserve a calm premium surface system
- avoid making the interface too beige or too flat
- always maintain strong readability

---

## Photography / Imagery Direction
Use imagery only if it feels:
- real
- elevated
- culturally relevant
- music-focused
- not stocky
- not corporate

Preferred imagery:
- artists
- studio environments
- live performance energy
- backstage details
- texture, movement, atmosphere
- black-and-white or muted editorial treatments

Avoid:
- fake smiling office people
- cliché startup teamwork photos
- loud collage overload
- cheesy popcorn imagery used literally

If abstract visual support is needed, use:
- soft grain
- subtle texture
- restrained motion
- editorial crops
- large negative space

---

## UI Direction
The site should feel premium and easy to scan.

### Components should be
- rounded, but not bubbly
- clean
- slightly soft
- well spaced
- modern
- elegant in dark mode

### Buttons
- primary button uses `--primary`
- text should be crisp and clear
- hover states should feel subtle, not flashy
- avoid oversized cartoon buttons

### Cards
- use soft surfaces
- thin borders
- gentle contrast
- enough padding
- slightly editorial layout

### Navigation
- simple
- minimal
- strong alignment
- no clutter
- logo should have room

### Motion
- subtle fade
- slight rise
- smooth transitions
- no exaggerated springiness unless very restrained

---

## Tone of Voice for Website Copy
Voice should be:
- concise
- warm
- clear
- confident
- culturally aware
- direct

Avoid:
- hype language
- clichés
- empty buzzwords
- corporate jargon
- sounding like a marketing agency
- sounding childish because of the name

The copy should make the brand feel credible fast.

---

## Website Strategy
The website should communicate this in order:

1. **This is a serious artist management brand**
2. **The identity is modern and memorable**
3. **The taste level is high**
4. **The brand understands artists and creative minds**
5. **The execution is structured and professional**

---

## Recommended Sitemap
At minimum, build:
- Home
- Artists
- About
- Contact

Optional:
- News / Updates
- Selected Work
- Services
- Management Philosophy

---

## Home Page Structure
Recommended homepage flow:

### 1. Hero
- strong logo presence
- concise statement
- premium spacing
- optional supporting line about artist management
- primary CTA should be simple

Possible direction:
- “Artist Management for Creative Minds”
- “Ideas. Artists. Momentum.”
- “Modern management for artists who think differently.”

### 2. Brand introduction
Short section explaining Popcorn Brains in one clean paragraph.

### 3. Artists / roster preview
Visually clean grid or list.

### 4. Philosophy / approach
What makes the management style different.

### 5. Contact / CTA
Simple, direct, well-spaced.

---

## About Page Direction
The About page should explain the meaning of Popcorn Brains in a smart way.

Suggested framing:
- creative minds move fast
- ideas connect quickly
- instinct matters
- structure turns raw energy into long-term careers

This should sound thoughtful, not self-mocking.

---

## Artists Page Direction
If there is a roster page:
- keep it clean
- use large imagery or strong type
- avoid cluttered cards
- let each artist feel premium
- emphasize identity and clarity

---

## Contact Page Direction
Keep it minimal and credible.
Do not overcomplicate it.

Recommended:
- short intro
- direct email / contact form
- social links if relevant
- optional simple line about management inquiries

---

## Technical / Build Guidance
If building in React / Next.js / Tailwind or similar:
- structure around the provided tokens
- ensure excellent mobile responsiveness
- support light and dark mode cleanly
- prioritize typography and spacing over decoration
- keep components reusable and consistent
- use semantic HTML
- optimize logo rendering
- ensure all text contrast is accessible
- connect favicon files properly in metadata and head tags

### Favicon implementation
At minimum include:
- `favicon.ico`
- `favicon-32.png`
- `favicon-16.png`
- `apple-touch-icon` using a larger PNG such as 180px or 512px

If using Next.js app router, set proper icon metadata.
If using static HTML, include `<link rel="icon">` and Apple touch icon tags.

### Accessibility
- strong contrast
- visible focus states
- keyboard-friendly navigation
- alt text for artist imagery
- headings in correct order
- no overly low-contrast beige-on-cream combinations

---

## Non-Negotiables
- Do not make the brand look childish
- Do not lean into novelty popcorn jokes
- Do not make it feel chaotic
- Do not overdecorate the interface
- Do not use random bright colors outside the system
- Do not turn the brand into a generic corporate agency
- Do not make the logo compete with too many visual elements

---

## Summary for Claude Code
Build a **premium, modern, editorial artist management website** for Popcorn Brains.

The site should balance:
- warmth
- creativity
- cultural taste
- clarity
- restraint

The name is expressive.
The design should prove the business is serious.

Use:
- clean layouts
- elegant spacing
- warm neutral colors
- confident sans-serif typography
- subtle motion
- a high-taste music-industry feel

Target impression:
**creative intelligence, not chaos**

Also:
- use the existing logo assets from `brand_assets/`
- use the existing favicon pack and `.ico` file
- treat the icon-only mark as the default favicon/app icon
- keep implementation polished and production-ready
