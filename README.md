# School day

A dark weekly school planner: one checklist, the next unfinished task, due dates, and quick Canvas links. Built with plain HTML, CSS, and JavaScript. No build step, third-party fonts, analytics, or runtime packages.

## Preview and verify

```sh
npm start
# Open http://127.0.0.1:4173/
npm test
```

Python 3 serves the preview on loopback only; Node 22+ runs the tests. The page uses JavaScript modules and should be served over HTTP rather than opened as a file.

## Files

- `data.js`: the only file a daily school-data updater should change; see [UPDATER.md](UPDATER.md).
- `index.html`, `styles.css`: page structure and dark responsive design.
- `app.js`, `model.js`: interactions, Eastern Time dates, and per-task local completion state.
- `tests/`: regression fixtures and live-data contract checks.

Existing v4 checkmarks migrate automatically on the same site origin. Current checks use task-specific localStorage entries to avoid independent tabs overwriting each other. Browser/device storage remains independent of Canvas and other devices. Reset affects only the selected day and offers Undo.

The repository and GitHub Pages site are public. Hiding grades behind a disclosure or adding `noindex` does not make the data private. Parent meeting information has been removed from the redesigned assets; prior commits and the previously deployed page are separate records.

GitHub Pages currently serves `main` at the repository root. A push to `main` also matches the existing Pages workflow. Review and deployment authorization are required before merging a design change into that branch. The data-update guide does not establish a daily schedule.
