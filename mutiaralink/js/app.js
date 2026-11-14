/* =========================================================
   MutiaraLink prototype: page behaviour.
   Each page's <body> has a data-page attribute, for example
   <body data-page="notices">. At the bottom of this file we
   check that value and run the matching setup function.
   All data comes from js/data.js, which loads before this file.
   ========================================================= */


/* ---------- Small helpers used by several pages ---------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Find an element by its id (short for document.getElementById)
function byId(id) {
  return document.getElementById(id);
}

// Read a value from the address bar, e.g. notice.html?id=3 -> getParam('id') gives '3'
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Turn '2026-11-02' into '2 Nov 2026'
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return Number(day) + ' ' + MONTHS[Number(month) - 1] + ' ' + year;
}

// Is a notice Active, Upcoming or Completed, compared with DEMO_TODAY?
// (Dates in YYYY-MM-DD format can be compared as plain text.)
function noticeStatus(notice) {
  if (notice.startDate > DEMO_TODAY) return 'Upcoming';
  if (notice.endDate < DEMO_TODAY) return 'Completed';
  return 'Active';
}

// The coloured tags shown on a notice: "Urgent" (if it still matters) and its status
function noticeTags(notice) {
  const status = noticeStatus(notice);
  let html = '';
  if (notice.priority === 'urgent' && status !== 'Completed') {
    html += '<span class="tag urgent">Urgent</span>';
  }
  html += '<span class="tag ' + status.toLowerCase() + '">' + status + '</span>';
  return html;
}

// Which closure number on the map belongs to this notice (or null if none)
function closureForNotice(noticeId) {
  const closure = CLOSURES.find(c => c.noticeId === noticeId);
  return closure ? closure.id : null;
}

// CSS class for each ticket status colour
const TICKET_TAG = {
  'Submitted': 'grey',
  'Under review': 'active',
  'In progress': 'upcoming',
  'Resolved': 'ok'
};


/* =========================================================
   NOTICES PAGE (notices.html): filter, search and sort
   ========================================================= */
function setupNoticesPage() {
  // The current filter choices
  const filters = { area: 'All', status: 'All', type: 'All', search: '' };

  const AREA_OPTIONS = ['All', 'North section', 'Middle section', 'South section'];
  const STATUS_OPTIONS = ['All', 'Active', 'Upcoming', 'Completed'];

  // Draw a row of filter buttons ("chips"); the chosen one is highlighted
  function drawChips(containerId, options, filterName) {
    byId(containerId).innerHTML = options.map(option => {
      const isOn = option === filters[filterName];
      return `<button type="button" class="chip${isOn ? ' on' : ''}" aria-pressed="${isOn}" data-value="${option}">${option}</button>`;
    }).join('');
  }

  // Does a notice pass every filter?
  function matchesFilters(notice) {
    const text = (notice.title + ' ' + notice.roads + ' ' + notice.summary).toLowerCase();
    return (filters.area === 'All' || notice.area === filters.area) &&
      (filters.status === 'All' || noticeStatus(notice) === filters.status) &&
      (filters.type === 'All' || notice.type === filters.type) &&
      text.includes(filters.search.trim().toLowerCase());
  }

  // Sort order: Active first, then Upcoming, then Completed; urgent first within each
  const STATUS_ORDER = { Active: 0, Upcoming: 1, Completed: 2 };
  function compareNotices(a, b) {
    const byStatus = STATUS_ORDER[noticeStatus(a)] - STATUS_ORDER[noticeStatus(b)];
    if (byStatus !== 0) return byStatus;
    const urgentA = a.priority === 'urgent' ? 0 : 1;
    const urgentB = b.priority === 'urgent' ? 0 : 1;
    return urgentA - urgentB;
  }

  // HTML for one notice card
  function noticeCard(notice) {
    const closureId = closureForNotice(notice.id);
    return `
      <article class="card notice-card">
        <div class="tag-row">${noticeTags(notice)}<span class="meta">${notice.type} · ${notice.area}</span></div>
        <h2><a href="notice.html?id=${notice.id}">${notice.title}</a></h2>
        <p class="dates">${formatDate(notice.startDate)} to ${formatDate(notice.endDate)} · ${notice.hours}</p>
        <p>${notice.summary}</p>
        ${notice.detour ? `<p class="detour-line">${notice.detour}</p>` : ''}
        ${closureId ? `<a href="map.html?closure=${closureId}" class="small-link">See it on the closure map</a>` : ''}
      </article>`;
  }

  // Redraw the whole list whenever a filter changes
  function render() {
    drawChips('area-chips', AREA_OPTIONS, 'area');
    drawChips('status-chips', STATUS_OPTIONS, 'status');

    const shown = NOTICES.filter(matchesFilters).sort(compareNotices);
    byId('count').textContent = 'Showing ' + shown.length + ' of ' + NOTICES.length + ' notices';
    byId('list').innerHTML = shown.map(noticeCard).join('');
    byId('empty').hidden = shown.length > 0;
  }

  // Clicking a chip changes that filter
  byId('area-chips').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) { filters.area = button.dataset.value; render(); }
  });
  byId('status-chips').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) { filters.status = button.dataset.value; render(); }
  });
  byId('type').addEventListener('change', event => { filters.type = event.target.value; render(); });
  byId('search').addEventListener('input', event => { filters.search = event.target.value; render(); });

  // "Clear filters" puts everything back to the start
  byId('clear').addEventListener('click', () => {
    filters.area = 'All'; filters.status = 'All'; filters.type = 'All'; filters.search = '';
    byId('type').value = 'All';
    byId('search').value = '';
    render();
  });

  render();
}


