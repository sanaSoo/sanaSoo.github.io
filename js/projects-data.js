// ---------------------------------------------------------------------------
// PROJECTS DATA
// This is the only file you need to edit to add, remove, or update projects.
//
// To add a project:
//   1. Copy one of the objects below and fill in your own values.
//   2. Drop images into   assets/images/projects/<slug>/
//      and videos into    assets/videos/projects/<slug>/
//   3. Reference those file paths in `thumbnail` and `gallery` below.
//   4. Save — the site picks it up automatically, no other code changes needed.
//
// Gallery item types:
//   { type: "image",   src: "path/to/image.jpg" }
//   { type: "video",   src: "path/to/video.mp4" }      -> local video file
//   { type: "youtube", id: "YOUTUBE_VIDEO_ID" }         -> embedded YouTube video
//
// Dev log entries (optional, shown newest-first is up to your ordering below):
//   { date: "YYYY-MM-DD", title: "...", text: "...", media: "path/to/image-or-video.jpg" (optional) }
// ---------------------------------------------------------------------------

const PROJECTS = [
  {
    slug: "sample-project",
    title: "Sample Project",
    thumbnail: "assets/images/projects/sample-project/cover.svg",
    tags: ["HTML", "CSS", "JavaScript"],
    blurb: "A short one-line summary of the project shown on the card.",
    description:
      "A longer description of the project shown on the detail page. Explain the problem, your approach, and what you learned.",
    links: [
      { label: "Live Site", url: "#" },
      { label: "GitHub Repo", url: "#" }
    ],
    gallery: [
      { type: "image", src: "assets/images/projects/sample-project/cover.svg" }
      // { type: "video", src: "assets/videos/projects/sample-project/demo.mp4" },
      // { type: "youtube", id: "dQw4w9WgXcQ" },
    ],
    devLog: [
      {
        date: "2026-07-01",
        title: "Project kickoff",
        text: "Describe what you did in this update. You can add as many dev log entries as you like.",
        media: "" // optional path to an image/video for this entry
      }
    ]
  },

  // Add more project objects here, separated by commas.
  {
    slug: "sample-project",
    title: "Sample Project",
    thumbnail: "assets/images/projects/sample-project/cover.svg",
    tags: ["HTML", "CSS", "JavaScript"],
    blurb: "A short one-line summary of the project shown on the card.",
    description:
      "A longer description of the project shown on the detail page. Explain the problem, your approach, and what you learned.",
    links: [
      { label: "Live Site", url: "#" },
      { label: "GitHub Repo", url: "#" }
    ],
    gallery: [
      { type: "image", src: "assets/images/projects/sample-project/cover.svg" }
      // { type: "video", src: "assets/videos/projects/sample-project/demo.mp4" },
      // { type: "youtube", id: "dQw4w9WgXcQ" },
    ],
    devLog: [
      {
        date: "2026-07-01",
        title: "Project kickoff",
        text: "Describe what you did in this update. You can add as many dev log entries as you like.",
        media: "" // optional path to an image/video for this entry
      }
    ]
  }
];
