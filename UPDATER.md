# Updating the school dashboard

This contract is for the GCA School Grok Bot and any later data updater. The repository is public. It renders a saved school snapshot; browser checkmarks do not submit assignments or establish Canvas submission status.

## Ownership

- The daily updater edits **`data.js` only**.
- Preserve `index.html`, `styles.css`, `app.js`, `model.js`, tests, and the storage keys. Do not regenerate the former single-file page.
- Fetch the current `main` file and base SHA before editing. Reconcile a changed base instead of overwriting another writer.
- Publishing and scheduling remain subject to Jeff’s actual authorization. This document does not create a routine or grant additional authority.

## Exports

`data.js` is a JavaScript module exporting these constants, with plain data and no executable logic:

| Export | Shape |
| --- | --- |
| `SNAPSHOT` | `{ updatedDate: "YYYY-MM-DD", gradesUpdatedDate: "YYYY-MM-DD" }` |
| `COURSES` | Course links keyed by `algebra`, `ela`, `science`, `ss`, `pe`; optional module shortcut keys |
| `GRADES` | Array of `{ name, pct: number or null, teacher, url }` |
| `DUE` | Array of `{ id, title, when, url, dueDate, dueAt, pts? }` |
| `WEEK` | Object keyed by Eastern Time date (`YYYY-MM-DD`), each containing `{ label, full, items: [...] }` |

Each checklist item is `{ id, title, url, subject, detail? }`. Subjects: `algebra`, `ela`, `science`, `ss`, `pe`, `all`. Keep one school week in `WEEK`, including empty days when appropriate. The interface generates the date header and day selection from those keys.

`dueAt` must be a full ISO timestamp with the offset applicable on the due date. Eastern daylight time uses `-04:00`; standard time uses `-05:00`. Keep `when`, `dueDate`, and `dueAt` consistent. Suggested work dates and actual deadlines are separate facts.

## Stable task identity

- Keep an existing task ID unchanged across scans, even if its title, order, or due date changes.
- New assignment IDs should incorporate the Canvas assignment identity, for example `assignment-90612-2168962`. Use the **same ID** in `WEEK` and `DUE` for the same assignment.
- Daily module work needs distinct IDs incorporating its planned date, for example `module-7681178-2026-09-22`. Two days may link to the same module and still represent separate work.
- Never reuse a previous week’s task ID for different work. Never use the URL alone as the ID.
- Existing legacy aliases are already migrated: `due-ss-fair` → `t-ss-fair`, `due-alg-test` → `t-alg-test`, `due-alg-sg` → `t-alg-sg`. Preserve these existing IDs; use canonical IDs for new entries.
- IDs must use letters, digits, hyphens, underscores or colons, beginning with a letter or digit, at most 160 characters. Reserved JavaScript property names are disallowed.

## Evidence and copy

- Read actual Canvas sources. Do not guess deadlines, points, assignment status, grades, estimated duration, or assessment times.
- Advance `SNAPSHOT.updatedDate` only after all displayed plan/deadline sections have been verified. Preserve it on incomplete scans. Record failed coverage separately; do not make old values look freshly verified.
- Advance `gradesUpdatedDate` only after checking grades. Assignment-only updates must retain the previous grade date.
- Use absolute dates in details. Avoid “tonight”, “tomorrow”, or copy that becomes wrong when browsing another day.
- Keep titles short and factual. Avoid warnings about procrastination, motivational filler, artificial urgency, and congratulatory claims about grades/submission.
- Only use HTTPS URLs on `georgiacyber.instructure.com`. The UI falls back to Canvas for an invalid destination.
- Do not add credentials, tokens, private meeting links, disability/accommodation records, or parent meeting details to this public repository. `noindex` is a search-engine request, not access control.

## Validate and deliver

1. Check the current repository head and keep the change limited to `data.js`.
2. Run `node --check data.js` and `npm test` on a current checkout (Node 22+; no package installation required). Regression tests use a fixed fixture; the live-data contract test checks the updated dataset.
3. Review the changed data against the scan, especially stable IDs, dates/offsets and source coverage.
4. If authorized to publish, update `main` using the verified base and read back the resulting public page and update date. A successful commit alone is not a successful Pages deployment.
5. An already-open page retains its loaded data until refreshed. The footer’s **Refresh page** button loads the latest published snapshot. Opening Canvas does not refresh this data automatically. Do not claim cross-device synchronization; local checks remain browser-specific.

## Current scheduling status

On September 20, 2026, GCA School Bot reported zero configured Canvas/dashboard routines. Its original deployment was a manual scan and GitHub MCP update of `index.html` on `main`. The bot confirmed support for future `data.js`-only updates after this redesign is deployed. No routine is installed by this change.