/* =========================================================
   NOTICE DETAILS PAGE (notice.html?id=3)
   ========================================================= */
function setupNoticeDetailPage() {
  const id = Number(getParam('id'));
  const notice = NOTICES.find(n => n.id === id);

  // Unknown id: show the "not found" message instead
  if (!notice) {
    byId('not-found').hidden = false;
    return;
  }

  document.title = notice.title + ' | MutiaraLink';
  byId('tags').innerHTML = noticeTags(notice) + '<span class="meta">' + notice.type + '</span>';
  byId('title').textContent = notice.title;
  byId('action').textContent = notice.action;
  byId('details').textContent = notice.details;
  byId('roads').textContent = notice.roads;
  byId('dates').textContent = formatDate(notice.startDate) + ' to ' + formatDate(notice.endDate);
  byId('hours').textContent = notice.hours;
  byId('area').textContent = notice.area;
  byId('updated').textContent = formatDate(notice.updated);

  if (notice.detour) {
    byId('detour').textContent = notice.detour;
    byId('detour').hidden = false;
  }

  // Only closures have a place on the map
  const closureId = closureForNotice(notice.id);
  if (closureId) {
    byId('map-link').href = 'map.html?closure=' + closureId;
  } else {
    byId('map-link').hidden = true;
  }

  byId('notice').hidden = false;
}


/* =========================================================
   CLOSURE MAP PAGE (map.html, or map.html?closure=2)
   ========================================================= */
function setupMapPage() {
  // Start with the closure named in the address bar, otherwise closure 1
  let selectedId = Number(getParam('closure'));
  if (!CLOSURES.some(c => c.id === selectedId)) selectedId = 1;

  // Build the list of closures on the left
  byId('closure-list').innerHTML = CLOSURES.map(c => `
    <button type="button" class="item" data-id="${c.id}">
      <span class="num">${c.id}</span>
      <span class="item-text"><strong>${c.road}</strong><span class="meta">${c.dates}</span></span>
      <span class="tag ${c.statusClass}">${c.status}</span>
    </button>`).join('');

  // Show one closure: fill in the details card and highlight it on the drawing
  function showClosure(id) {
    selectedId = id;
    const closure = CLOSURES.find(c => c.id === id);

    byId('sel-status').className = 'tag ' + closure.statusClass;
    byId('sel-status').textContent = closure.status;
    byId('sel-road').textContent = closure.road;
    byId('sel-when').textContent = closure.when;
    byId('sel-detour').textContent = closure.detour;
    byId('sel-access').textContent = closure.access;
    byId('sel-notice').href = 'notice.html?id=' + closure.noticeId;
    byId('sel-report').href = 'feedback.html?closure=' + closure.id;

    // Highlight the chosen button in the list
    document.querySelectorAll('#closure-list .item').forEach(button => {
      const isOn = Number(button.dataset.id) === id;
      button.classList.toggle('on', isOn);
      button.setAttribute('aria-pressed', isOn);
    });

    // Highlight the chosen closure on the drawing (see .closure.selected in style.css)
    document.querySelectorAll('.closure').forEach(group => {
      group.classList.toggle('selected', Number(group.dataset.id) === id);
    });
  }

  // Clicking a closure in the list or on the drawing selects it
  byId('closure-list').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) showClosure(Number(button.dataset.id));
  });
  document.querySelectorAll('.closure').forEach(group => {
    group.addEventListener('click', () => showClosure(Number(group.dataset.id)));
  });

  showClosure(selectedId);
}


