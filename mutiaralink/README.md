# MutiaraLink prototype (merged version)

A clickable demo of the Penang LRT Mutiara Line community information and feedback platform. This version combines the original teal design with the content and features of the team's redesign.

## How to open
1. Unzip the folder.
2. Double-click `index.html` to open it in your browser. It needs no install or server.
3. The internet is only used for the Public Sans font. Offline, the pages use your system font.

## Pages
| File | Page | What you can do |
| --- | --- | --- |
| `index.html` | Home | See what is closed today and its detour, the other closures this month, and check a ticket |
| `notices.html` | Notices | Search, and filter by area, status and type. Active and urgent notices come first |
| `notice.html` | Notice details | Opened from a notice, for example `notice.html?id=1` |
| `map.html` | Closure map | Pick a closure in the list or on the drawing. `map.html?closure=2` opens closure 2 |
| `feedback.html` | Report a problem | Send a report (category and description are required) to get ticket MUT-0006 |
| `track.html` | Track a ticket | Look up MUT-0001 to MUT-0005 (typing `2` also works) |
| `dashboard.html` | Staff dashboard | Filter tickets by status, open a ticket, publish a sample notice |

## Folder
| File | What it holds |
| --- | --- |
| `css/style.css` | All styles, in sections: basics, header, buttons, cards, tags, each page, forms, footer |
| `js/data.js` | **All sample data**: notices, map closures and tickets. Edit this to change the content |
| `js/app.js` | Page behaviour: one `setup...Page()` function per page, run according to `<body data-page="...">` |

## How the code fits together
- Every page loads `js/data.js` first, then `js/app.js`.
- `app.js` reads the page name from `<body data-page="...">` and runs that page's setup function.
- Pages that show one item read it from the address bar, for example `notice.html?id=3`, using `getParam('id')`.
- The demo treats 14 Nov 2026 as "today" (`DEMO_TODAY` in `data.js`), so statuses always match.

## Notes
- Road names are real roads on the Mutiara Line route. Every closure, date, notice and ticket is made up, and every page says so in the top bar. Nothing is saved.
- Not built yet: Business directory, Register / Login.
- The home page text about closures is written in the HTML. If you change closures in `data.js`, update `index.html` too.
