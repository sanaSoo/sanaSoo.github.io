# sanaSoo.github.io

My personal portfolio site. Plain HTML/CSS/JS — no build step, no dependencies. Served directly by GitHub Pages from `main`.

## Structure

```
index.html              About + Projects layout, project detail overlay
css/style.css            All styling
js/projects-data.js      <-- the file you edit to add/update projects
js/main.js               Renders project cards + detail view (rarely touched)
assets/images/about/     Your profile photo
assets/images/projects/<slug>/   Photos per project
assets/videos/projects/<slug>/   Videos per project (optional)
```

## Editing the About section

Open `index.html` and edit the text inside `<section id="about">` — bio text and the links (email, GitHub, LinkedIn, resume). Drop a photo at `assets/images/about/profile.jpg`.

## Adding a project

1. Create a folder for its media: `assets/images/projects/<your-slug>/` (and `assets/videos/projects/<your-slug>/` if you have video files).
2. Open `js/projects-data.js` and copy one of the existing objects in the `PROJECTS` array, then fill in your own values:
   - `slug` — short unique id, used in the URL (e.g. `my-cool-app`)
   - `title`, `blurb` (short, shown on the card), `description` (longer, shown on the detail page)
   - `tags` — array of strings
   - `thumbnail` — path to the card image
   - `links` — buttons on the detail page, e.g. live site / GitHub repo
   - `gallery` — array of photos/videos:
     - `{ type: "image", src: "..." }`
     - `{ type: "video", src: "..." }` for a local video file
     - `{ type: "youtube", id: "VIDEO_ID" }` for an embedded YouTube video
   - `devLog` — array of dated updates: `{ date, title, text, media }` (`media` is optional)
3. Save. The project automatically appears in the grid and gets its own shareable URL (`#project/<your-slug>`) — no other file needs to change.

## Running locally

```
python3 -m http.server
```

Then open `http://localhost:8000`.

## Deploying

Push to `main` — GitHub Pages serves the site automatically at `https://sanaSoo.github.io`.