/* =========================================================
   REPORT A PROBLEM PAGE (feedback.html)
   ========================================================= */
function setupFeedbackPage() {
  const form = byId('form');
  const category = byId('category');
  const description = byId('description');

  // Coming from "Report a problem here" on the map (feedback.html?closure=2)?
  // Then fill in the closure for the user.
  const closure = CLOSURES.find(c => c.id === Number(getParam('closure')));
  if (closure) {
    category.value = 'Road closure';
    byId('area').value = closure.area;
    byId('location').value = closure.road;
  }

  // Show the emergency reminder when "Safety" is chosen
  category.addEventListener('change', () => {
    byId('safety-note').hidden = category.value !== 'Safety';
  });

  // Show or hide an error message under a field
  function showError(field, errorId, hasError) {
    byId(errorId).hidden = !hasError;
    field.classList.toggle('invalid', hasError);
  }

  form.addEventListener('submit', event => {
    event.preventDefault();  // stop the page from reloading

    // Check the two required fields
    const noCategory = category.value === '';
    const noDescription = description.value.trim() === '';
    showError(category, 'category-error', noCategory);
    showError(description, 'description-error', noDescription);
    if (noCategory) { category.focus(); return; }
    if (noDescription) { description.focus(); return; }

    // Pass the report to the track page through the address bar,
    // so "Track this ticket" can show what was just sent
    const params = new URLSearchParams({
      tid: NEW_TICKET_ID,
      about: category.value,
      area: byId('area').value,
      where: byId('location').value.trim()
    });
    byId('track-new').href = 'track.html?' + params.toString();

    byId('form-view').hidden = true;
    byId('done-view').hidden = false;
  });

  // "Report another problem" brings back an empty form
  byId('again').addEventListener('click', () => {
    form.reset();
    byId('safety-note').hidden = true;
    byId('done-view').hidden = true;
    byId('form-view').hidden = false;
  });
}


/* =========================================================
   TRACK A TICKET PAGE (track.html, or track.html?tid=MUT-0002)
   ========================================================= */
