# sanaSoo.github.io

My personal portfolio site. Plain HTML/CSS/JS — no build step, no dependencies. Served directly by GitHub Pages from `main`.

## Structure

```
index.html                About + Projects layout, project detail overlay
admin.html                 Form-based tool for adding/editing projects (see below)
css/style.css               All styling
js/main.js                  Fetches projects.json and renders the listing + detail view
js/layout.js                 Positions the About section elements (see "Repositioning" below)
about-layout.json            Saved positions for the About section (optional — see below)
projects/projects.json      Your project content — edit via admin.html, or by hand
assets/images/about/        Your profile photo
assets/images/projects/<slug>/   Photos per project
assets/videos/projects/<slug>/   Videos per project (optional)
```

## Editing the About section

Open `index.html` and edit the text inside `<section id="about">` — headline, pronouns/school, location, focus line, interests line, and the github/linkedin links. Drop a photo at `assets/images/about/profile.jpg`.

### Repositioning things (photo, stars, text) to match your Figma design

The About section (photo, the two star shapes, and every line of text) is freely positioned rather than laid out automatically, so you can drag things around to match a design exactly.

1. Run the site locally (see below) and open `http://localhost:8000/?edit=1` — this only works at desktop widths (900px+).
2. Drag any element to move it. Drag the small dot on its bottom-right corner to resize it.
3. Click an element to select it, then use the **-5° / +5°** buttons in the toolbar to rotate it (useful for the stars and photo).
4. Your changes auto-save to your browser as you go, so refreshing won't lose progress. When you're happy, click **Save layout.json**, then move the downloaded file into the project root (replacing `about-layout.json` if one already exists).
5. Commit and push. If you ever want to start over, click **Reset** in the toolbar.

If no `about-layout.json` exists yet, the site just uses the built-in default positions in `js/layout.js` — nothing breaks.

## Adding a project (recommended: use the form)

1. Run the site locally (see below) and open `http://localhost:8000/admin.html`.
2. Click **+ New Project**, fill out the fields, and click **Save to list**. The slug auto-fills from the title and the form won't let you save a duplicate.
3. Click **Download projects.json**, then move the downloaded file into `projects/`, replacing the old one.
4. Drop any new images/videos into `assets/images/projects/<slug>/` (or `assets/videos/projects/<slug>/`), matching the paths you entered in the form.
5. Commit and push.

You can also reopen `admin.html` later to edit or delete an existing project — click it in the "Current Projects" list to load it back into the form.

## Adding a project (manual alternative)

`projects/projects.json` is a plain JSON array. Copy an existing object, edit the fields, and make sure `slug` is unique. Fields:

- `slug` — short unique id, used in the URL (e.g. `my-cool-app`)
- `title`, `year`, `titleStyle` (`"serif"`, `"script"`, or `"typewriter"` — controls the display font)
- `tagline` — one line shown right under the title (e.g. "a PMOS symptom management tool")
- `taglineGap` / `blurbGap` — optional numbers (px). Overrides the space above the tagline/blurb; negative values pull it up toward the line above (for that tight, editorial "gapped" look). Omit for normal spacing.
- `blurb` (1-3 sentences, shown in the listing), `description` (longer, shown on the detail page)
- `thumbnail` — path to the listing image
- `palette` — array of hex colors shown as a swatch strip (e.g. `["#e37083", "#f49aa2", "#ffcb7c"]`)
- `tags` — optional array of strings, shown as small labels on the detail page only
- `links` — `{ "repo": "https://...", "demo": "https://..." }`
- `gallery` — array of photos/videos:
  - `{ "type": "image", "src": "..." }`
  - `{ "type": "video", "src": "..." }` for a local video file
  - `{ "type": "youtube", "id": "VIDEO_ID" }` for an embedded YouTube video
- `devLog` — array of dated updates: `{ "date", "title", "text", "media" }` (`media` is optional)

Save the file — the project automatically appears in the listing and gets its own shareable URL (`#project/<slug>`).

## Running locally

```
python3 -m http.server
```

Then open `http://localhost:8000`. (Opening `index.html` directly as a `file://` URL won't work — the site fetches `projects.json`, which requires a server.)

## Deploying

Push to `main` — GitHub Pages serves the site automatically at `https://sanaSoo.github.io`.
