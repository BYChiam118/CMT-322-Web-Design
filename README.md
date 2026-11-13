# MutiaraLink prototype

A clickable demo of the Penang LRT Mutiara Line community information and feedback platform, made to show the team the planned pages and flow.

## How to open
1. Unzip the folder.
2. Double-click `index.html`. It opens in your browser; no install, server or internet connection needed.

## Pages
| File | Page | What works |
| --- | --- | --- |
| `index.html` | Home | What is closed today and the detour, this month's other closures on the route drawing, ticket check |
| `notices.html` | Notices | Filter by area, type, status and search; urgent first |
| `notice.html` | Notice details | Open from a notice, e.g. `notice.html?id=1`; an unknown id shows "Notice not found" |
| `map.html` | Closure map | Pick a closure to see its dates and detour on the drawing; `map.html?closure=2` opens one directly |
| `feedback.html` | Report a problem | Sending the form shows a ticket number |
| `track.html` | Track a ticket | Look up `MUT-0001` to `MUT-0005` (also accepts `1` or `0001`) |
| `dashboard.html` | Staff dashboard | Filter tickets by status, open a ticket, publish a notice |

## Folder
- `css/style.css`: shared styles
- `fonts/`: Atkinson Hyperlegible Next and Mono (woff2, SIL Open Font License in `fonts/OFL.txt`)
- `js/app.js`: closure map, feedback, ticket tracking and dashboard, with the ticket data
- `js/notices-data.js`: shared notices (`NOTICES`)
- `js/notices.js`: notices list filters and notice details page

## Notes
- Road names are real roads on the Mutiara Line route. Closures, dates, notices and tickets are made up for the demo. Nothing is saved.
- Not built yet: Business directory, Register / Login.
