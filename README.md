# sanaSoo.github.io

My personal portfolio site. Plain HTML/CSS/JS — no build step, no dependencies. Served directly by GitHub Pages from `main`.

## Structure

```
index.html                About + Projects layout, project detail overlay
admin.html                 Form-based tool for adding/editing projects (see below)
css/style.css               All styling
js/main.js                  Fetches projects.json and renders the listing + detail view
projects/projects.json      Your project content — edit via admin.html, or by hand
assets/images/about/        Your profile photo
assets/images/projects/<slug>/   Photos per project
assets/videos/projects/<slug>/   Videos per project (optional)
```

## Editing the About section

Open `index.html` and edit the text inside `<section id="about">` — bio, meta line (pronouns / school / location), and the links (email, GitHub, LinkedIn, resume). Drop a photo at `assets/images/about/profile.jpg`.

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
- `blurb` (short, shown in the listing), `description` (longer, shown on the detail page)
- `tags` — array of strings (rendered as color swatches)
- `thumbnail` — path to the listing image
- `links` — e.g. repo / demo, shown in the listing and on the detail page
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
