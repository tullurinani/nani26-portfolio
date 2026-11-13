# NANI26 Portfolio

A responsive portfolio website with a simple learning-mode admin dashboard. The visual update uses a warm stone, terracotta and botanical-green palette, subtle CSS 3D depth, pointer-based tilt, scroll reveals, and a custom 404 page. It does not connect to Supabase or any external authentication/database service.

## Visual update

- `assets/css/theme-refinement.css` contains the updated light editorial colour system and motion details.
- The hero portrait and project illustrations use subtle 3D perspective and hover movement.
- Scroll reveals are enabled where supported and respect reduced-motion preferences.
- `404.html` provides a branded page for missing URLs on GitHub Pages.
- The existing page content, portfolio sections, contact-link configuration, admin dashboard and local article logic are retained.

## Run locally

1. Extract the ZIP file.
2. Open the `nani26-portfolio` folder in VS Code.
3. Install/use the VS Code **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Open `admin.html` from the website or visit `http://127.0.0.1:5500/admin.html` (the port may differ).

Use a local web server because the JavaScript files use ES modules. Do not open the HTML files directly with `file://`.

## Learning-mode admin login

The demo credentials are hardcoded in `assets/js/config.js`. The admin login compares the entered email and password with those values:

- Correct credentials: the admin dashboard opens.
- Incorrect credentials: access is rejected and an error is displayed.
- Sign out: clears the current tab's demo session.

This is intentionally a beginner exercise, not secure authentication. Anyone can inspect browser JavaScript and find hardcoded credentials. Do not deploy this version with real or reused passwords, and do not use it to protect sensitive information.

## Article storage

Articles are stored in the browser's `localStorage` under the key `nani26_articles`.

- Create, edit and delete articles from `admin.html`.
- Tick **Publish immediately** to show an article in the public portfolio.
- Unpublished articles remain drafts in the admin dashboard.
- Data is local to that browser and device. It is not shared with visitors or synchronized across devices.
- Clearing browser site data may delete the saved articles.

## Where to learn the code

- `admin.html` — admin login and dashboard interface.
- `assets/js/config.js` — demo email/password and public contact links.
- `assets/js/admin.js` — credential comparison, session handling, and article create/read/update/delete logic.
- `assets/js/app.js` — public portfolio behavior, published article display, 3D pointer interaction and scroll reveals.
- `assets/css/theme-refinement.css` — updated palette and visual effects.
- `404.html` — branded missing-page experience.

## Later upgrade

When you are comfortable with JavaScript authentication concepts, replace the demo login and local storage with a proper backend authentication provider and database. Never rely on hardcoded browser credentials for a publicly deployed admin system.
