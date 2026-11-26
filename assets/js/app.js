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
    category: "SAVIYNT / RULE ENGINEERING",
    title: "How Saviynt rules support identity lifecycle automation",
    excerpt: "Where technical rules and user update rules fit into Joiner, Mover and Leaver processes.",
    paragraphs: [
      "Saviynt rules help automate actions and decisions across identity and access-management processes. The exact rule type, trigger and configuration depend on the use case and the tenant setup.",
      "Technical rules are commonly used to evaluate technical conditions and support account-related actions. Examples include create, update or disable account scenarios when an identity or account event meets the configured conditions.",
      "User update rules respond to changes in identity attributes. For example, a department, manager, location or employment-status change may require related identity updates or downstream access review.",
      "For a Joiner, the process may create an identity and initiate required account and access actions. For a Mover, changed attributes can trigger access evaluation. For a Leaver, the process should support timely access removal or account disablement according to policy.",
      "Before enabling a rule, confirm its trigger, conditions, affected objects, execution order and expected result. Test positive, negative and boundary cases in a non-production environment, and review logs to verify the outcome."
    ]
  },
  {
    category: "SAVIYNT / ANALYTICS",
    title: "Using Saviynt analytics for access visibility",
    excerpt: "How reports can help teams understand identities, accounts, entitlements and governance activity.",
    paragraphs: [
      "Analytics in an IGA platform helps administrators and governance teams turn identity and access data into information they can review and act on.",
      "Reports can be designed around questions such as which users have a particular entitlement, which accounts are inactive, what access is assigned to an application, or which certification items remain pending.",
      "A typical report setup involves defining the business question, selecting the relevant data source or query, choosing the fields and filters, validating the result set and making the report available to the intended audience.",
      "Good reports are accurate, scoped to the audience and useful for a defined operational or audit purpose. Avoid exposing unnecessary personal data, and validate totals and sample records before relying on a report.",
      "Scheduling, delivery and permissions depend on the platform configuration. Always check who can run or view a report and whether the underlying data is current."
    ]
  },
  {
    category: "SAVIYNT / ACCESS REQUESTS",
    title: "Access Request System: request-to-fulfilment flow",
    excerpt: "Follow a governed access request from catalogue selection through approval, provisioning and verification.",
    paragraphs: [
      "An access request is a governed way to ask for an application, role or entitlement. A request catalogue should present clear names, descriptions, eligibility and ownership.",
      "A typical flow validates the request, evaluates policy, routes approval to configured owners, and sends approved changes to the target application.",
      "Approval is not the same as successful fulfilment. Provisioning performs the target change, while reconciliation helps verify the resulting account or entitlement state.",
      "For troubleshooting, check request status, approval history, policy evaluation, provisioning task details, connector response and the next reconciliation result.",
      "Practice by drawing a request flow for a fictional finance role. Include requester, manager, application owner, SoD check, target operation and failure handling."
    ]
  },
  {
    category: "SAVIYNT / IDENTITY WAREHOUSE",
    title: "Identity Warehouse: how identity and account data fit together",
    excerpt: "Understand the relationship between trusted identity sources, imported accounts and access data.",
    paragraphs: [
      "An identity warehouse brings identity information and connected application access into a place where governance processes can evaluate it.",
      "A trusted source may provide employee attributes such as employee ID, department, manager and employment status. Connected applications provide account and entitlement information.",
      "Correlation links imported accounts to identities. Incorrect correlation can lead to incomplete access visibility, incorrect reviews or unsafe provisioning decisions.",
      "When investigating missing data, check source connectivity, import scope, attribute mapping, unique identifiers, job results and correlation rules.",
      "Use fictional records to practise mapping a trusted source identity to an Active Directory account and a JDBC application account."
    ]
  },
  {
    category: "SAVIYNT / APPLICATION ONBOARDING",
    title: "Application onboarding: JDBC and Web Services concepts",
    excerpt: "Compare database-based and API-based integration considerations when connecting target applications.",
    paragraphs: [
      "Application onboarding connects a target system to an IGA platform so identity, account and entitlement data can be governed.",
      "A JDBC integration commonly reads or updates relational database records through a driver, connection URL, schema mapping and controlled SQL operations.",
      "A Web Services integration communicates through API endpoints, HTTP methods, authentication, headers, request and response payloads, pagination and error handling.",
      "For either approach, confirm ownership, service-account permissions, unique account keys, attribute mappings, entitlement relationships and supported create, update or disable operations.",
      "Test connectivity, import, correlation and provisioning separately in a non-production environment. Record expected results and safe rollback steps."
    ]
  },
  {
    category: "SAVIYNT / ANALYTICS",
    title: "Analytics and reporting: ask a useful access question",
    excerpt: "Turn identity and entitlement data into reports that support operations and governance.",
    paragraphs: [
      "A useful analytics report begins with a question, such as which users hold a sensitive entitlement, which accounts are inactive or which reviews are overdue.",
      "Define the audience, data scope, fields, filters and expected output before building the report. Validate sample records and totals against a known source.",
      "Reports can support operations, audit preparation and access governance, but a report alone does not remediate access or prove that a target system has changed.",
      "Apply least-privilege access to reports and avoid exposing personal data that the audience does not need.",
      "Practice by defining a report for all fictional users who hold a privileged group, including the business question, columns, filters and report owner."
    ]
  },
  {
    category: "SAVIYNT / GOVERNANCE",
    title: "Roles and RBAC fundamentals",
    excerpt: "Learn how role-based access control can simplify access assignment and review.",
    paragraphs: [
      "Role-Based Access Control (RBAC) groups permissions around job responsibilities or business functions. Users receive access through assigned roles rather than through unrelated individual permissions.",
      "A business role may represent a job function, while an IT or application role may group technical entitlements. Exact role models vary by organisation and platform.",
      "Good role design needs an owner, clear description, membership criteria, entitlement mapping, approval process and periodic review.",
      "Poorly designed roles can accumulate excessive access or become difficult to maintain when job responsibilities change.",
      "Practice by defining a fictional Finance Analyst role with a business owner, eligibility criteria, mapped access and a review schedule."
    ]
  },
  {
    category: "SAVIYNT / TROUBLESHOOTING",
    title: "A repeatable checklist for import and provisioning failures",
    excerpt: "Use evidence from jobs, mappings and connector responses to narrow down integration issues.",
    paragraphs: [
      "Start by identifying the exact object and operation: identity import, account aggregation, entitlement import or provisioning.",
      "Check whether the job ran, whether the source was reachable, whether credentials are valid and whether filters returned the expected records.",
      "For imported records, validate schema fields, data types, unique identifiers and correlation. For provisioning, inspect the request, approval state, connector task and target response.",
      "Separate a platform-side failure from a target-system rejection. Record timestamps, safe sample identifiers and error messages without exposing secrets or unnecessary personal data.",
      "After a fix, rerun a controlled test and verify the target state through an independent read or reconciliation."
    ]
  },
  {
    category: "JAVA / JDBC",
    title: "JDBC troubleshooting from a Java developer's perspective",
    excerpt: "Review connection, query, resource and transaction issues in database integrations.",
    paragraphs: [
      "JDBC allows Java applications to communicate with relational databases through a driver and standard interfaces.",
      "Common connection problems include an incorrect URL, unavailable host or port, driver mismatch, TLS configuration and invalid credentials.",
      "Query problems may come from incorrect table or column names, parameter types, permissions, constraints or unexpected null values.",
      "Use PreparedStatement for parameter values and try-with-resources to close Connection, Statement and ResultSet objects safely.",
      "When investigating an error, capture the exception type and safe diagnostic context. Never print passwords, tokens or sensitive records into logs."
    ]
  },
  {
    category: "IAM / INTERVIEW PREPARATION",
    title: "How to explain an IAM integration scenario in an interview",
    excerpt: "Structure your answer around source, mapping, correlation, governance, provisioning and verification.",
    paragraphs: [
      "Start with the business purpose: which application is being connected and why the organisation needs identity and access visibility.",
      "Explain the source and connector type, then describe connectivity, authentication, schema or API mapping and the unique account identifier.",
      "Describe how identities and accounts are correlated, how entitlements are imported and how requests or lifecycle events are governed.",
      "Finish with provisioning operations, reconciliation, monitoring, error handling and evidence. Be clear about what you personally practised versus what you understand conceptually.",
      "A strong interview answer is structured, honest and specific. Use a fictional or lab example and explain how you tested the result."
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

  const query = ($("#notesSearch")?.value || "").trim().toLowerCase();
  const visibleNotes = learningNotes.filter((note) =>
    [note.category, note.title, note.excerpt, ...note.paragraphs].join(" ").toLowerCase().includes(query)
  );

  if (visibleNotes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-articles";
    empty.textContent = "No learning notes match your search. Try another keyword.";
    notesGrid.appendChild(empty);
    return;
  }

  visibleNotes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "article-card article-card-clickable note-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Read note: " + note.title);
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-controls", "noteDialog");

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

$("#notesSearch")?.addEventListener("input", renderLearningNotes);
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
