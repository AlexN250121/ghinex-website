# GHINEX — Website 2 (animated / informative)

An alternative design for **Ghinex Sdn Bhd** — a more animated, product-style take that's
built to be easy to read and highly informative. This is **separate from Website 1** (the
refined black-&-white editorial version); both are complete and deployable.

*Set Up. Scale Up. Stress Free.*

## What's different from Website 1
- **Light theme with an emerald accent** (vs. Website 1's black-&-white editorial look)
- **Friendlier, larger typography** — Plus Jakarta Sans headings + Inter body at 18px
- **More content** — a "How it works" 4-step flow, "Who we help", expanded service cards
  with feature lists, a by-the-numbers band, a testimonial, and a full FAQ/policy accordion
- **More motion** — animated gradient hero with floating badge cards, count-up stats, a
  scroll-driven step timeline, hover-lift cards, marquee, and reveal-on-scroll (all respecting
  reduced-motion, with a static fallback)

## Structure
```
Ghinex Website 2/
├── index.html        one-page site (all sections)
├── css/styles.css    design system + components + animation
├── js/main.js        nav, reveals, counters, timeline, accordion, contact form
├── assets/           hero.jpg · about.jpg · band.jpg · favicon.svg
└── README.md
```

## Run locally
```
cd "Ghinex Website 2"
python3 -m http.server 4188
# open http://localhost:4188
```

## Deploy
Static files only — deploy the folder to Vercel / Netlify / Cloudflare Pages and point
`ghinex.com` at it. No build step.

## Notes
- **Contact form** delivers to `cosec@ghinex.com` via FormSubmit — requires one-time
  activation (submit once on the live site, click the "Activate Form" email). Falls back to
  the visitor's email app if the relay is unreachable. Swap `FORM_ENDPOINT` in `js/main.js`
  for Formspree/Netlify if preferred.
- **Photos** are the same B&W stock images as Website 1 (rendered in colour here); swap the
  files in `assets/` for your own when ready.
- **Team** is text + monogram avatars (no stock faces on the real people).

Company: Ghinex Sdn Bhd (formerly Abeeha Ventures Sdn Bhd) · Reg. No. 202401037535 [1583382-U]
