import { PROFILE } from "./config.js";

const $ = (selector) => document.querySelector(selector);
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

$("#year").textContent = new Date().getFullYear();

function setContactLink(id, textId, value, label, prefix = "") {
  const link = $(id); const text = $(textId);
  if (!value) { link?.classList.add("is-hidden"); return; }
  link.href = prefix + value; text.textContent = label || value; link.classList.remove("is-hidden");
}
setContactLink("#emailLink", "#emailText", PROFILE.email, PROFILE.email, "mailto:");
setContactLink("#linkedinLink", "#linkedinText", PROFILE.linkedin, "View LinkedIn");
setContactLink("#githubLink", "#githubText", PROFILE.github, "View GitHub");

const dialog = $("#articleDialog");
const dialogContent = $("#dialogContent");
$("#dialogClose")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function showArticle(article) {
  dialogContent.innerHTML = `<span class="article-category">${escapeHtml(article.category || "NOTES")}</span><h2>${escapeHtml(article.title)}</h2><p class="dialog-meta">${article.created_at ? new Date(article.created_at).toLocaleDateString() : "NANI26 LEARNING NOTE"}</p><div class="dialog-article-body">${escapeHtml(article.content || article.excerpt || "").replace(/\n/g, "<br>")}</div>`;
  dialog.showModal();
}

const starterArticles = [
  {title:"Understanding the Joiner, Mover and Leaver lifecycle",category:"IAM FUNDAMENTALS",excerpt:"A practical overview of how identity changes drive account creation, access updates and deprovisioning.",content:"Joiner, Mover and Leaver (JML) is a common way to describe identity lifecycle events.\n\nJoiner: a new person joins the organization. An identity is created and appropriate access is requested or provisioned based on policy.\n\nMover: a person's job, department, manager or location changes. Access should be reviewed so that old permissions are removed when no longer required and new permissions are granted through the right approvals.\n\nLeaver: a person leaves the organization. Access is revoked and accounts are disabled or removed according to policy, retention requirements and application capabilities.\n\nIn an IGA platform, accurate HR data, workflows, approvals, provisioning and reconciliation work together to support these lifecycle events."},
  {title:"Identity, accounts and entitlements: how they connect",category:"SAVIYNT",excerpt:"Breaking down the core IGA objects and the relationships that make access governance possible.",content:"An identity represents a person in the organization. An account represents that person's account in a target application. One identity may have accounts in multiple applications.\n\nAn entitlement is a permission, group, role or access value within an application. An account can have one or many entitlements.\n\nIGA platforms use imports and reconciliation to understand identities, accounts and access. Access requests, approvals, provisioning and certifications help govern changes over time.\n\nThis is a learning note. Exact object names and configuration details depend on the platform and connector."},
  {title:"What happens during JDBC application onboarding?",category:"INTEGRATIONS",excerpt:"A learning note on connection setup, imports, entitlement reconciliation and provisioning operations.",content:"A JDBC integration connects an identity governance platform to a relational database through a JDBC driver and connection URL.\n\nA typical onboarding exercise includes validating connectivity, understanding the source schema, mapping identity or account attributes, importing accounts, importing entitlement values and reconciling account-to-entitlement assignments.\n\nProvisioning operations may use SQL statements for account creation, updates, enablement, disablement and access assignment, depending on the connector capabilities and database design.\n\nAlways validate the database schema, status conventions, uniqueness constraints and service-account permissions before running provisioning operations. Test destructive operations only in a non-production environment."}
];

function renderArticles(articles, isLive = false) {
  const grid = $("#articlesGrid");
  if (!grid) return;
  grid.innerHTML = "";
  if (!articles.length) {
    grid.innerHTML = '<p class="empty-articles">No published articles yet. Check back soon.</p>';
    return;
  }
  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "article-card article-card-clickable";
    const dateLabel = article.created_at ? new Date(article.created_at).toLocaleDateString() : "STARTER NOTE";
    card.innerHTML = `<span class="article-category">${escapeHtml(article.category || "NOTES")}</span><h3>${escapeHtml(article.title)}</h3><p>${escapeHtml(article.excerpt || "Open this note to read more.")}</p><span class="article-date">${escapeHtml(dateLabel)} <b>↗</b></span>`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Read article: ${article.title}`);
    card.addEventListener("click", () => showArticle(article));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showArticle(article); }});
    grid.appendChild(card);
  });
  $("#articlesHint").textContent = isLive ? "Showing your published learning notes saved in this browser." : "Starter learning notes are shown here. Publish your own notes from the admin dashboard.";
}

function loadLocalPublishedArticles() {
  try {
    const saved = JSON.parse(localStorage.getItem("nani26_articles") || "[]");
    const published = saved.filter(article => article.published).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    if (published.length) renderArticles(published, true);
    else renderArticles(starterArticles);
  } catch (error) {
    console.warn("Could not read local article storage; showing starter notes.", error);
    renderArticles(starterArticles);
  }
}
loadLocalPublishedArticles();
