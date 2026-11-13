/* MutiaraLink: notices list and notice details. Uses NOTICES, AREAS and DEMO_TODAY from notices-data.js. */
(function () {
  var page = document.body.getAttribute('data-page');
  function $(sel) { return document.querySelector(sel); }

  var AREA_VALUES = ['All'].concat(AREAS.map(function (a) { return a.value; }));
  var TYPES = ['Road closure', 'Pedestrian access', 'Construction schedule', 'Business access', 'Public transport'];
  var STATUSES = ['All', 'Active', 'Upcoming', 'Completed'];
  var STATUS_MARK = { Active: 's-active', Upcoming: 's-upcoming', Completed: 's-completed' };
  var STATUS_RANK = { Active: 0, Upcoming: 1, Completed: 2 };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // notices that are closures on the closure map: notice id -> numbered mark on the drawing
  var ON_MAP = { 1: 1, 7: 2, 6: 3 };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function statusOf(n) {
    if (n.startDate > DEMO_TODAY) return 'Upcoming';
    if (n.endDate < DEMO_TODAY) return 'Completed';
    return 'Active';
  }

  function fmtDate(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function dateRange(n) { return fmtDate(n.startDate) + ' to ' + fmtDate(n.endDate); }

  function tri(n) {
    return '<svg class="tri tri-sm" viewBox="0 0 36 32" aria-hidden="true"><path d="M18 2L34 30H2z"/><text x="18" y="26" text-anchor="middle">' + n + '</text></svg>';
  }

  function tags(n) {
    var s = statusOf(n);
    var out = '';
    if (n.priority === 'urgent' && s !== 'Completed') out += '<span class="status s-urgent">Urgent</span>';
    out += '<span class="status ' + STATUS_MARK[s] + '">' + s + '</span>';
    return out;
  }

  function mapLink(n) {
    var m = ON_MAP[n.id];
    return m ? '<a class="map-link" href="map.html?closure=' + m + '">' + tri(m) + 'See closure ' + m + ' on the map</a>' : '';
  }

  /* ---------- Notices list: filters, counter, rows ---------- */
  function list() {
    var DEFAULT = { area: 'All', type: 'All', status: 'All', q: '' };
    var f = readHash();

    function readHash() {
      var out = { area: 'All', type: 'All', status: 'All', q: '' };
      location.hash.replace(/^#/, '').split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (p.length === 2 && out.hasOwnProperty(p[0])) out[p[0]] = decodeURIComponent(p[1]);
      });
      if (AREA_VALUES.indexOf(out.area) < 0) out.area = 'All';
      if (STATUSES.indexOf(out.status) < 0) out.status = 'All';
      if (out.type !== 'All' && TYPES.indexOf(out.type) < 0) out.type = 'All';
      return out;
    }
    function writeHash() {
      var parts = [];
      for (var k in f) { if (f[k] !== DEFAULT[k]) parts.push(k + '=' + encodeURIComponent(f[k])); }
      try { history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname + location.search); } catch (e) { /* file:// in some browsers */ }
    }
    function isDefault() { return f.area === 'All' && f.type === 'All' && f.status === 'All' && !f.q.trim(); }

    function chips(el, values, key, label) {
      el.innerHTML = values.map(function (v) {
        return '<button type="button" class="chip" aria-pressed="' + (v === f[key]) + '" data-' + key + '="' + esc(v) + '">' + (label ? label(v) : esc(v)) + '</button>';
      }).join('');
    }
    function areaLabel(v) {
      if (v === 'All') return 'All';
      var a = AREAS.filter(function (x) { return x.value === v; })[0];
      return esc(v) + '<span class="chip-sub">' + esc(a.roads) + '</span>';
    }

    function sorted(items) {
      return items.slice().sort(function (a, b) {
        var sa = STATUS_RANK[statusOf(a)], sb = STATUS_RANK[statusOf(b)];
        if (sa !== sb) return sa - sb;
        var ua = a.priority === 'urgent' ? 0 : 1, ub = b.priority === 'urgent' ? 0 : 1;
        if (ua !== ub) return ua - ub;
        return a.endDate < b.endDate ? -1 : a.endDate > b.endDate ? 1 : 0;
      });
    }

    function card(n) {
      var link = mapLink(n);
      return '<li class="notice-row">' +
        '<div class="when"><strong>' + fmtDate(n.startDate) + '<br>to ' + fmtDate(n.endDate) + '</strong><span class="meta">' + esc(n.hours) + '</span></div>' +
        '<div class="body">' +
        '<h2><a href="notice.html?id=' + n.id + '">' + esc(n.title) + '</a></h2>' +
        '<div class="marks-row">' + tags(n) + '<span class="meta">' + esc(n.type) + ', ' + esc(n.area) + '</span></div>' +
        '<p>' + esc(n.summary) + '</p>' +
        (n.detour ? '<p class="via">' + esc(n.detour) + '</p>' : '') +
        (link ? '<p class="links">' + link + '</p>' : '') +
        '</div></li>';
    }

    function render() {
      chips($('#chips'), AREA_VALUES, 'area', areaLabel);
      chips($('#status-chips'), STATUSES, 'status');
      $('#type').value = f.type;
      if ($('#q').value !== f.q) $('#q').value = f.q;
      var q = f.q.trim().toLowerCase();
      var items = NOTICES.filter(function (n) {
        return (f.area === 'All' || n.area === f.area) &&
          (f.type === 'All' || n.type === f.type) &&
          (f.status === 'All' || statusOf(n) === f.status) &&
          (!q || [n.title, n.roads, n.summary, n.details, n.detour || ''].join(' ').toLowerCase().indexOf(q) > -1);
      });
      items = sorted(items);
      var noun = items.length === 1 ? ' notice' : ' notices';
      $('#count').textContent = isDefault() ? 'Showing all ' + items.length + noun : 'Showing ' + items.length + ' of ' + NOTICES.length + noun;
      $('#empty').hidden = items.length > 0;
      $('#list').hidden = items.length === 0;
      $('#clear').hidden = isDefault();
      $('#filter-count').textContent = activeCount() ? ' (' + activeCount() + ' on)' : '';
      $('#list').innerHTML = items.map(card).join('');
      writeHash();
    }
    function activeCount() {
      return (f.area !== 'All' ? 1 : 0) + (f.type !== 'All' ? 1 : 0) + (f.status !== 'All' ? 1 : 0);
    }

    $('#type').innerHTML = '<option value="All">All types</option>' + TYPES.map(function (t) {
      return '<option>' + t + '</option>';
    }).join('');

    // On small screens the filters start folded so the notices are in view
    var more = $('#filter-more');
    if (window.matchMedia && window.matchMedia('(max-width: 700px)').matches && !activeCount()) more.removeAttribute('open');

    $('#chips').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-area]');
      if (b) { f.area = b.getAttribute('data-area'); render(); }
    });
    $('#status-chips').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-status]');
      if (b) { f.status = b.getAttribute('data-status'); render(); }
    });
    $('#type').addEventListener('change', function () { f.type = this.value; render(); });
    $('#q').addEventListener('input', function () { f.q = this.value; render(); });
    $('#filters').addEventListener('submit', function (e) { e.preventDefault(); });
    function clear() { f = { area: 'All', type: 'All', status: 'All', q: '' }; render(); $('#q').focus(); }
    $('#clear').addEventListener('click', clear);
    $('#clear-empty').addEventListener('click', clear);
    render();
  }

  /* ---------- Notice details: read ?id=N ---------- */
  function detail() {
    var m = /[?&]id=(\d+)(?:&|$)/.exec(location.search);
    var id = m ? parseInt(m[1], 10) : NaN;
    var n = NOTICES.filter(function (x) { return x.id === id; })[0];
    if (!n) {
      document.title = 'Notice not found: MutiaraLink';
      $('#notfound').hidden = false;
      $('#notice').hidden = true;
      return;
    }
    document.title = n.title + ': MutiaraLink';
    $('#tags').innerHTML = tags(n) + '<span class="meta">' + esc(n.type) + '</span>';
    $('#title').textContent = n.title;
    $('#f-area').textContent = n.area;
    $('#f-roads').textContent = n.roads;
    $('#f-dates').textContent = dateRange(n);
    $('#f-hours').textContent = n.hours;
    $('#f-updated').textContent = fmtDate(n.updated);
    $('#details').textContent = n.details;
    $('#action').textContent = n.action;
    if (n.detour) { $('#via').textContent = n.detour; $('#via').hidden = false; }
    if (ON_MAP[n.id]) {
      $('#map-link').setAttribute('href', 'map.html?closure=' + ON_MAP[n.id]);
      $('#map-link').textContent = 'See closure ' + ON_MAP[n.id] + ' on the map';
    } else {
      $('#map-link').hidden = true;
    }
    $('#notfound').hidden = true;
    $('#notice').hidden = false;
  }

  if (page === 'notices') list();
  if (page === 'notice') detail();
})();
