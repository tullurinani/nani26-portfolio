import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from "./config.js";
const $ = (s) => document.querySelector(s);
const configured = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("YOUR_PROJECT_ID") && SUPABASE_ANON_KEY.length > 20 && !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE") && !ADMIN_EMAIL.includes("YOUR_ADMIN_EMAIL");
const warning = $("#setupWarning");
const loginPanel = $("#loginPanel");
const dashboardPanel = $("#dashboardPanel");
let supabase = null;
let currentUser = null;

function message(target, text, type = "") { const el = $(target); el.textContent = text; el.className = `form-message ${type}`; }
function escapeHtml(value = "") { return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function slugify(value) { return value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function setAuthenticated(user) {
  currentUser = user;
  const isAdmin = user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  if (isAdmin) { loginPanel.classList.add("hidden"); dashboardPanel.classList.remove("hidden"); $("#adminIdentity").textContent = user.email; loadAdminArticles(); }
  else { dashboardPanel.classList.add("hidden"); loginPanel.classList.remove("hidden"); if (user) message("#loginMessage", "This account is not the configured portfolio admin.", "error"); }
}

if (!configured) {
  warning.classList.remove("hidden");
  $("#loginForm").addEventListener("submit", e => { e.preventDefault(); message("#loginMessage", "Complete the Supabase setup first. See README.md in the downloaded project.", "error"); });
} else {
  warning.classList.add("hidden");
  try {
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) setAuthenticated(session.user);
    supabase.auth.onAuthStateChange((_event, sessionNow) => setAuthenticated(sessionNow?.user || null));
  } catch (error) {
    message("#loginMessage", `Could not load the admin service: ${error.message}`, "error");
  }
}

$("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); if (!supabase) return;
  message("#loginMessage", "Signing in…");
  const email = $("#loginEmail").value.trim(); const password = $("#loginPassword").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) message("#loginMessage", error.message, "error");
  else if (data.user?.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    await supabase.auth.signOut(); message("#loginMessage", "This account is not the configured portfolio admin.", "error");
  } else { message("#loginMessage", "Signed in successfully.", "success"); setAuthenticated(data.user); }
});

$("#logoutButton").addEventListener("click", async () => { if (supabase) await supabase.auth.signOut(); setAuthenticated(null); });
$("#articleTitle").addEventListener("input", () => { if (!$("#articleId").value) $("#articleSlug").value = slugify($("#articleTitle").value); });
$("#resetFormButton").addEventListener("click", resetForm);
function resetForm() { $("#articleForm").reset(); $("#articleId").value = ""; $("#articleCategory").value = "IAM"; $("#editorTitle").textContent = "Write a new article"; $("#saveArticleButton").innerHTML = 'Save article <span>↗</span>'; message("#articleMessage", ""); }

async function loadAdminArticles() {
  const list = $("#adminArticles"); list.innerHTML = '<p class="muted-text">Loading articles…</p>';
  const { data, error } = await supabase.from("articles").select("id,title,slug,category,published,created_at").order("created_at", { ascending: false });
  if (error) { list.innerHTML = `<p class="form-message error">${escapeHtml(error.message)}</p>`; return; }
  if (!data?.length) { list.innerHTML = '<p class="muted-text">No articles yet. Write your first one.</p>'; return; }
  list.innerHTML = "";
  data.forEach(article => {
    const row = document.createElement("div"); row.className = "admin-article-row";
    row.innerHTML = `<div class="admin-article-info"><b>${escapeHtml(article.title)}</b><span>${escapeHtml(article.category)} · ${article.published ? '<i class="published-text">Published</i>' : '<i class="draft-text">Draft</i>'}</span></div><div class="admin-row-actions"><button type="button" data-edit="${article.id}">Edit</button><button type="button" class="delete-link" data-delete="${article.id}">Delete</button></div>`;
    row.querySelector("[data-edit]").addEventListener("click", () => editArticle(article.id));
    row.querySelector("[data-delete]").addEventListener("click", () => deleteArticle(article.id, article.title));
    list.appendChild(row);
  });
}
async function editArticle(id) {
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
  if (error) { message("#articleMessage", error.message, "error"); return; }
  $("#articleId").value = data.id; $("#articleTitle").value = data.title; $("#articleSlug").value = data.slug; $("#articleCategory").value = data.category; $("#articleExcerpt").value = data.excerpt; $("#articleContent").value = data.content; $("#articlePublished").checked = data.published; $("#editorTitle").textContent = "Edit article"; $("#saveArticleButton").textContent = "Update article"; window.scrollTo({ top: 0, behavior: "smooth" });
}
async function deleteArticle(id, title) {
  if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) message("#articleMessage", error.message, "error"); else { message("#articleMessage", "Article deleted.", "success"); loadAdminArticles(); }
}
$("#articleForm").addEventListener("submit", async (event) => {
  event.preventDefault(); if (!supabase || !currentUser) return;
  const id = $("#articleId").value;
  const payload = { title: $("#articleTitle").value.trim(), slug: slugify($("#articleSlug").value), category: $("#articleCategory").value.trim() || "IAM", excerpt: $("#articleExcerpt").value.trim(), content: $("#articleContent").value.trim(), published: $("#articlePublished").checked, updated_at: new Date().toISOString() };
  if (!payload.slug) { message("#articleMessage", "Please add a valid title or URL slug.", "error"); return; }
  message("#articleMessage", "Saving article…");
  const result = id ? await supabase.from("articles").update(payload).eq("id", id) : await supabase.from("articles").insert(payload);
  if (result.error) message("#articleMessage", result.error.message, "error");
  else { message("#articleMessage", payload.published ? "Article saved and published." : "Draft saved.", "success"); resetForm(); loadAdminArticles(); }
});
