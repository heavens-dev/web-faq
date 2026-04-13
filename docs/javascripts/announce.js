(function () {
  var ANNOUNCE_TEXT = "Heaven's Gate Canary уже доступен!";
  var ANNOUNCE_URL = new URL('https://t.me/heavens_gate_canary_bot', window.__md_scope || window.location);

  function buildMarkup() {
    return (
      '<a class="hg-announce" href="' +
      ANNOUNCE_URL +
      '" aria-label="' +
      ANNOUNCE_TEXT +
      '">' +
      '<span class="hg-announce__icon-wrap" aria-hidden="true">' +
      '<img class="hg-announce__icon" src="' +
      new URL('assets/logo-orange.svg', window.__md_scope || window.location).pathname +
      '" alt="" loading="lazy" decoding="async">' +
      '</span>' +
      '<span class="hg-announce__text">' +
      ANNOUNCE_TEXT +
      '</span>' +
      '</a>'
    );
  }

  function mountAnnouncement() {
    var hosts = document.querySelectorAll('[data-md-component="announce"]');

    hosts.forEach(function (host) {
      if (host.querySelector('.hg-announce')) {
        return;
      }
      host.innerHTML = buildMarkup();
    });
  }

  function init() {
    mountAnnouncement();

    var observer = new MutationObserver(function () {
      mountAnnouncement();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
