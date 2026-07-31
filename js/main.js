// ---------------------------------------------------------------------------
// Renders the project grid from PROJECTS (see projects-data.js) and handles
// showing/hiding the project detail view based on the URL hash
// (e.g. #project/sample-project). No other file needs to change when you
// add new projects.
// ---------------------------------------------------------------------------

document.getElementById("year").textContent = new Date().getFullYear();

const grid = document.getElementById("projects-grid");
const detailEl = document.getElementById("project-detail");
const detailContent = document.getElementById("project-detail-content");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : str;
  return div.innerHTML;
}

function renderGrid() {
  grid.innerHTML = PROJECTS.map(
    (p) => `
    <a class="project-card" href="#project/${encodeURIComponent(p.slug)}">
      <div class="project-card-thumb">
        <img src="${escapeHtml(p.thumbnail)}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.style.display='none'" />
      </div>
      <div class="project-card-body">
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.blurb)}</p>
        <div class="tag-list">
          ${(p.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    </a>
  `
  ).join("");
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
  detailContent.innerHTML = `
    <h2>${escapeHtml(project.title)}</h2>
    <div class="tag-list">
      ${(project.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
    </div>
    <p class="project-description">${escapeHtml(project.description)}</p>
    <div class="detail-links">
      ${(project.links || [])
        .map(
          (l) =>
            `<a class="btn btn-primary" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`
        )
        .join("")}
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
  const hash = window.location.hash; // e.g. "#project/sample-project"
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

window.addEventListener("hashchange", showDetailFromHash);
window.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  showDetailFromHash();
});
