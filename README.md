# MutiaraLink prototype

A clickable demo of the Penang LRT Mutiara Line community information and feedback platform, made to show the team the planned pages and flow.

## How to open
1. Unzip the folder.
2. Double-click `index.html`. It opens in your browser; no install or server needed.
3. An internet connection is only used to load the Public Sans font. Without it, the pages fall back to your system font.

## Pages
| File | Page | What works |
| --- | --- | --- |
| `index.html` | Home | Links to every page |
| `notices.html` | Notices | Filter by area, type, status and search; sorted urgent first |
| `notice.html` | Notice details | Open from a notice card, e.g. `notice.html?id=1`; unknown id shows "Notice not found" |
| `map.html` | Closure map | Pick a closure to see its detour |
| `feedback.html` | Submit feedback | Submit shows a sample ticket number |
| `track.html` | Track ticket | Look up `MUT-0001` |
| `dashboard.html` | Staff dashboard | Filter tickets by status, publish a sample notice |

## Folder
- `css/style.css`: shared styles
- `js/app.js`: page behaviour and sample data for map, feedback, track and dashboard
- `js/notices-data.js`: shared sample notices (`NOTICES`)
- `js/notices.js`: notices list filters and notice details page

## Notes
- All roads, dates and tickets are sample data. Nothing is saved.
- Not built yet: Business directory, Register / Login.