function setupTrackPage() {
  // Accept "1", "0001", "mut0001" or "MUT-0001" and turn them all into "MUT-0001"
  function cleanTicketNumber(text) {
    let value = text.trim().toUpperCase().replace(/\s/g, '');
    if (/^\d{1,4}$/.test(value)) value = 'MUT-' + value.padStart(4, '0');
    if (/^MUT\d{4}$/.test(value)) value = 'MUT-' + value.slice(3);
    return value;
  }

  // A report sent from feedback.html arrives with its details in the address bar
  function ticketJustSent() {
    if (getParam('tid') !== NEW_TICKET_ID || !getParam('about')) return null;
    return {
      id: NEW_TICKET_ID,
      category: getParam('about'),
      area: getParam('area') || '',
      where: getParam('where') || 'No location given',
      status: 'Submitted',
      dates: ['Today'],
      replies: []
    };
  }

  const CHECK_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

  // The four progress steps: done (filled), now (ring) or next (grey)
  function progressSteps(ticket) {
    const reached = TICKET_STEPS.indexOf(ticket.status);
    return TICKET_STEPS.map((step, i) => {
      let state = 'next';
      if (i < reached || (i === reached && step === 'Resolved')) state = 'done';
      else if (i === reached) state = 'now';

      const date = i <= reached ? ticket.dates[i] : 'Not yet';
      const line = i < TICKET_STEPS.length - 1 ? `<span class="rule${i < reached ? '' : ' off'}"></span>` : '';
      return `
        <li class="step"${i === reached ? ' aria-current="step"' : ''}>
          <div class="line"><span class="dot ${state}">${state === 'done' ? CHECK_ICON : ''}</span>${line}</div>
          <div><strong>${step}</strong><div class="meta">${date}</div></div>
        </li>`;
    }).join('');
  }

  function showTicket() {
    const id = cleanTicketNumber(byId('tid').value);
    if (!id) return;
    byId('tid').value = id;

    const fresh = ticketJustSent();
    const ticket = (fresh && fresh.id === id) ? fresh : TICKETS.find(t => t.id === id);

    // No ticket with that number
    if (!ticket) {
      byId('result').hidden = true;
      byId('not-found-id').textContent = id;
      byId('not-found').hidden = false;
      return;
    }

    byId('not-found').hidden = true;
    byId('r-id').textContent = 'Ticket ' + ticket.id;
    byId('r-status').className = 'tag ' + TICKET_TAG[ticket.status];
    byId('r-status').textContent = ticket.status;
    byId('r-steps').innerHTML = progressSteps(ticket);
    byId('r-about').textContent = ticket.category;
    byId('r-where').textContent = ticket.area ? ticket.where + ', ' + ticket.area : ticket.where;
    byId('r-sent').textContent = ticket.dates[0];

    // Replies use textContent (set below) so nothing typed by users is read as HTML
    const repliesList = byId('r-replies');
    repliesList.innerHTML = '';
    if (ticket.replies.length === 0) {
      repliesList.innerHTML = '<li class="meta">No replies yet. Replies from staff will appear here.</li>';
    }
    ticket.replies.forEach(reply => {
      const item = document.createElement('li');
      item.className = 'reply';
      item.innerHTML = '<div class="reply-from">Contractor team <span class="meta">· ' + reply.date + '</span></div><p></p>';
      item.querySelector('p').textContent = reply.text;
      repliesList.appendChild(item);
    });

    byId('result').hidden = false;
  }

  byId('lookup').addEventListener('submit', event => {
    event.preventDefault();
    showTicket();
  });

  // Coming from the staff dashboard: offer a way back
  if (getParam('from') === 'staff') byId('back-staff').hidden = false;

  // A ticket number in the address bar (from the home page or a link) is looked up straight away
  if (getParam('tid')) {
    byId('tid').value = getParam('tid');
    showTicket();
  }
}


/* =========================================================
   STAFF DASHBOARD PAGE (dashboard.html)
   ========================================================= */
function setupDashboardPage() {
  let statusFilter = 'All';
  const FILTER_OPTIONS = ['All'].concat(TICKET_STEPS);

  function countTickets(status) {
    if (status === 'All') return TICKETS.length;
    return TICKETS.filter(t => t.status === status).length;
  }

  function render() {
    // Filter buttons with a count, e.g. "Submitted (2)"
    byId('status-chips').innerHTML = FILTER_OPTIONS.map(option => {
      const isOn = option === statusFilter;
      return `<button type="button" class="chip${isOn ? ' on' : ''}" aria-pressed="${isOn}" data-value="${option}">${option} (${countTickets(option)})</button>`;
    }).join('');

    // Table rows: each ticket number opens it on the track page
    const shown = TICKETS.filter(t => statusFilter === 'All' || t.status === statusFilter);
    byId('rows').innerHTML = shown.map(t => `
      <tr>
        <td><a href="track.html?tid=${t.id}&from=staff">${t.id}</a></td>
        <td>${t.category}</td>
        <td>${t.area}</td>
        <td><span class="tag ${TICKET_TAG[t.status]}">${t.status}</span></td>
        <td>${t.dates[0]}</td>
      </tr>`).join('');
  }

  byId('status-chips').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button) { statusFilter = button.dataset.value; render(); }
  });

  // Publish a notice (sample only: nothing is saved)
  byId('notice-form').addEventListener('submit', event => {
    event.preventDefault();
    const title = byId('notice-title');
    const noTitle = title.value.trim() === '';
    byId('notice-title-error').hidden = !noTitle;
    title.classList.toggle('invalid', noTitle);
    if (noTitle) { title.focus(); return; }

    byId('published-title').textContent = title.value.trim();
    byId('published-meta').textContent = byId('notice-type').value + ', ' + byId('notice-area').value;
    byId('published').hidden = false;
    event.target.reset();
  });

  render();
}


/* ---------- Run the setup for the current page ---------- */
const page = document.body.dataset.page;
if (page === 'notices') setupNoticesPage();
if (page === 'notice') setupNoticeDetailPage();
if (page === 'map') setupMapPage();
if (page === 'feedback') setupFeedbackPage();
if (page === 'track') setupTrackPage();
if (page === 'dashboard') setupDashboardPage();
