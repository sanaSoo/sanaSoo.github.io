// ---------------------------------------------------------------------------
// Masonry photo feed + lightbox for photography.html.
//
// To add real photos: drop image files into assets/images/photography/,
// then add one entry per photo to the `photos` array below (src + caption).
// Actual pixel dimensions are read from each file at load time so portrait
// and landscape shots both keep their real proportions in the grid. Leave
// `photos` empty to keep showing the placeholder tiles.
// ---------------------------------------------------------------------------

document.getElementById("year").textContent = new Date().getFullYear();

const feed = document.getElementById("feed");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const PALETTE = ["#0a3323", "#839958", "#d3968c", "#105666"];

function placeholderSrc(w, h, colorA, colorB) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${colorA}"/>
          <stop offset="1" stop-color="${colorB}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;
  return "data:image/svg+xml;base64," + btoa(svg);
}

// Edit this array to add real photos, e.g.:
// { src: "assets/images/photography/forest-path.jpg", caption: "Forest path" }
const photos = [
  { src: "assets/images/photography/img_1284.jpg", caption: "" },
  { src: "assets/images/photography/img_1429.jpg", caption: "" },
  { src: "assets/images/photography/img_1485.jpg", caption: "" },
  { src: "assets/images/photography/img_1513.jpg", caption: "" },
  { src: "assets/images/photography/img_1942.jpg", caption: "" },
  { src: "assets/images/photography/img_2055.jpg", caption: "" },
  { src: "assets/images/photography/img_2080.jpg", caption: "" },
  { src: "assets/images/photography/img_2103.jpg", caption: "" },
  { src: "assets/images/photography/img_3393.jpg", caption: "" },
  { src: "assets/images/photography/img_3521.jpg", caption: "" },
  { src: "assets/images/photography/img_3525.jpg", caption: "" },
  { src: "assets/images/photography/img_3640.jpg", caption: "" },
  { src: "assets/images/photography/img_4309.jpg", caption: "" },
  { src: "assets/images/photography/img_4408.jpg", caption: "" },
  { src: "assets/images/photography/img_4414.jpg", caption: "" },
  { src: "assets/images/photography/img_4627.jpg", caption: "" },
  { src: "assets/images/photography/img_4672.jpg", caption: "" }
];

const PLACEHOLDER_HEIGHTS = [600, 300, 500, 700, 350, 450, 620, 300, 550, 400, 650, 380, 280, 520, 460, 610, 340, 590, 420, 330];
const PLACEHOLDER_CAPTIONS = [
  "Forest path", "Golden hour", "Old bridge", "Coastline", "Wildflowers",
  "Mountain road", "Foggy trail", "Lakeside", "Autumn leaves", "Night sky",
  "City street", "Rooftop view", "Quiet alley", "Sunset dock", "Harbor lights",
  "Desert dune", "Snowy peak", "Garden gate", "River bend", "Open field"
];

const items = photos.length
  ? photos
  : PLACEHOLDER_HEIGHTS.map((h, i) => {
      const w = 400;
      const colorA = PALETTE[i % PALETTE.length];
      const colorB = PALETTE[(i + 2) % PALETTE.length];
      return {
        src: placeholderSrc(w, h, colorA, colorB),
        caption: PLACEHOLDER_CAPTIONS[i],
        width: w,
        height: h
      };
    });

// Real photos don't carry hardcoded dimensions, so portrait and landscape
// shots each get their true aspect ratio instead of being forced into an
// assumed one (which caused cropping/overlap in the grid).
function loadDimensions(item) {
  return new Promise((resolve) => {
    if (item.width && item.height) {
      resolve(item);
      return;
    }
    const probe = new Image();
    probe.onload = () => {
      item.width = probe.naturalWidth;
      item.height = probe.naturalHeight;
      resolve(item);
    };
    probe.onerror = () => {
      item.width = 4;
      item.height = 3;
      resolve(item);
    };
    probe.src = item.src;
  });
}

const GAP = 16;

function getColumnCount() {
  const w = feed.clientWidth;
  if (w <= 480) return 1;
  if (w <= 700) return 2;
  if (w <= 950) return 3;
  return 4;
}

const cardEls = [];

function buildGrid() {
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.caption;
    img.loading = "lazy";
    img.width = item.width;
    img.height = item.height;

    card.appendChild(img);
    feed.appendChild(card);
    card.addEventListener("click", () => openLightbox(index));

    cardEls.push({ el: card, item });
  });

  layout();
}

function layout() {
  const columnCount = getColumnCount();
  const containerWidth = feed.clientWidth;
  const columnWidth = (containerWidth - GAP * (columnCount - 1)) / columnCount;
  const columnHeights = new Array(columnCount).fill(0);

  cardEls.forEach(({ el, item }) => {
    let col = 0;
    for (let i = 1; i < columnCount; i++) {
      if (columnHeights[i] < columnHeights[col]) col = i;
    }

    const cardHeight = columnWidth * (item.height / item.width);
    const currentTop = columnHeights[col];
    const top = currentTop === 0 ? 0 : currentTop + GAP;
    const left = col * (columnWidth + GAP);

    el.style.width = `${columnWidth}px`;
    el.style.height = `${cardHeight}px`;
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;

    columnHeights[col] = top + cardHeight;
  });

  feed.style.height = `${Math.max(...columnHeights, 0)}px`;
}

Promise.all(items.map(loadDimensions)).then(buildGrid);

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(layout, 100);
});

let activeIndex = -1;
let lastFocused = null;

function showItem(index) {
  const item = items[index];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.caption;
  lightboxCaption.textContent = item.caption;
}

function openLightbox(index) {
  activeIndex = index;
  lastFocused = document.activeElement;
  showItem(activeIndex);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  if (lastFocused) lastFocused.focus();
}

function showRelative(delta) {
  if (activeIndex === -1) return;
  activeIndex = (activeIndex + delta + items.length) % items.length;
  showItem(activeIndex);
}

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showRelative(-1));
lightboxNext.addEventListener("click", () => showRelative(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox(); // click outside image closes it
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showRelative(-1);
  if (e.key === "ArrowRight") showRelative(1);
});
