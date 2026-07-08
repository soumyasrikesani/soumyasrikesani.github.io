/* =============================================================================
   app.js — renders profile, skills, projects (as slide-tab panels),
   certifications, and the work-authorization note. Merges curated projects
   from config.js with any new public GitHub repos. Edit content in config.js.
   ============================================================================= */

(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const catName = (id) => {
    const c = CONFIG.categories.find((x) => x.id === id);
    return c ? c.name : "Other Projects";
  };
  // Normalize repo names so "customer-churn-nlp" == "customer churn nlp".
  const norm = (s) => String(s || "").toLowerCase().replace(/[-_\s.]+/g, "").trim();

  const SECTION_LABELS = [
    ["intro", "Introduction"],
    ["data", "Data & Tools"],
    ["method", "Methodology"],
    ["insights", "Insights"],
  ];

  /* ------------------------------------------------------------ static content */
  function renderProfile() {
    const p = CONFIG.profile;
    $("#hero-name").textContent = p.name;
    $("#hero-sub").textContent = p.subheading;
    $("#hero-tagline").textContent = p.tagline;
    document.title = `${p.name} | Data Scientist`;

    const meta = [];
    if (p.location) meta.push(`<span>◍ ${esc(p.location)}</span>`);
    if (p.email) meta.push(`<span>✉ ${esc(p.email)}</span>`);
    if (p.github) meta.push(`<span>⌥ github.com/${esc(CONFIG.githubUsername)}</span>`);
    $("#hero-meta").innerHTML = meta.join("");

    const img = $("#avatar-img");
    if (p.avatar) {
      img.src = p.avatar;
      img.alt = p.name;
      img.onerror = () => { $(".hero-avatar").classList.add("hidden"); };
    } else {
      $(".hero-avatar").classList.add("hidden");
    }

    $("#about-text").textContent = p.bio;
    $("#highlights").innerHTML = (p.highlights || [])
      .map((h) => `<div class="highlight"><span class="hl-value">${esc(h.value)}</span><span class="hl-label">${esc(h.label)}</span></div>`)
      .join("");

    // contact
    const links = [];
    if (p.email) links.push(`<a class="primary" href="mailto:${esc(p.email)}">Email me</a>`);
    if (p.linkedin) links.push(`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (p.github) links.push(`<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (p.resumeUrl) links.push(`<a href="${esc(p.resumeUrl)}" target="_blank" rel="noopener">Résumé (PDF)</a>`);
    $("#contact-links").innerHTML = links.join("");

    if (CONFIG.workAuthorization) {
      $("#work-auth").innerHTML =
        `<span class="wa-badge">Work Authorization</span><p>${esc(CONFIG.workAuthorization)}</p>`;
    }

    $("#footer-text").innerHTML =
      `© ${new Date().getFullYear()} ${esc(p.name)} · Claude-inspired theme · ` +
      `Projects sync live from <a href="${esc(p.github)}" target="_blank" rel="noopener" style="color:var(--accent)">GitHub</a>.`;
  }

  function renderSkills() {
    const root = $("#skill-groups");
    root.innerHTML = "";
    (CONFIG.skillGroups || []).forEach((g) => {
      const block = el("div", "skill-group reveal");
      block.appendChild(el("h3", "skill-group-name", esc(g.name)));
      const row = el("div", "skill-row");
      g.items.forEach((it) => {
        const chip = el("div", "skill");
        if (it.slug) {
          const im = el("img", "skill-logo");
          im.src = `https://cdn.simpleicons.org/${it.slug}`;
          im.alt = "";
          im.loading = "lazy";
          im.onerror = () => im.remove();
          chip.appendChild(im);
        }
        chip.appendChild(el("span", null, esc(it.label)));
        row.appendChild(chip);
      });
      block.appendChild(row);
      root.appendChild(block);
    });
  }

  function renderCerts() {
    const root = $("#certs-grid");
    const certs = CONFIG.certifications || [];
    if (!certs.length) { $("#certifications").classList.add("hidden"); return; }
    root.innerHTML = "";
    certs.forEach((c) => {
      const card = el("div", "cert-card reveal");
      const head = el("div", "cert-head");
      head.appendChild(el("h3", "cert-title", esc(c.title)));
      if (c.year) head.appendChild(el("span", "cert-year", esc(c.year)));
      card.appendChild(head);
      if (c.issuer) card.appendChild(el("p", "cert-issuer", esc(c.issuer)));
      if (c.note) card.appendChild(el("p", "cert-note", esc(c.note)));
      if (c.link) {
        const a = el("a", "cert-link", "View credential ↗");
        a.href = c.link; a.target = "_blank"; a.rel = "noopener";
        card.appendChild(a);
      }
      root.appendChild(card);
    });
  }

  /* ------------------------------------------------------------- project model */
  // Curated project -> internal shape
  function fromConfig(pr) {
    const sections = SECTION_LABELS
      .filter(([k]) => pr.sections && pr.sections[k])
      .map(([k, label]) => ({ key: k, label, text: pr.sections[k] }));
    return {
      title: pr.title,
      category: pr.category || "other",
      tools: pr.tools || [],
      tags: pr.tags || [],
      demo: pr.demo || "",
      code: "",           // resolved from GitHub if `repo` matches
      repoKey: norm(pr.repo),
      featured: !!pr.featured,
      sections,
      curated: true,
    };
  }

  // GitHub repo -> internal shape (single Overview slide)
  function fromRepo(r) {
    return {
      title: r.name.replace(/[-_]/g, " "),
      category: keywordCategory(r),
      tools: (r.language ? [r.language] : []).concat((r.topics || []).slice(0, 4)),
      tags: [],
      demo: r.homepage || "",
      code: r.html_url,
      repoKey: norm(r.name),
      featured: false,
      sections: [{ key: "intro", label: "Overview", text: r.description || "No description yet. See the repository for details." }],
      curated: false,
    };
  }

  function keywordCategory(r) {
    const hay = [r.name, r.description, (r.topics || []).join(" ")].join(" ").toLowerCase();
    const map = {
      nlp: ["nlp", "text", "churn", "complaint", "tf-idf", "sentiment"],
      forecasting: ["forecast", "time-series", "arima", "ets"],
      geo: ["geo", "spatial", "viirs", "modis", "wildfire", "fire", "satellite", "earth-engine"],
      viz: ["dashboard", "tableau", "power-bi", "visualization", "viz"],
      dataeng: ["etl", "pipeline", "database", "sql", "warehouse"],
      web: ["django", "flask", "web", "scraper", "app"],
      ml: ["ml", "classifier", "prediction", "cluster", "regression", "shap"],
    };
    for (const id of Object.keys(map)) if (map[id].some((k) => hay.includes(k))) return id;
    return "other";
  }

  /* --------------------------------------------------------------- rendering */
  let ALL = [];
  let activeFilter = "all";

  function projectPanel(p, idx) {
    const panel = el("article", "project reveal" + (p.featured ? " featured" : ""));

    // left rail
    const rail = el("div", "project-rail");
    if (p.featured) rail.appendChild(el("span", "star-badge", "★ Featured"));
    rail.appendChild(el("span", "project-cat", esc(catName(p.category))));
    rail.appendChild(el("h3", "project-title", esc(p.title)));
    if (p.tags && p.tags.length) {
      const tw = el("div", "project-tags");
      p.tags.forEach((t) => tw.appendChild(el("span", "ptag", esc(t))));
      rail.appendChild(tw);
    }
    if (p.tools && p.tools.length) {
      const tw = el("div", "project-tools");
      p.tools.forEach((t) => tw.appendChild(el("span", "tool", esc(t))));
      rail.appendChild(tw);
    }
    const links = el("div", "project-links");
    if (p.demo) {
      const a = el("a", "btn-sm primary", "Live demo ↗");
      a.href = p.demo; a.target = "_blank"; a.rel = "noopener"; links.appendChild(a);
    }
    if (p.code) {
      const a = el("a", "btn-sm", "View code ↗");
      a.href = p.code; a.target = "_blank"; a.rel = "noopener"; links.appendChild(a);
    }
    if (links.children.length) rail.appendChild(links);
    panel.appendChild(rail);

    // right: slides
    const body = el("div", "project-body");
    const single = p.sections.length <= 1;
    if (!single) {
      const tabs = el("div", "slide-tabs");
      p.sections.forEach((s, i) => {
        const t = el("button", "slide-tab" + (i === 0 ? " active" : ""), esc(s.label));
        t.dataset.target = `${idx}-${i}`;
        t.onclick = () => {
          tabs.querySelectorAll(".slide-tab").forEach((b) => b.classList.remove("active"));
          t.classList.add("active");
          body.querySelectorAll(".slide").forEach((sl) => sl.classList.remove("active"));
          body.querySelector(`[data-slide="${idx}-${i}"]`).classList.add("active");
        };
        tabs.appendChild(t);
      });
      body.appendChild(tabs);
    }
    const slides = el("div", "slides");
    p.sections.forEach((s, i) => {
      const sl = el("div", "slide" + (i === 0 ? " active" : ""));
      sl.dataset.slide = `${idx}-${i}`;
      if (single) sl.appendChild(el("span", "slide-label", esc(s.label)));
      sl.appendChild(el("p", "slide-text", esc(s.text)));
      slides.appendChild(sl);
    });
    body.appendChild(slides);
    panel.appendChild(body);

    return panel;
  }

  function renderFilters() {
    const root = $("#filters");
    const present = new Set(ALL.map((p) => p.category));
    const cats = [{ id: "all", name: "All" }]
      .concat(CONFIG.categories.filter((c) => present.has(c.id)))
      .concat(present.has("other") ? [{ id: "other", name: "Other" }] : []);
    root.innerHTML = "";
    cats.forEach((c) => {
      const chip = el("button", "filter-chip" + (c.id === activeFilter ? " active" : ""), esc(c.name));
      chip.onclick = () => { activeFilter = c.id; renderFilters(); renderProjects(); };
      root.appendChild(chip);
    });
  }

  function renderProjects() {
    const root = $("#projects-root");
    root.innerHTML = "";
    let idx = 0;

    // Featured first (only on "all")
    if (activeFilter === "all") {
      const feat = ALL.filter((p) => p.featured);
      if (feat.length) {
        const block = el("div", "category-block");
        block.appendChild(el("h3", "category-name", "★ Featured"));
        feat.forEach((p) => block.appendChild(projectPanel(p, idx++)));
        root.appendChild(block);
      }
    }

    const order = CONFIG.categories.map((c) => c.id).concat("other");
    let shown = 0;
    order.forEach((catId) => {
      if (activeFilter !== "all" && activeFilter !== catId) return;
      let items = ALL.filter((p) => p.category === catId);
      if (activeFilter === "all") items = items.filter((p) => !p.featured); // avoid dupes
      if (!items.length) return;
      shown += items.length;

      const block = el("div", "category-block");
      const head = el("div", "category-head");
      head.appendChild(el("h3", "category-name", esc(catName(catId))));
      head.appendChild(el("span", "category-count", items.length));
      block.appendChild(head);
      items.forEach((p) => block.appendChild(projectPanel(p, idx++)));
      root.appendChild(block);
    });

    if (!shown && activeFilter !== "all") root.appendChild(el("p", "loading", "No projects in this category yet."));
    observeReveals();
  }

  /* ------------------------------------------------------------ reveal + theme */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.06 }
      );
    }
    document.querySelectorAll(".reveal:not(.in)").forEach((n) => io.observe(n));
  }

  function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
    $("#theme-toggle").onclick = () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };
  }

  /* ------------------------------------------------------------------- fetch */
  async function fetchRepos() {
    const user = CONFIG.githubUsername;
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  function mergeRepos(repos) {
    const excl = new Set((CONFIG.excludeRepos || []).map(norm));
    const curatedRepoKeys = new Set(ALL.filter((p) => p.repoKey).map((p) => p.repoKey));

    repos.forEach((r) => {
      const key = norm(r.name);
      // attach code link to a curated project that references this repo
      const match = ALL.find((p) => p.repoKey === key);
      if (match) { if (!match.code) match.code = r.html_url; return; }
      if (excl.has(key)) return;
      if (CONFIG.excludeForks && r.fork) return;
      if (CONFIG.excludeArchived && r.archived) return;
      if (curatedRepoKeys.has(key)) return;
      ALL.push(fromRepo(r));
    });
  }

  function paint() {
    renderFilters();
    renderProjects();
  }

  /* -------------------------------------------------------------------- boot */
  async function init() {
    initTheme();
    renderProfile();
    renderSkills();
    renderCerts();

    ALL = (CONFIG.projects || []).map(fromConfig);
    paint(); // curated projects render immediately

    try {
      const repos = await fetchRepos();
      mergeRepos(repos);
      paint(); // add code links + any new repos
    } catch (e) {
      // Curated projects already shown; GitHub is optional enrichment.
      observeReveals();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
