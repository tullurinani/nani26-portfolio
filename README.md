# NANI26 Portfolio

Personal portfolio of Nani Tulluri — Trainee Software Engineer focused on Identity and Access Management, Saviynt, SailPoint, Java, SQL and application integrations.

**Live website:** https://nani26.shop/

## Website sections

- **About:** professional introduction and education.
- **Experience:** current Trainee Software Engineer role and IAM learning focus.
- **Skills:** IAM / IGA, Java, integration, database and development tools.
- **Projects:** academic projects and hands-on IAM labs.
- **Learning notes:** short, visitor-readable explainers on IAM and integration concepts.
- **Contact:** working email, phone, WhatsApp, LinkedIn and GitHub links.

## Run locally

1. Clone or download this repository.
2. Open the folder in VS Code.
3. Start the site with the VS Code **Live Server** extension, or another local HTTP server.
4. Open the local URL provided by the server.

Use a local web server because the site uses JavaScript modules. Do not open index.html directly with the file:// protocol.

## Project structure

- index.html — portfolio page, metadata and structured data.
- assets/css/style.css — main layout and base styles.
- assets/css/theme-refinement.css — warm editorial colour theme.
- assets/css/portfolio-upgrade.css — responsive, interaction and accessibility refinements.
- assets/js/app.js — mobile navigation, contact links, learning notes, dialogs and motion effects.
- assets/img/ — profile image and favicon.
- 404.html — custom not-found page.
- CNAME — custom domain configuration.

## Updating content

Edit the relevant section in index.html. To update the learning notes, edit the learningNotes array in assets/js/app.js. Contact details are configured near the top of that file and are also shown in the homepage markup as fallback links.

This is a static portfolio hosted with GitHub Pages. It does not include a server-side admin system or a shared content database.
