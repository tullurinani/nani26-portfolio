const PROFILE = {
  email: "tullurinani26@gmail.com",
  linkedin: "https://www.linkedin.com/in/nanitulluri/",
  github: "https://github.com/tullurinani",
  phone: "7675851745"
};

const $ = (selector, root = document) => root.querySelector(selector);
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

const year = $("#year");
if (year) year.textContent = String(new Date().getFullYear());

function setContactLink(linkSelector, textSelector, value, label, href) {
  const link = $(linkSelector);
  const text = $(textSelector);
  if (!link || !text) return;

  if (!value || !href) {
    link.classList.add("is-hidden");
    return;
  }

  link.href = href;
  text.textContent = label || value;
  link.classList.remove("is-hidden");
}

setContactLink("#emailLink", "#emailText", PROFILE.email, PROFILE.email, "mailto:" + PROFILE.email);
setContactLink("#phoneLink", "#phoneText", PROFILE.phone, "+91 76758 51745", "tel:+91" + PROFILE.phone);
setContactLink("#whatsappLink", "#whatsappText", PROFILE.phone, "Chat on WhatsApp", "https://wa.me/91" + PROFILE.phone);
setContactLink("#linkedinLink", "#linkedinText", PROFILE.linkedin, "View LinkedIn profile", PROFILE.linkedin);
setContactLink("#githubLink", "#githubText", PROFILE.github, "View GitHub profile", PROFILE.github);

const learningNotes = [
  {
    category: "IAM FUNDAMENTALS",
    title: "Understanding the Joiner, Mover and Leaver lifecycle",
    excerpt: "How employee lifecycle changes should drive account creation, access updates and deprovisioning.",
    paragraphs: [
      "Joiner, Mover and Leaver (JML) describes the main identity lifecycle events in an organization.",
      "Joiner: when a person joins, an identity is created and the required access is requested or provisioned through the organization's process.",
      "Mover: when a person's role, department, manager or location changes, access should be reviewed. Old permissions may need to be removed and new permissions may need approval.",
      "Leaver: when a person leaves, access should be revoked and accounts should be disabled or removed according to policy and application requirements.",
      "In an IGA platform, reliable source data, workflows, approvals, provisioning and reconciliation work together to support the lifecycle."
    ]
  },
  {
    category: "SAVIYNT / IGA",
    title: "Identity, accounts and entitlements",
    excerpt: "A simple way to understand the core objects that connect people to application access.",
    paragraphs: [
      "An identity represents a person in an organization. Identity attributes can include a person's name, email, department, manager and employment status.",
      "An account represents that person's login or account in a target application. One identity can be linked to accounts in several applications.",
      "An entitlement is an access value inside an application, such as a group, permission, role or license. An account may have one or more entitlements.",
      "IGA platforms use correlation and reconciliation to connect identities with accounts and understand the access they hold. Requests, approvals, provisioning and certifications help govern access over time."
    ]
  },
  {
    category: "INTEGRATIONS",
    title: "What happens during JDBC application onboarding?",
    excerpt: "The main steps involved in connecting a relational database to an identity governance platform.",
    paragraphs: [
      "A JDBC integration connects an identity governance platform to a relational database using a driver, connection URL and authorised database account.",
      "A typical onboarding exercise starts with connectivity testing and understanding the source schema. Next, identity or account attributes are mapped and account data is imported.",
      "Entitlement values and account-to-entitlement relationships may also need to be imported so the platform can understand the access held in the application.",
      "Provisioning may use SQL operations for account creation, updates, enablement, disablement or access assignment, depending on the connector and database design.",
      "Always validate the schema, status values, uniqueness constraints and service-account permissions. Test destructive operations in a non-production environment."
    ]
  },
  {
    category: "ACCESS GOVERNANCE",
    title: "Preventive and detective SoD controls",
    excerpt: "How segregation-of-duties checks can help reduce conflicting access.",
    paragraphs: [
      "Segregation of Duties (SoD) is the practice of separating responsibilities so that one person does not receive an incompatible combination of access.",
      "A preventive control checks for conflicts before access is granted. For example, a request may be blocked or sent for additional approval when it would create a defined conflict.",
      "A detective control identifies conflicts that already exist. Access reviews, reports and remediation workflows can help owners investigate and resolve them.",
      "A useful SoD setup needs clearly defined rules, business owners, risk levels, exception handling and a documented mitigation process. The exact configuration depends on the platform and organization."
    ]
  }
];

const notesGrid = $("#notesGrid");
const noteDialog = $("#noteDialog");
const dialogContent = $("#dialogContent");

function openNote(note) {
  if (!noteDialog || !dialogContent) return;

  dialogContent.replaceChildren();

  const category = document.createElement("span");
  category.className = "article-category";
  category.textContent = note.category;

  const title = document.createElement("h2");
  title.id = "noteDialogTitle";
  title.textContent = note.title;

  const body = document.createElement("div");
  body.className = "dialog-article-body";

  note.paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    body.appendChild(p);
  });

  dialogContent.append(category, title, body);
  if (!noteDialog.open) noteDialog.showModal();
}

function renderLearningNotes() {
  if (!notesGrid) return;

  notesGrid.replaceChildren();

  learningNotes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "article-card article-card-clickable note-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Read note: " + note.title);

    const category = document.createElement("span");
    category.className = "article-category";
    category.textContent = note.category;

    const title = document.createElement("h3");
    title.textContent = note.title;

    const excerpt = document.createElement("p");
    excerpt.textContent = note.excerpt;

    const footer = document.createElement("span");
    footer.className = "article-date";
    footer.textContent = "READ NOTE";
    const arrow = document.createElement("b");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    footer.appendChild(arrow);

    card.append(category, title, excerpt, footer);
    card.addEventListener("click", () => openNote(note));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openNote(note);
      }
    });
    notesGrid.appendChild(card);
  });
}

renderLearningNotes();

$("#dialogClose")?.addEventListener("click", () => noteDialog?.close());
noteDialog?.addEventListener("click", (event) => {
  if (event.target === noteDialog) noteDialog.close();
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (!prefersReducedMotion && canHover) {
  const heroVisual = $(".hero-visual");
  const profileFrame = $(".profile-frame");

  if (heroVisual && profileFrame) {
    heroVisual.addEventListener("pointermove", (event) => {
      const bounds = heroVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      profileFrame.style.setProperty("--tilt-x", (-y * 7).toFixed(2) + "deg");
      profileFrame.style.setProperty("--tilt-y", (x * 9).toFixed(2) + "deg");
    });

    heroVisual.addEventListener("pointerleave", () => {
      profileFrame.style.setProperty("--tilt-x", "0deg");
      profileFrame.style.setProperty("--tilt-y", "0deg");
    });
  }

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--card-tilt-x", (-y * 2.5).toFixed(2) + "deg");
      card.style.setProperty("--card-tilt-y", (x * 3).toFixed(2) + "deg");
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
    });
  });
}

if (!prefersReducedMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .about-photo-card, .about-content, .experience-card, .practice-card, .skill-group, .project-card, .note-card, .contact-card"
  );

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-item");
    element.style.setProperty("--reveal-delay", (index % 3) * 70 + "ms");
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

  revealTargets.forEach((element) => revealObserver.observe(element));
}
