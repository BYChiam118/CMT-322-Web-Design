/* MutiaraLink prototype: page behaviour. All data below is sample data. */
(function () {
  var page = document.body.getAttribute('data-page');
  function $(sel) { return document.querySelector(sel); }

  var pages = {};

  /* ---------- Closure map: select a closure ---------- */
  pages.map = function () {
    var closures = [
      { id: 1, name: 'Jalan Contoh 1', area: 'Area A', dates: '2 Nov to 13 Nov', detour: 'Turn onto the side street, continue along Jalan Contoh 2, then rejoin Jalan Contoh 1.' },
      { id: 2, name: 'Jalan Contoh 3', area: 'Area B', dates: '9 Nov to 20 Nov', detour: 'Use Jalan Contoh 4, which runs parallel to the closed section.' },
      { id: 3, name: 'Jalan Contoh 5', area: 'Area C', dates: '16 Nov to 27 Nov', detour: 'Use Lorong Contoh. Local access to shops stays open.' }
    ];
    var sel = 1;
    function render() {
      $('#closures').innerHTML = closures.map(function (c) {
        return '<button class="item' + (c.id === sel ? ' on' : '') + '" aria-pressed="' + (c.id === sel) + '" data-id="' + c.id + '">' +
          '<strong>' + c.name + '</strong><span style="color:#4b5a57;font-size:14px">' + c.area + ' · ' + c.dates + '</span></button>';
      }).join('');
      var cur = closures.filter(function (c) { return c.id === sel; })[0];
      $('#sel-name').textContent = cur.name;
      $('#sel-meta').textContent = cur.area + ' · ' + cur.dates;
      $('#sel-detour').textContent = cur.detour;
      closures.forEach(function (c) {
        $('#halo' + c.id).setAttribute('opacity', c.id === sel ? 1 : 0);
        $('#det' + c.id).setAttribute('stroke-width', c.id === sel ? 6 : 3);
      });
    }
    $('#closures').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-id]');
      if (b) { sel = parseInt(b.getAttribute('data-id'), 10); render(); }
    });
    render();
  };

  /* ---------- Feedback: submit and confirmation ---------- */
  pages.feedback = function () {
    $('#send').addEventListener('click', function () {
      $('#form-view').hidden = true;
      $('#done-view').hidden = false;
    });
    $('#again').addEventListener('click', function () {
      $('#done-view').hidden = true;
      $('#form-view').hidden = false;
    });
    $('#form').addEventListener('submit', function (e) { e.preventDefault(); });
  };

  /* ---------- Track ticket: look up a ticket number ---------- */
  pages.track = function () {
    function check() {
      var ok = $('#tid').value.trim().toUpperCase() === 'MUT-0001';
      $('#result').hidden = !ok;
      $('#notfound').hidden = ok;
    }
    $('#check').addEventListener('click', check);
    $('#lookup').addEventListener('submit', function (e) { e.preventDefault(); check(); });
    var q = /[?&]tid=([^&]*)/.exec(location.search);
    if (q) { $('#tid').value = decodeURIComponent(q[1].replace(/\+/g, ' ')); }
    check();
  };

  /* ---------- Staff dashboard: filter tickets, publish notice ---------- */
  pages.dashboard = function () {
    var status = 'All';
    var tickets = [
      { id: 'MUT-0001', category: 'Noise or dust', area: 'Area A', status: 'In progress', tag: 'info', date: '20 Oct' },
      { id: 'MUT-0002', category: 'Pedestrian access', area: 'Area B', status: 'Submitted', tag: 'grey', date: '22 Oct' },
      { id: 'MUT-0003', category: 'Business access', area: 'Area C', status: 'Under review', tag: 'warn', date: '23 Oct' },
      { id: 'MUT-0004', category: 'Road closure', area: 'Area A', status: 'Resolved', tag: 'ok', date: '18 Oct' },
      { id: 'MUT-0005', category: 'Safety', area: 'Area B', status: 'Submitted', tag: 'grey', date: '24 Oct' }
    ];
    function count(s) { return tickets.filter(function (t) { return t.status === s; }).length; }
    function render() {
      var labels = [['All', tickets.length], ['Submitted', count('Submitted')], ['Under review', count('Under review')], ['In progress', count('In progress')], ['Resolved', count('Resolved')]];
      $('#chips').innerHTML = labels.map(function (l) {
        return '<button class="chip' + (l[0] === status ? ' on' : '') + '" aria-pressed="' + (l[0] === status) + '" data-status="' + l[0] + '">' + l[0] + ' (' + l[1] + ')</button>';
      }).join('');
      $('#rows').innerHTML = tickets.filter(function (t) { return status === 'All' || t.status === status; }).map(function (t) {
        return '<tr><td style="font-weight:600">' + t.id + '</td><td>' + t.category + '</td><td>' + t.area + '</td><td><span class="tag ' + t.tag + '">' + t.status + '</span></td><td>' + t.date + '</td><td><a href="track.html" style="font-weight:600">Open</a></td></tr>';
      }).join('');
    }
    $('#chips').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-status]');
      if (b) { status = b.getAttribute('data-status'); render(); }
    });
    $('#publish').addEventListener('click', function () { $('#done').hidden = false; });
    $('#notice-form').addEventListener('submit', function (e) { e.preventDefault(); });
    render();
  };

  if (pages[page]) pages[page]();
})();
