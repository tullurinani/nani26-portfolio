import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./config.js";
const $ = (selector) => document.querySelector(selector);
const STORAGE_KEY = "nani26_articles";
const SESSION_KEY = "nani26_admin_authenticated";
const loginPanel = $("#loginPanel");
const dashboardPanel = $("#dashboardPanel");
let currentUser = null;

function message(target, text, type = "") {
  const element = $(target);
  element.textContent = text;
  element.className = `form-message ${type}`;
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}
function slugify(value) {
  return value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function getArticles() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}
function showDashboard() {
  currentUser = ADMIN_EMAIL;
  loginPanel.classList.add("hidden");
  dashboardPanel.classList.remove("hidden");
  $("#adminIdentity").textContent = currentUser;
  loadAdminArticles();
}
function showLogin() {
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  dashboardPanel.classList.add("hidden");
  loginPanel.classList.remove("hidden");
}

// Restore this browser tab's learning session, if the user previously signed in.
if (sessionStorage.getItem(SESSION_KEY) === "true") showDashboard();

$("#loginForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = $("#loginEmail").value.trim().toLowerCase();
  const password = $("#loginPassword").value;
  if (email === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, "true");
    message("#loginMessage", "Login successful. Opening your admin dashboard…", "success");
    showDashboard();
    $("#loginForm").reset();
  } else {
    message("#loginMessage", "Incorrect email or password. Access denied.", "error");
    $("#loginPassword").value = "";
  }
});

$("#logoutButton").addEventListener("click", () => {
  showLogin();
  message("#loginMessage", "You have signed out.", "success");
});
$("#articleTitle").addEventListener("input", () => {
  if (!$("#articleId").value) $("#articleSlug").value = slugify($("#articleTitle").value);
});
$("#resetFormButton").addEventListener("click", resetForm);

function resetForm() {
  $("#articleForm").reset();
  $("#articleId").value = "";
  $("#articleCategory").value = "IAM";
  $("#editorTitle").textContent = "Write a new article";
  $("#saveArticleButton").innerHTML = 'Save article <span>↗</span>';
  message("#articleMessage", "");
}
function loadAdminArticles() {
  const articles = getArticles().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const list = $("#adminArticles");
  if (!articles.length) {
    list.innerHTML = '<p class="muted-text">No articles yet. Write your first one.</p>';
    return;
  }
  list.innerHTML = "";
  articles.forEach(article => {
    const row = document.createElement("div");
    row.className = "admin-article-row";
    row.innerHTML = `<div class="admin-article-info"><b>${escapeHtml(article.title)}</b><span>${escapeHtml(article.category)} · ${article.published ? '<i class="published-text">Published</i>' : '<i class="draft-text">Draft</i>'}</span></div><div class="admin-row-actions"><button type="button" data-edit="${escapeHtml(article.id)}">Edit</button><button type="button" class="delete-link" data-delete="${escapeHtml(article.id)}">Delete</button></div>`;
    row.querySelector("[data-edit]").addEventListener("click", () => editArticle(article.id));
    row.querySelector("[data-delete]").addEventListener("click", () => deleteArticle(article.id, article.title));
    list.appendChild(row);
  });
}
function editArticle(id) {
  const article = getArticles().find(item => item.id === id);
  if (!article) return;
  $("#articleId").value = article.id;
  $("#articleTitle").value = article.title;
  $("#articleSlug").value = article.slug;
  $("#articleCategory").value = article.category;
  $("#articleExcerpt").value = article.excerpt;
  $("#articleContent").value = article.content;
  $("#articlePublished").checked = article.published;
  $("#editorTitle").textContent = "Edit article";
  $("#saveArticleButton").textContent = "Update article";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function deleteArticle(id, title) {
  if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
  saveArticles(getArticles().filter(article => article.id !== id));
  message("#articleMessage", "Article deleted.", "success");
  loadAdminArticles();
}
$("#articleForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!currentUser || sessionStorage.getItem(SESSION_KEY) !== "true") return;
  const articles = getArticles();
  const id = $("#articleId").value || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const existing = articles.find(article => article.id === id);
  const payload = {
    id,
    title: $("#articleTitle").value.trim(),
    slug: slugify($("#articleSlug").value),
    category: $("#articleCategory").value.trim() || "IAM",
    excerpt: $("#articleExcerpt").value.trim(),
    content: $("#articleContent").value.trim(),
    published: $("#articlePublished").checked,
    created_at: existing?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  if (!payload.slug) { message("#articleMessage", "Please add a valid title or URL slug.", "error"); return; }
  const updated = existing ? articles.map(article => article.id === id ? payload : article) : [payload, ...articles];
  try {
    saveArticles(updated);
    message("#articleMessage", payload.published ? "Article saved and published on this browser." : "Draft saved on this browser.", "success");
    resetForm();
    loadAdminArticles();
  } catch {
    message("#articleMessage", "Could not save. Your browser storage may be full.", "error");
  }
});
