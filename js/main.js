// ---------------------------------------------------------------------------
// Fetches projects/projects.json and renders:
//   1. An alternating "story" list of projects on the homepage
//   2. A full detail view when a project's hash is opened (#project/<slug>)
// Add/edit projects with admin.html, or edit projects/projects.json directly.
// ---------------------------------------------------------------------------

document.getElementById("year").textContent = new Date().getFullYear();

const list = document.getElementById("projects-list");
const detailEl = document.getElementById("project-detail");
const detailContent = document.getElementById("project-detail-content");

const CALLOUT_COLORS = ["var(--rosy-brown)", "var(--moss-green)"];

let PROJECTS = [];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function titleFontClass(titleStyle) {
  if (titleStyle === "script") return "project-title--script";
  if (titleStyle === "typewriter") return "project-title--typewriter";
  return "project-title--serif";
}

function gapStyle(gap) {
  return typeof gap === "number" && !Number.isNaN(gap) ? ` style="margin-top:${gap}px"` : "";
}

function renderSwatches(palette) {
  return (palette || [])
    .map((hex) => `<span class="swatch" style="background:${escapeHtml(hex)}"></span>`)
    .join("");
}

function renderList() {
  list.innerHTML = PROJECTS.map((p, i) => {
    const calloutColor = CALLOUT_COLORS[i % CALLOUT_COLORS.length];
    const links = p.links || {};

    return `
      <article class="project-row">
        <div class="project-row-media">
          <img src="${escapeHtml(p.thumbnail)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.style.display='none'" />
        </div>
        <div class="project-row-content">
          <div class="project-row-heading">
            <h3 class="project-title ${titleFontClass(p.titleStyle)}">${escapeHtml(p.title)}</h3>
            ${p.year ? `<span class="project-year">${escapeHtml(p.year)}</span>` : ""}
          </div>
          ${p.tagline ? `<p class="project-tagline"${gapStyle(p.taglineGap)}>${escapeHtml(p.tagline)}</p>` : ""}
          <p class="project-blurb"${gapStyle(p.blurbGap)}>${escapeHtml(p.blurb)}</p>
          <div class="swatch-row">${renderSwatches(p.palette)}</div>
          <div class="project-callout" style="background:${calloutColor}">
            <a class="callout-primary" href="#project/${encodeURIComponent(p.slug)}">link to full story</a>
            <div class="callout-links">
              ${links.repo ? `<a href="${escapeHtml(links.repo)}" target="_blank" rel="noopener">underlined link to repo</a>` : ""}
              ${links.demo ? `<a href="${escapeHtml(links.demo)}" target="_blank" rel="noopener">underlined link to demo</a>` : ""}
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderGalleryItem(item) {
  if (item.type === "image") {
    return `<div class="gallery-item"><img src="${escapeHtml(item.src)}" alt="" loading="lazy" onerror="this.style.display='none'" /></div>`;
  }
  if (item.type === "video") {
    return `<div class="gallery-item"><video src="${escapeHtml(item.src)}" controls></video></div>`;
  }
  if (item.type === "youtube") {
    return `<div class="gallery-item gallery-item-youtube">
      <iframe
        src="https://www.youtube.com/embed/${encodeURIComponent(item.id)}"
        title="YouTube video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>`;
  }
  return "";
}

function renderDevLogEntry(entry) {
  return `
    <div class="devlog-entry">
      <div class="devlog-date">${escapeHtml(entry.date)}</div>
      <h4>${escapeHtml(entry.title)}</h4>
      <p>${escapeHtml(entry.text)}</p>
      ${entry.media ? `<div class="devlog-media"><img src="${escapeHtml(entry.media)}" alt="" loading="lazy" /></div>` : ""}
    </div>
  `;
}

function renderProjectDetail(project) {
  const links = project.links || {};
  detailContent.innerHTML = `
    <h2 class="${titleFontClass(project.titleStyle)}">${escapeHtml(project.title)}</h2>
    ${project.tagline ? `<p class="project-tagline"${gapStyle(project.taglineGap)}>${escapeHtml(project.tagline)}</p>` : ""}
    <div class="swatch-row">${renderSwatches(project.palette)}</div>
    ${
      project.tags && project.tags.length
        ? `<div class="tag-list">${project.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>`
        : ""
    }
    <p class="project-description">${escapeHtml(project.description)}</p>
    <div class="detail-links">
      ${links.repo ? `<a class="btn btn-primary" href="${escapeHtml(links.repo)}" target="_blank" rel="noopener">Repo</a>` : ""}
      ${links.demo ? `<a class="btn btn-primary" href="${escapeHtml(links.demo)}" target="_blank" rel="noopener">Demo</a>` : ""}
    </div>

    ${
      project.gallery && project.gallery.length
        ? `<h3>Gallery</h3><div class="gallery-grid">${project.gallery.map(renderGalleryItem).join("")}</div>`
        : ""
    }

    ${
      project.devLog && project.devLog.length
        ? `<h3>Development Log</h3><div class="devlog-list">${project.devLog.map(renderDevLogEntry).join("")}</div>`
        : ""
    }
  `;
}

function showDetailFromHash() {
  const hash = window.location.hash; // e.g. "#project/sample-project-one"
  const match = hash.match(/^#project\/(.+)$/);

  if (match) {
    const slug = decodeURIComponent(match[1]);
    const project = PROJECTS.find((p) => p.slug === slug);
    if (project) {
      renderProjectDetail(project);
      detailEl.classList.add("open");
      detailEl.setAttribute("aria-hidden", "false");
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      return;
    }
  }

  detailEl.classList.remove("open");
  detailEl.setAttribute("aria-hidden", "true");
}

async function init() {
  try {
    const res = await fetch("projects/projects.json");
    PROJECTS = await res.json();
  } catch (err) {
    console.error("Could not load projects/projects.json", err);
    PROJECTS = [];
  }
  renderList();
  showDetailFromHash();
}

window.addEventListener("hashchange", showDetailFromHash);
window.addEventListener("DOMContentLoaded", init);
