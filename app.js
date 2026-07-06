/* =============================================================================
   app.js — fetches your public GitHub repos, sorts them into themed
   categories, and renders the portfolio. You should not need to edit this;
   change behavior in config.js instead.
   ============================================================================= */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
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

  /* ---------- Static content from config ---------- */
  function renderProfile() {
    const p = CONFIG.profile;
    $("#hero-eyebrow").textContent = p.title;
    $("#hero-name").textContent = p.name;
    $("#hero-tagline").textContent = p.tagline;
    document.title = `${p.name} — ${p.title}`;

    const meta = $("#hero-meta");
    const bits = [];
    if (p.location) bits.push(`<span>◍ ${esc(p.location)}</span>`);
    if (p.email) bits.push(`<span>✉ ${esc(p.email)}</span>`);
    if (p.github) bits.push(`<span>⌥ github.com/${esc(CONFIG.githubUsername)}</span>`);
    meta.innerHTML = bits.join("");

    $("#about-text").textContent = p.about;
    $("#skills").innerHTML = (CONFIG.skills || [])
      .map((s) => `<span class="skill-chip">${esc(s)}</span>`)
      .join("");

    const links = [];
    if (p.email) links.push(`<a class="primary" href="mailto:${esc(p.email)}">Email me</a>`);
    if (p.linkedin) links.push(`<a href="${esc(p.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
    if (p.github) links.push(`<a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>`);
    if (p.resumeUrl) links.push(`<a href="${esc(p.resumeUrl)}" target="_blank" rel="noopener">Résumé (PDF)</a>`);
    $("#contact-links").innerHTML = links.join("");

    $("#footer-text").innerHTML =
      `© ${new Date().getFullYear()} ${esc(p.name)} · Built with a Claude-inspired theme · ` +
      `Projects sync live from <a href="${esc(p.github)}" target="_blank" rel="noopener" style="color:var(--accent)">GitHub</a>.`;
  }

  /* ---------- Categorization ---------- */
  function haystack(repo) {
    return [repo.name, repo.description, (repo.topics || []).join(" ")]
      .join(" ")
      .toLowerCase();
  }

  function categorize(repo) {
    const ov = CONFIG.overrides[repo.name];
    if (ov && ov.category) return ov.category;

    const topics = (repo.topics || []).map((t) => t.toLowerCase());
    // 1. topic match
    for (const cat of CONFIG.categories) {
      if ((cat.topics || []).some((t) => topics.includes(t.toLowerCase()))) return cat.id;
    }
    // 2. keyword match
    const hay = haystack(repo);
    for (const cat of CONFIG.categories) {
      if ((cat.keywords || []).some((k) => hay.includes(k.toLowerCase()))) return cat.id;
    }
    return "other";
  }

  function display(repo) {
    const ov = CONFIG.overrides[repo.name] || {};
    return {
      name: repo.name,
      title: ov.title || repo.name.replace(/[-_]/g, " "),
      description: ov.description || repo.description || "No description yet.",
      demo: ov.demo || repo.homepage || "",
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      topics: (repo.topics || []).slice(0, 5),
      updated: repo.pushed_at,
      catId: categorize(repo),
    };
  }

  function displayManual(p) {
    return {
      name: p.title,
      title: p.title,
      description: p.description || "No description yet.",
      demo: p.demo || "",
      url: p.code || "",            // no repo → "Code" button is hidden
      language: p.language || "",
      stars: 0,
      topics: (p.tech || []).slice(0, 5),
      updated: p.updated || null,
      catId: p.category && catById(p.category) ? p.category : "other",
      manual: true,
      featured: !!p.featured,
    };
  }

  /* ---------- Card rendering ---------- */
  function card(d, featured) {
    const c = el("article", "card reveal" + (featured ? " featured" : ""));

    const top = el("div", "card-top");
    top.appendChild(el("h3", "card-title", esc(d.title)));
    c.appendChild(top);

    c.appendChild(el("p", "card-desc", esc(d.description)));

    if (d.topics.length) {
      const t = el("div", "card-topics");
      d.topics.forEach((tp) => t.appendChild(el("span", "topic", esc(tp))));
      c.appendChild(t);
    }

    const foot = el("div", "card-foot");
    const stats = el("div", "card-stats");
    if (d.language) stats.appendChild(el("span", null, `<span class="lang-dot"></span>${esc(d.language)}`));
    if (d.stars > 0) stats.appendChild(el("span", null, `★ ${d.stars}`));
    foot.appendChild(stats);

    const links = el("div", "card-links");
    if (d.demo) {
      const a = el("a", null, "Live demo ↗");
      a.href = d.demo; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    }
    if (d.url) {
      const code = el("a", d.demo ? "muted" : null, "Code ↗");
      code.href = d.url; code.target = "_blank"; code.rel = "noopener";
      links.appendChild(code);
    }
    foot.appendChild(links);

    c.appendChild(foot);
    return c;
  }

  /* ---------- Main render ---------- */
  let ALL = [];
  let activeFilter = "all";

  function catById(id) {
    return CONFIG.categories.find((c) => c.id === id);
  }

  function renderFeatured() {
    const names = CONFIG.featured || [];
    if (!names.length) return;
    const items = names
      .map((n) => ALL.find((d) => d.name === n))
      .filter(Boolean);
    if (!items.length) return;
    $("#featured").classList.remove("hidden");
    const grid = $("#featured-grid");
    grid.innerHTML = "";
    items.forEach((d) => grid.appendChild(card(d, true)));
  }

  function renderFilters() {
    const root = $("#filters");
    const present = new Set(ALL.map((d) => d.catId));
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

    const order = CONFIG.categories
      .map((c) => c.id)
      .concat("other");

    let shown = 0;
    order.forEach((catId) => {
      if (activeFilter !== "all" && activeFilter !== catId) return;
      const items = ALL.filter((d) => d.catId === catId);
      if (!items.length) return;
      shown += items.length;

      const cat = catById(catId);
      const block = el("div", "category-block");
      const head = el("div", "category-head");
      head.appendChild(el("h3", "category-name", esc(cat ? cat.name : "Other Projects")));
      head.appendChild(el("span", "category-count", items.length));
      if (cat && cat.description) head.appendChild(el("p", "category-desc", esc(cat.description)));
      block.appendChild(head);

      const grid = el("div", "grid");
      items.forEach((d) => grid.appendChild(card(d, false)));
      block.appendChild(grid);
      root.appendChild(block);
    });

    if (!shown) root.appendChild(el("p", "loading", "No projects in this category yet."));
    observeReveals();
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((n) => n.classList.add("in"));
      return;
    }
    if (!io) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
        { threshold: 0.08 }
      );
    }
    document.querySelectorAll(".reveal:not(.in)").forEach((n) => io.observe(n));
  }

  /* ---------- Fetch ---------- */
  async function fetchRepos() {
    const user = CONFIG.githubUsername;
    const url = `https://api.github.com/users/${encodeURIComponent(user)}/repos?per_page=100&sort=updated`;
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) {
      if (res.status === 403) throw new Error("RATE_LIMIT");
      if (res.status === 404) throw new Error("NOT_FOUND");
      throw new Error("HTTP " + res.status);
    }
    return res.json();
  }

  function filterRepos(repos) {
    const excl = new Set(CONFIG.excludeRepos || []);
    return repos.filter((r) => {
      if (excl.has(r.name)) return false;
      if ((CONFIG.overrides[r.name] || {}).hidden) return false;
      if (CONFIG.excludeForks && r.fork) return false;
      if (CONFIG.excludeArchived && r.archived) return false;
      return true;
    });
  }

  function showError(kind) {
    const map = {
      RATE_LIMIT:
        "GitHub's public API rate limit was hit (60 requests/hour per network). " +
        "This resets within the hour — refresh then. Your live site rarely hits this.",
      NOT_FOUND: `No GitHub user found for “${esc(CONFIG.githubUsername)}”. Check <code>githubUsername</code> in config.js.`,
      DEFAULT: "Couldn't reach GitHub right now. Please refresh in a moment.",
    };
    $("#projects-root").innerHTML =
      `<div class="error-box">${map[kind] || map.DEFAULT}<br><br>` +
      `Meanwhile, browse everything on <a href="${esc(CONFIG.profile.github)}" target="_blank" rel="noopener">GitHub ↗</a>.</div>`;
  }

  /* ---------- Theme toggle ---------- */
  function initTheme() {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    $("#theme-toggle").onclick = () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };
  }

  /* ---------- Boot ---------- */
  function paint() {
    // manual projects first (curated), then GitHub repos by stars/recency
    ALL.sort((a, b) => {
      if (!!b.manual !== !!a.manual) return a.manual ? -1 : 1;
      return (b.stars - a.stars) || (new Date(b.updated || 0) - new Date(a.updated || 0));
    });
    renderFeatured();
    renderFilters();
    renderProjects();
  }

  async function init() {
    initTheme();
    renderProfile();

    // 1. Manual projects render immediately (no network needed).
    const manual = (CONFIG.manualProjects || []).map(displayManual);
    ALL = manual.slice();
    if (manual.length) paint();

    // 2. Merge in live GitHub repos when they arrive.
    try {
      const raw = await fetchRepos();
      const repos = filterRepos(raw).map(display);
      ALL = manual.concat(repos);
      paint();
    } catch (e) {
      if (manual.length) {
        // Keep manual projects visible; note GitHub is temporarily unavailable.
        const note = el("div", "error-box");
        note.style.marginTop = "24px";
        note.innerHTML =
          "Live GitHub projects are temporarily unavailable (API limit or network). " +
          `The projects above are always shown. See more on ` +
          `<a href="${esc(CONFIG.profile.github)}" target="_blank" rel="noopener">GitHub ↗</a>.`;
        $("#projects-root").appendChild(note);
      } else {
        showError(e.message);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
