/* MutiaraLink prototype: page behaviour. Tickets, dates and replies below are made up for the prototype. */
(function () {
  var page = document.body.getAttribute('data-page');
  function $(sel) { return document.querySelector(sel); }

  var pages = {};

  /* ---------- Feedback tickets (used by track and dashboard) ---------- */
  var STEPS = ['Submitted', 'Under review', 'In progress', 'Resolved'];
  var MARK = { 'Submitted': 's-submitted', 'Under review': 's-review', 'In progress': 's-progress', 'Resolved': 's-resolved' };
  // dates[i] is when the ticket reached STEPS[i]; replies are newest first
  // newest first; numbers follow the date sent
  var TICKETS = [
    { id: 'MUT-0005', category: 'Safety', area: 'North section', where: 'Jalan Magazine, outside the market', status: 'Submitted',
      dates: ['24 Oct'], replies: [] },
    { id: 'MUT-0004', category: 'Business access', area: 'North section', where: 'Gat Lebuh Cecil, rear lane', status: 'Under review',
      dates: ['23 Oct', '24 Oct'], replies: [['24 Oct', 'Thank you. We are checking the signs to the rear lane with the site team.']] },
    { id: 'MUT-0003', category: 'Pedestrian access', area: 'Middle section', where: 'Jalan Tengah, near the bus stop', status: 'Submitted',
      dates: ['22 Oct'], replies: [] },
    { id: 'MUT-0002', category: 'Noise or dust', area: 'South section', where: 'Jalan Kampung Relau', status: 'In progress',
      dates: ['20 Oct', '21 Oct', '22 Oct'], replies: [['22 Oct', 'Water spraying will start on the next night shift. We will update this ticket when it is done.'], ['21 Oct', 'Thank you. We have passed this to the site supervisor.']] },
    { id: 'MUT-0001', category: 'Road closure', area: 'Middle section', where: 'Jalan Sultan Azlan Shah', status: 'Resolved',
      dates: ['18 Oct', '18 Oct', '19 Oct', '21 Oct'], replies: [['21 Oct', 'The missing detour sign has been put back at the Jalan Tengah junction.'], ['18 Oct', 'Thank you. We will check the detour signs today.']] }
  ];
  var NEW_TICKET = 'MUT-0006';  // the number a report sent from feedback.html receives
  function query(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  function findTicket(id) { return TICKETS.filter(function (t) { return t.id === id; })[0]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Closure map: select a closure ---------- */
  // id matches the numbered mark on the drawing; notice is the id in notices-data.js
  var CLOSURES = [
      { id: 1, notice: 1, area: 'Middle section', road: 'Jalan Sultan Azlan Shah', detourRoad: 't-tengah', roadLabel: 't-jsas', view: '40 262 380 186',
        dates: '2 Nov to 20 Nov', status: ['s-active', 'Closed now'],
        when: 'Closed eastbound, all day, 2 Nov to 20 Nov. Westbound stays open.',
        detour: 'Detour: use Jalan Tengah. Allow about 10 extra minutes.',
        how: 'Buses heading east stop one block earlier, at the Jalan Tengah junction. Homes and shops can be reached on foot at all times.' },
      { id: 2, notice: 7, area: 'North section', road: 'Jalan Magazine slip road', detourRoad: 't-glc', roadLabel: 't-mag', view: '40 28 380 166',
        dates: 'Weekends, 14 Nov to 29 Nov', status: ['s-active', 'Closed this weekend'],
        when: 'Closed on Saturdays and Sundays, 7am to 7pm, 14 Nov to 29 Nov.',
        detour: 'Detour: use Gat Lebuh Cecil.',
        how: 'The slip road reopens every weekday. Pedestrians can still use the footpath on the far side.' },
      { id: 3, notice: 6, area: 'South section', road: 'Jalan Tun Dr Awang', detourRoad: 't-relau', roadLabel: 't-tda', view: '40 492 380 150',
        dates: '16 Nov to 27 Nov', status: ['s-upcoming', 'Starts 16 Nov'],
        when: 'Closed to through traffic all day, 16 Nov to 27 Nov.',
        detour: 'Detour: use Jalan Kampung Relau.',
        how: 'Residents and deliveries can still enter from the Jalan Kampung Relau end. Emergency vehicles have access at all times.' }
  ];
  function closureFromUrl() {
    var q = /[?&]closure=(\d+)/.exec(location.search);
    var id = q ? parseInt(q[1], 10) : 0;
    return CLOSURES.filter(function (c) { return c.id === id; })[0];
  }

  pages.map = function () {
    var closures = CLOSURES;
    function tri(n) {
      return '<svg class="tri" viewBox="0 0 36 32" aria-hidden="true"><path d="M18 2L34 30H2z"/><text x="18" y="26" text-anchor="middle">' + n + '</text></svg>';
    }
    var start = closureFromUrl();
    var sel = start ? start.id : 1;

    $('#closures').innerHTML = closures.map(function (c) {
      return '<li><button type="button" class="pick" aria-current="false" data-id="' + c.id + '">' + tri(c.id) +
        '<strong>' + c.road + '</strong><span>' + c.dates + '</span>' +
        '<span class="status ' + c.status[0] + '">' + c.status[1] + '</span></button></li>';
    }).join('');

    function render(announce) {
      var cur = closures.filter(function (c) { return c.id === sel; })[0];
      var picks = document.querySelectorAll('.pick');
      for (var i = 0; i < picks.length; i++) {
        picks[i].setAttribute('aria-current', String(parseInt(picks[i].getAttribute('data-id'), 10) === sel));
      }
      $('#sel-status').className = 'status ' + cur.status[0];
      $('#sel-status').textContent = cur.status[1];
      $('#sel-road').textContent = cur.road;
      $('#sel-when').textContent = cur.when;
      $('#sel-detour').textContent = cur.detour;
      $('#sel-how').textContent = cur.how;
      $('#sel-link').setAttribute('href', 'notice.html?id=' + cur.notice);
      $('#sel-report').setAttribute('href', 'feedback.html?closure=' + cur.id);
      $('#inset').setAttribute('viewBox', cur.view);
      closures.forEach(function (c) {
        var g = $('#dwg-' + c.id), on = c.id === sel;
        g.classList.toggle('is-selected', on);
        g.classList.toggle('is-dim', !on);
        $('#' + c.roadLabel).classList.toggle('lbl-closed', on);
        $('#' + c.detourRoad).classList.toggle('lbl-detour', on);
      });
      if (announce) {
        $('#sel-announce').textContent = 'Showing ' + cur.id + ': ' + cur.road + '. ' + cur.status[1] + '. ' + cur.detour;
        if (window.history && history.replaceState) {
          try { history.replaceState(null, '', '?closure=' + cur.id); } catch (err) { /* some browsers block this on file:// */ }
        }
      }
    }
    function pick(id) { sel = id; render(true); }
    $('#closures').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-id]');
      if (b) pick(parseInt(b.getAttribute('data-id'), 10));
    });
    // the drawing is a picker too
    closures.forEach(function (c) {
      var g = $('#dwg-' + c.id);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', 'Show closure ' + c.id + ', ' + c.road);
      g.addEventListener('click', function () { pick(c.id); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(c.id); }
      });
    });
    render(false);
  };

  /* ---------- Feedback: submit and confirmation ---------- */
  pages.feedback = function () {
    var desc = $('#desc'), err = $('#desc-err');
    function valid() {
      var ok = desc.value.trim().length > 0;
      err.hidden = ok;
      setInvalid(desc, ok ? null : 'desc-err');
      return ok;
    }
    desc.addEventListener('input', function () { if (!err.hidden) valid(); });
    var cat = $('#cat'), catErr = $('#cat-err');
    function catValid() {
      var ok = cat.value !== '';
      catErr.hidden = ok;
      setInvalid(cat, ok ? null : 'cat-err');
      return ok;
    }
    cat.addEventListener('change', function () {
      if (!catErr.hidden) catValid();
      $('#safety-note').hidden = cat.value !== 'Safety';
    });
    $('#photo').addEventListener('change', function () {
      $('#photo-name').textContent = this.files && this.files.length ? this.files[0].name : 'No photo chosen';
      $('#photo-btn').textContent = this.files && this.files.length ? 'Choose a different photo' : 'Choose a photo';
    });
    // "Report a problem here" on the closure map passes ?closure=N
    var from = closureFromUrl();
    if (from) {
      cat.value = 'Road closure';
      $('#area').value = from.area;
      $('#loc').value = from.road;
    }
    $('#form').addEventListener('submit', function (e) {
      e.preventDefault();
      var okCat = catValid(), okDesc = valid();
      if (!okCat) { cat.focus(); return; }
      if (!okDesc) { desc.focus(); return; }
      var where = $('#loc').value.trim();
      $('#track-new').setAttribute('href', 'track.html?tid=' + NEW_TICKET + '&about=' + encodeURIComponent(cat.value) +
        (where ? '&where=' + encodeURIComponent(where) : '') + ($('#area').value ? '&area=' + encodeURIComponent($('#area').value) : ''));
      $('#form-view').hidden = true;
      $('#done-view').hidden = false;
      $('#done-h').focus();
    });
    $('#again').addEventListener('click', function () {
      $('#form').reset();
      $('#photo-name').textContent = 'No photo chosen';
      $('#photo-btn').textContent = 'Choose a photo';
      $('#safety-note').hidden = true;
      $('#done-view').hidden = true;
      $('#form-view').hidden = false;
      cat.focus();
    });
  };
  // point aria-describedby at an error only while it is shown
  function setInvalid(el, errId) {
    var base = (el.getAttribute('data-describedby') || '').trim();
    if (errId) {
      el.setAttribute('aria-invalid', 'true');
      el.setAttribute('aria-describedby', (base + ' ' + errId).trim());
    } else {
      el.removeAttribute('aria-invalid');
      if (base) { el.setAttribute('aria-describedby', base); } else { el.removeAttribute('aria-describedby'); }
    }
  }

  /* ---------- Track ticket: look up a ticket number ---------- */
  pages.track = function () {
    function normalise(v) {
      v = v.trim().toUpperCase().replace(/\s+/g, '');
      if (/^\d{1,4}$/.test(v)) v = 'MUT-' + ('0000' + v).slice(-4);  // "1" or "0001" -> MUT-0001
      if (/^MUT\d{4}$/.test(v)) v = 'MUT-' + v.slice(3);
      return v;
    }
    // a report just sent from feedback.html arrives as ?tid=MUT-0006&about=...&where=...
    var about = query('about');
    var fresh = about && query('tid') === NEW_TICKET ? {
      id: NEW_TICKET, category: about, area: query('area') || '',
      where: query('where') || 'No location given', status: 'Submitted', dates: ['Today'], replies: []
    } : null;
    function check() {
      var id = normalise($('#tid').value);
      if (!id) { $('#result').hidden = true; $('#notfound').hidden = true; return; }
      $('#tid').value = id;
      var t = fresh && id === fresh.id ? fresh : findTicket(id);
      $('#result').hidden = !t;
      $('#notfound').hidden = !!t;
      if (!t) { $('#nf-id').textContent = id; $('#announce').textContent = 'No ticket with the number ' + id + '.'; return; }
      $('#announce').textContent = 'Ticket ' + t.id + ': ' + t.status + '.';
      var reached = STEPS.indexOf(t.status);
      $('#r-id').textContent = t.id;
      $('#r-status').className = 'status ' + MARK[t.status];
      $('#r-status').textContent = t.status;
      $('#r-steps').innerHTML = STEPS.map(function (s, i) {
        var cls = i < reached || (i === reached && s === 'Resolved') ? 'done' : i === reached ? 'now' : 'next';
        var when = i < reached ? t.dates[i] : i === reached ? (s === 'Resolved' ? t.dates[i] : 'Since ' + t.dates[i]) : 'Not yet';
        return '<li class="' + cls + '"' + (i === reached ? ' aria-current="step"' : '') + '><strong>' + s + '</strong><span>' + when + '</span></li>';
      }).join('');
      $('#r-replies').innerHTML = t.replies.length ? t.replies.map(function (r) {
        return '<li><p class="meta">Contractor team, ' + r[0] + '</p><p>' + esc(r[1]) + '</p></li>';
      }).join('') : '<li><p>No replies yet. Replies from staff will appear here.</p></li>';
      $('#r-about').textContent = t.category;
      $('#r-where').textContent = t.area ? t.where + ', ' + t.area : t.where;
      $('#r-sent').textContent = t.dates[0];
    }
    $('#lookup').addEventListener('submit', function (e) { e.preventDefault(); check(); });
    if (query('from') === 'staff') $('#back-staff').hidden = false;
    var tid = query('tid');
    if (tid) { $('#tid').value = tid; check(); }
  };

  /* ---------- Staff dashboard: filter tickets, publish notice ---------- */
  pages.dashboard = function () {
    var status = 'All';
    var tickets = TICKETS;
    function count(s) { return tickets.filter(function (t) { return t.status === s; }).length; }
    // chips are built once; filtering only updates aria-pressed, so keyboard focus stays put
    var labels = ['All', 'Submitted', 'Under review', 'In progress', 'Resolved'];
    $('#chips').innerHTML = labels.map(function (l) {
      var n = l === 'All' ? tickets.length : count(l);
      return '<button type="button" class="chip" aria-pressed="false" data-status="' + l + '">' + l + ' (' + n + ')</button>';
    }).join('');
    function render() {
      var chips = document.querySelectorAll('#chips .chip');
      for (var i = 0; i < chips.length; i++) chips[i].setAttribute('aria-pressed', String(chips[i].getAttribute('data-status') === status));
      var shown = tickets.filter(function (t) { return status === 'All' || t.status === status; });
      $('#tcount').textContent = (status === 'All' ? 'All tickets' : status) + ': ' + shown.length + ', newest first';
      $('#rows').innerHTML = shown.map(function (t) {
        return '<tr><td data-label="Ticket"><a class="mono" href="track.html?tid=' + t.id + '&amp;from=staff">' + t.id + '</a></td>' +
          '<td data-label="About">' + t.category + '</td><td data-label="Part of route">' + t.area + '</td>' +
          '<td data-label="Status"><span class="status ' + MARK[t.status] + '">' + t.status + '</span></td><td data-label="Sent">' + t.dates[0] + '</td></tr>';
      }).join('');
    }
    $('#chips').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-status]');
      if (b) { status = b.getAttribute('data-status'); render(); }
    });
    var nt = $('#nt'), ntErr = $('#nt-err');
    nt.addEventListener('input', function () { if (!ntErr.hidden && nt.value.trim()) { ntErr.hidden = true; setInvalid(nt, null); } });
    $('#notice-form').addEventListener('input', function () { $('#done').hidden = true; });
    $('#notice-form').addEventListener('submit', function (e) {
      e.preventDefault();
      $('#done').hidden = true;
      var ok = nt.value.trim().length > 0;
      ntErr.hidden = ok;
      setInvalid(nt, ok ? null : 'nt-err');
      if (!ok) { nt.focus(); return; }
      var dates = [$('#ns').value.trim(), $('#ne').value.trim()].filter(Boolean).join(' to ');
      $('#pub-title').textContent = nt.value.trim();
      $('#pub-meta').textContent = $('#ny').value + ', ' + $('#na').value + (dates ? '. ' + dates : '');
      $('#done').hidden = false;
      $('#done').focus();
      this.reset();
    });
    render();
  };

  if (pages[page]) pages[page]();
})();
