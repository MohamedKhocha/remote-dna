/* REMOTE DNA: Night / Day switch (brand identity v1.0.5, README section 9.5).
   Loaded in <head>, before the page paints, so a saved choice never flashes.
   - No choice saved: the page follows the system (prefers-color-scheme).
   - A tap on .rd-theme switches to the other mode and remembers it.
   - Choosing the same mode as the system forgets the choice: back to following it. */
(function () {
  var KEY = 'rd-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); } catch (e) {} }
  function system() { return mq && mq.matches ? 'light' : 'dark'; }
  function current() { return root.getAttribute('data-theme') || system(); }

  var saved = load();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  function sync() {
    var mode = current();
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) metas[i].setAttribute('content', mode === 'light' ? '#EEF1F8' : '#05070D');
    var buttons = document.querySelectorAll('.rd-theme');
    for (var j = 0; j < buttons.length; j++) {
      var b = buttons[j];
      b.setAttribute('aria-pressed', mode === 'light' ? 'true' : 'false');
      // The icon shows where a tap goes: the sun at night, the moon by day.
      var use = b.querySelector('use');
      if (use) use.setAttribute('href', use.getAttribute('href').replace(/#.*$/, mode === 'light' ? '#moon' : '#sun'));
    }
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.rd-theme') : null;
    if (!b) return;
    var next = current() === 'light' ? 'dark' : 'light';
    if (next === system()) { root.removeAttribute('data-theme'); save(null); }
    else { root.setAttribute('data-theme', next); save(next); }
    sync();
  });
  if (mq && mq.addEventListener) mq.addEventListener('change', sync);
  else if (mq && mq.addListener) mq.addListener(sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync);
  else sync();
})();
