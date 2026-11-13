# NANI26 — Saviynt & IAM Portfolio

A responsive dark-themed portfolio for Nani Tulluri, with a public article library and a separate Supabase-authenticated admin dashboard.

## What's included

- Responsive portfolio homepage: About, Experience, Skills, Projects and Contact.
- AI-generated monochrome corporate headshot at `assets/img/nani-profile.png`.
- Article list backed by Supabase (with starter notes displayed until Supabase is configured).
- Admin sign-in at `/admin.html`.
- Admin article CRUD: create, edit, publish, save drafts and delete.
- Supabase Row Level Security policies in `supabase/schema.sql`.
- SEO metadata, sitemap and robots.txt.

## Before publishing

1. Review `index.html` and update any profile details that need correction.
2. Add your email, LinkedIn and GitHub URLs in `assets/js/config.js`.
3. Complete the Supabase setup below before using the admin dashboard.
4. Change the admin email placeholder in BOTH `assets/js/config.js` and `supabase/schema.sql` to the exact email address you will use to sign in.

## 1. Create the article database and admin login

1. Open https://supabase.com/ and create a project.
2. In Supabase, open **SQL Editor → New query**.
3. Open `supabase/schema.sql` in this project. Replace every occurrence of `YOUR_ADMIN_EMAIL@example.com` with your admin email, then run the SQL.
4. Open **Authentication → Users → Add user** and create the admin user with that same email and a strong password. Keep the password private.
5. Open **Project Settings → API** (or API Keys) and copy the Project URL and the publishable/anon key intended for browser clients.
6. Paste these values into `assets/js/config.js`:

```js
export const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY";
export const ADMIN_EMAIL = "your-admin-email@example.com";
```

The browser key is expected to be public. The security boundary is the Row Level Security policy. **Never place the Supabase `service_role` or secret key in this website or a public GitHub repository.**

If you edit the admin email after running the SQL, update the policies too. The easiest approach is to edit and rerun the SQL in a fresh project before adding content. Do not disable RLS.

## 2. Test locally

This project is static. From this folder, run:

```bash
python -m http.server 5500
```

Open http://localhost:5500/ for the portfolio and http://localhost:5500/admin.html for the admin dashboard. ES modules and Supabase requests should be tested through a local web server, not by double-clicking the HTML file.

## 3. Publish using GitHub Pages (free static hosting)

1. Create or sign in to https://github.com/.
2. Create a **public** repository named `nani26-portfolio`.
3. Upload the contents of this folder (upload the files inside this folder, not the ZIP itself).
4. Open repository **Settings → Pages**.
5. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
6. Wait for GitHub Pages to finish the deployment. It will show a temporary `github.io` website address.
7. In **Settings → Pages → Custom domain**, enter `nani26.shop` and save. Keep this page available while setting DNS.

## 4. Connect GoDaddy DNS to GitHub Pages

In GoDaddy, open **My Products → Domains → nani26.shop → DNS → Manage DNS**.

Add or update these records (remove conflicting old A records for `@` if they point somewhere else):

| Type | Name / Host | Value | TTL |
|---|---|---|---|
| A | @ | 185.199.108.153 | 1 hour |
| A | @ | 185.199.109.153 | 1 hour |
| A | @ | 185.199.110.153 | 1 hour |
| A | @ | 185.199.111.153 | 1 hour |
| CNAME | www | YOUR_GITHUB_USERNAME.github.io | 1 hour |

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username. Do not include `https://` in the CNAME value. If a `www` CNAME already exists, edit it rather than creating a duplicate. Do not delete MX records if you use email on this domain.

After DNS updates, return to GitHub **Settings → Pages** and enable **Enforce HTTPS** when the option becomes available. DNS can take time to propagate and the HTTPS certificate may take additional time to issue. Do not keep changing records while they are propagating.

## 5. Admin publishing workflow

1. Visit `https://nani26.shop/admin.html`.
2. Sign in using the admin email and password you created in Supabase.
3. Write a title, URL slug, category, short description and article content.
4. Tick **Publish immediately** to make it public. Leave it unticked to save a draft.
5. Use the article list to edit or delete articles.
6. Published posts appear in the homepage Articles section.

The admin HTML page is not itself secret; its data-changing actions are protected by Supabase Authentication and RLS. Public visitors can read published posts only. Only the email configured in the SQL policies can manage articles.

## 6. SEO and Google indexing

- Keep the title and description in `index.html` accurate.
- After the custom domain works, add `https://nani26.shop/` in Google Search Console.
- Verify ownership using the DNS TXT record Google provides. Add that TXT record in GoDaddy DNS without deleting other records.
- Submit `https://nani26.shop/sitemap.xml` in Search Console.
- Write original, useful articles and link to them from relevant pages. Indexing and search ranking are not guaranteed.

## Important profile accuracy notes

The portfolio describes the current role as **Trainee Software Engineer** and presents Saviynt / IAM as the focus area. It describes Saviynt and SailPoint items as hands-on learning, guided practice or lab work. The JDBC onboarding exercise is labelled as a learning exercise / in progress. Update these statements as your experience changes. Do not publish employer-confidential information, customer data, credentials or private connector configurations.

## Customization checklist

- [ ] Replace the email, LinkedIn and GitHub placeholders in `assets/js/config.js`.
- [ ] Confirm your role description and company name are accurate.
- [ ] Add your actual resume PDF only if you want a public download link.
- [ ] Configure Supabase and create the admin account.
- [ ] Test login, publish, edit and delete using a sample article.
- [ ] Connect the GoDaddy domain and verify HTTPS.
- [ ] Add Google Search Console verification and submit the sitemap.
