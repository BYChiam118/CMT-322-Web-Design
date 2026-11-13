/* MutiaraLink prototype: notices list and notice details. Uses NOTICES from notices-data.js. */
(function () {
  var page = document.body.getAttribute('data-page');
  function $(sel) { return document.querySelector(sel); }

  var AREAS = ['All', 'Area A', 'Area B', 'Area C'];
  var TYPES = ['Road closure', 'Pedestrian access', 'Construction schedule', 'Business access', 'Public transport'];
  var STATUSES = ['All', 'Active', 'Upcoming', 'Completed'];
  var STATUS_TAG = { Active: 'ok', Upcoming: 'info', Completed: 'grey' };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function today() {
    var d = new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function statusOf(n) {
    var t = today();
    if (n.startDate > t) return 'Upcoming';
    if (n.endDate < t) return 'Completed';
    return 'Active';
  }

  function fmtDate(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1] + ' ' + p[0];
  }

  function dateRange(n) { return fmtDate(n.startDate) + ' to ' + fmtDate(n.endDate); }

  function tags(n) {
    var s = statusOf(n);
    var out = '<span class="tag info">' + esc(n.type) + '</span>' +
      '<span class="tag ' + STATUS_TAG[s] + '">' + s + '</span>';
    if (n.priority === 'urgent') out += '<span class="tag warn">Urgent</span>';
    return out;
  }

  /* ---------- Notices list: filters, counter, cards ---------- */
  function list() {
    var f = { area: 'All', type: 'All', status: 'All', q: '' };

    function chips(el, values, key) {
      el.innerHTML = values.map(function (v) {
        return '<button type="button" class="chip' + (v === f[key] ? ' on' : '') + '" aria-pressed="' + (v === f[key]) + '" data-' + key + '="' + v + '">' + v + '</button>';
      }).join('');
    }

    function sorted(items) {
      return items.slice().sort(function (a, b) {
        if (a.priority !== b.priority) return a.priority === 'urgent' ? -1 : 1;
        return a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0;
      });
    }

    function card(n) {
      return '<article class="card" style="display:flex;flex-direction:column;gap:8px">' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' + tags(n) + '</div>' +
        '<div style="color:#4b5a57;font-size:14px;font-weight:600">' + esc(n.area) + '</div>' +
        '<h2 style="margin:0;font-size:21px"><a href="notice.html?id=' + n.id + '" style="color:inherit;text-decoration:none">' + esc(n.title) + '</a></h2>' +
        '<p style="margin:0;font-weight:600;color:#33504c">' + dateRange(n) + '</p>' +
        '<p style="margin:0;line-height:1.55">' + esc(n.summary) + '</p>' +
        '<div style="margin-top:auto;padding-top:8px;display:flex;flex-wrap:wrap;gap:8px 20px">' +
        '<a href="notice.html?id=' + n.id + '" style="font-weight:600">Read more</a>' +
        '<a href="map.html" style="font-weight:600">View on map</a></div></article>';
    }

    function render() {
      chips($('#chips'), AREAS, 'area');
      chips($('#status-chips'), STATUSES, 'status');
      $('#type').value = f.type;
      $('#q').value = f.q;
      var q = f.q.trim().toLowerCase();
      var items = NOTICES.filter(function (n) {
        return (f.area === 'All' || n.area === f.area) &&
          (f.type === 'All' || n.type === f.type) &&
          (f.status === 'All' || statusOf(n) === f.status) &&
          (!q || n.title.toLowerCase().indexOf(q) > -1 || n.roads.toLowerCase().indexOf(q) > -1);
      });
      items = sorted(items);
      $('#count').textContent = 'Showing ' + items.length + (items.length === 1 ? ' notice' : ' notices');
      $('#empty').hidden = items.length > 0;
      $('#list').innerHTML = items.map(card).join('');
    }

    $('#type').innerHTML = '<option value="All">All types</option>' + TYPES.map(function (t) {
      return '<option>' + t + '</option>';
    }).join('');

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
    function clear() { f = { area: 'All', type: 'All', status: 'All', q: '' }; render(); }
    $('#clear').addEventListener('click', clear);
    $('#clear-empty').addEventListener('click', clear);
    render();
  }

  /* ---------- Notice details: read ?id=N ---------- */
  function detail() {
    var id = parseInt(new URLSearchParams(location.search).get('id'), 10);
    var n = NOTICES.filter(function (x) { return x.id === id; })[0];
    if (!n) {
      document.title = 'Notice not found';
      $('#notfound').hidden = false;
      $('#notice').hidden = true;
      return;
    }
    document.title = n.title;
    $('#crumb').textContent = n.title;
    $('#tags').innerHTML = tags(n);
    $('#title').textContent = n.title;
    $('#f-area').textContent = n.area;
    $('#f-roads').textContent = n.roads;
    $('#f-dates').textContent = dateRange(n);
    $('#f-hours').textContent = n.hours;
    $('#f-updated').textContent = fmtDate(n.updated);
    $('#details').textContent = n.details;
    $('#action').textContent = n.action;
    $('#notfound').hidden = true;
    $('#notice').hidden = false;
  }

  if (page === 'notices') list();
  if (page === 'notice') detail();
})();
