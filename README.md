# NANI26 Portfolio — editorial 3D refresh

This is the redesigned static portfolio for `https://nani26.shop`.

## What changed

- Warm paper, charcoal, terracotta and olive palette instead of the previous dark neon palette.
- Editorial typography and more personal, grounded copy.
- CSS 3D identity-card sculpture with pointer tilt and subtle floating motion.
- Scroll reveal, ticker movement and project-card depth interactions.
- Responsive navigation and layouts for desktop, tablet and mobile.
- The AI-generated portrait has been removed from the visible design.
- Existing experience, skills, project notes, article dialog and Supabase article-loading logic are retained.
- Google Analytics 4 tag is included once in `index.html` using Measurement ID `G-GFWPRP09K7`.

## Publish to the existing GitHub repository

1. Extract this ZIP on your computer.
2. Open the extracted folder. The files `index.html`, `admin.html`, `CNAME`, `assets/`, and `supabase/` should be directly inside it.
3. Open the GitHub repository `tullurinani/nani26-portfolio`.
4. Use **Add file → Upload files**.
5. Upload the contents of this folder (not the ZIP file and not the outer folder).
6. Commit the changes to the `main` branch.
7. Wait for GitHub Pages to deploy, then open `https://nani26.shop` and hard-refresh with `Ctrl + Shift + R`.

Keep the repository, GitHub Pages branch setting, custom domain, and GoDaddy DNS records. The included `CNAME` file contains `nani26.shop`.

## Analytics

The homepage includes the GA4 tag `G-GFWPRP09K7`. In Google Analytics, use the web data stream for `https://nani26.shop` (not the `www` alias), then check **Reports → Realtime** after visiting the site. Do not add a second GA4 snippet or a second GTM container snippet to the page.

## Article studio

`admin.html` and the Supabase article dashboard are retained. The article studio still requires your own Supabase project and the setup described in `supabase/schema.sql`. Do not put a Supabase service-role key in `assets/js/config.js`; only a publishable/anon browser key may be used with correct Row Level Security policies.

## Customization

Edit `assets/js/config.js` to add your own email and LinkedIn profile URLs. The GitHub profile is set to `https://github.com/tullurinani`.

## Local preview

From this folder run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

The 3D artwork and animations are built with CSS and browser JavaScript; no large 3D framework or build step is required. Reduced-motion preferences are respected.
