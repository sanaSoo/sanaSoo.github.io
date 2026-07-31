// ---------------------------------------------------------------------------
// Positions the elements in the About section (photo, stars, text lines).
// Normally just applies saved positions from about-layout.json.
//
// To fine-tune the layout yourself: open the site with ?edit=1 in the URL
// (e.g. http://localhost:8000/?edit=1). Drag any element to move it, drag its
// bottom-right dot to resize it, use the toolbar to rotate the selected
// element, then click "Save layout.json" and move the downloaded file into
// the project root (replacing the old one). Desktop widths only (>=900px).
// ---------------------------------------------------------------------------

const CANVAS = document.getElementById("about-canvas");
const IS_DESKTOP = () => window.matchMedia("(min-width: 900px)").matches;
const EDIT_MODE = new URLSearchParams(window.location.search).has("edit");

// Reasonable starting positions/sizes (px, relative to the canvas) — matches
// the current look. Feel free to hand-edit these too, or use ?edit=1.
const DEFAULT_LAYOUT = {
  "star-moss": { left: 180, top: -40, width: 260, height: 260, rotate: 12 },
  "star-rosy": { left: -60, top: 110, width: 260, height: 260, rotate: -18 },
  photo: { left: 20, top: 60, width: 280, height: 300, rotate: -3 },
  headline: { left: 460, top: 0, width: 600, height: null, rotate: 0 },
  meta: { left: 460, top: 180, width: 500, height: null, rotate: 0 },
  location: { left: 460, top: 230, width: 400, height: null, rotate: 0 },
  focus: { left: 460, top: 275, width: 420, height: null, rotate: 0 },
  interests: { left: 460, top: 375, width: 460, height: null, rotate: 0 },
  links: { left: 460, top: 495, width: 400, height: null, rotate: 0 }
};

let currentLayout = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));

function elFor(id) {
  return CANVAS ? CANVAS.querySelector(`[data-layout-id="${id}"]`) : null;
}

function applyLayout(layout) {
  if (!CANVAS) return;
  const desktop = IS_DESKTOP();
  Object.keys(DEFAULT_LAYOUT).forEach((id) => {
    const el = elFor(id);
    if (!el) return;
    if (!desktop) {
      el.removeAttribute("style");
      return;
    }
    const cfg = layout[id] || DEFAULT_LAYOUT[id];
    el.style.left = cfg.left + "px";
    el.style.top = cfg.top + "px";
    if (cfg.width != null) el.style.width = cfg.width + "px";
    if (cfg.height != null) el.style.height = cfg.height + "px";
    el.style.transform = `rotate(${cfg.rotate || 0}deg)`;
  });
}

function mergeLayout(base, overrides) {
  const merged = {};
  Object.keys(base).forEach((id) => {
    merged[id] = { ...base[id], ...(overrides && overrides[id] ? overrides[id] : {}) };
  });
  return merged;
}

async function loadLayout() {
  let saved = null;
  const draft = EDIT_MODE ? localStorage.getItem("aboutLayoutDraft") : null;
  if (draft) {
    try {
      saved = JSON.parse(draft);
    } catch (err) {
      saved = null;
    }
  }
  if (!saved) {
    try {
      const res = await fetch("about-layout.json");
      if (res.ok) saved = await res.json();
    } catch (err) {
      saved = null;
    }
  }
  currentLayout = mergeLayout(DEFAULT_LAYOUT, saved);
  applyLayout(currentLayout);
}

function persistDraft() {
  localStorage.setItem("aboutLayoutDraft", JSON.stringify(currentLayout));
}

// --- Edit mode -------------------------------------------------------------

function initEditMode() {
  if (!CANVAS) return;
  if (!IS_DESKTOP()) {
    alert("The layout editor only works at desktop widths (900px+). Widen your browser window.");
    return;
  }

  document.body.classList.add("layout-editing");
  let selectedId = null;
  let drag = null; // { id, el, startX, startY, startLeft, startTop }
  let resize = null; // { id, el, startX, startY, startWidth, startHeight, mode }

  Object.keys(DEFAULT_LAYOUT).forEach((id) => {
    const el = elFor(id);
    if (!el) return;

    if (el.dataset.resize) {
      const handle = document.createElement("div");
      handle.className = "layout-resize-handle";
      handle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        resize = {
          id,
          el,
          startX: e.clientX,
          startY: e.clientY,
          startWidth: el.offsetWidth,
          startHeight: el.offsetHeight,
          mode: el.dataset.resize
        };
      });
      el.appendChild(handle);
    }

    el.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("layout-resize-handle")) return;
      e.preventDefault();
      document.querySelectorAll(".layout-selected").forEach((n) => n.classList.remove("layout-selected"));
      el.classList.add("layout-selected");
      selectedId = id;
      drag = {
        id,
        el,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: parseFloat(el.style.left) || 0,
        startTop: parseFloat(el.style.top) || 0
      };
    });
  });

  window.addEventListener("mousemove", (e) => {
    if (drag) {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      const newLeft = drag.startLeft + dx;
      const newTop = drag.startTop + dy;
      drag.el.style.left = newLeft + "px";
      drag.el.style.top = newTop + "px";
      currentLayout[drag.id].left = newLeft;
      currentLayout[drag.id].top = newTop;
    }
    if (resize) {
      const dx = e.clientX - resize.startX;
      const dy = e.clientY - resize.startY;
      const newWidth = Math.max(30, resize.startWidth + dx);
      resize.el.style.width = newWidth + "px";
      currentLayout[resize.id].width = newWidth;
      if (resize.mode === "wh") {
        const newHeight = Math.max(30, resize.startHeight + dy);
        resize.el.style.height = newHeight + "px";
        currentLayout[resize.id].height = newHeight;
      }
    }
  });

  window.addEventListener("mouseup", () => {
    if (drag || resize) persistDraft();
    drag = null;
    resize = null;
  });

  const toolbar = document.createElement("div");
  toolbar.className = "layout-toolbar";
  toolbar.innerHTML = `
    <span>Editing layout &mdash; drag to move, drag the dot to resize</span>
    <button type="button" id="layout-rotate-ccw">&#8634; -5&deg;</button>
    <button type="button" id="layout-rotate-cw">&#8635; +5&deg;</button>
    <button type="button" id="layout-save">Save layout.json</button>
    <button type="button" id="layout-reset">Reset</button>
    <a href="?">Exit</a>
  `;
  document.body.appendChild(toolbar);

  document.getElementById("layout-rotate-ccw").addEventListener("click", () => rotateSelected(-5));
  document.getElementById("layout-rotate-cw").addEventListener("click", () => rotateSelected(5));

  function rotateSelected(delta) {
    if (!selectedId) {
      alert("Click an element first to select it, then rotate.");
      return;
    }
    currentLayout[selectedId].rotate = (currentLayout[selectedId].rotate || 0) + delta;
    elFor(selectedId).style.transform = `rotate(${currentLayout[selectedId].rotate}deg)`;
    persistDraft();
  }

  document.getElementById("layout-save").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(currentLayout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "about-layout.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("layout-reset").addEventListener("click", () => {
    if (!confirm("Reset the layout back to the defaults? This clears your in-progress edits.")) return;
    currentLayout = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
    applyLayout(currentLayout);
    localStorage.removeItem("aboutLayoutDraft");
  });
}

window.addEventListener("DOMContentLoaded", async () => {
  await loadLayout();
  if (EDIT_MODE) initEditMode();
});

window.addEventListener("resize", () => applyLayout(currentLayout));
