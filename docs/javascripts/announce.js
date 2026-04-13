(function () {
  var ANNOUNCE_TEXT = "Heaven's Gate Canary уже доступен!";
  var ANNOUNCE_URL = new URL('https://t.me/heavens_gate_canary_bot', window.__md_scope || window.location);
  var CANARY_PATH_SEGMENT = '/canary_faq/';
  var DEFAULT_PALETTE = {
    media: 'none',
    scheme: 'slate',
    primary: 'light-blue',
    accent: 'cyan',
  };
  var CANARY_PALETTE = {
    media: 'none',
    scheme: 'slate',
    primary: 'deep-orange',
    accent: 'orange',
  };

  function isCanaryPage() {
    return window.location.pathname.indexOf(CANARY_PATH_SEGMENT) !== -1;
  }

  function syncPaletteRadio(palette) {
    var selector =
      'input.md-option[data-md-color-media="' +
      palette.media +
      '"][data-md-color-scheme="' +
      palette.scheme +
      '"][data-md-color-primary="' +
      palette.primary +
      '"][data-md-color-accent="' +
      palette.accent +
      '"]';
    var paletteOption = document.querySelector(selector);
    if (paletteOption) {
      paletteOption.checked = true;
    }
  }

  function applyPagePalette() {
    var palette = isCanaryPage() ? CANARY_PALETTE : DEFAULT_PALETTE;

    Object.keys(palette).forEach(function (key) {
      document.body.setAttribute('data-md-color-' + key, palette[key]);
    });

    syncPaletteRadio(palette);

    if (typeof window.__md_set === 'function') {
      window.__md_set('__palette', { color: palette });
    }
  }

  function applyPageLayoutClass() {
    document.body.classList.toggle('hg-canary-page', isCanaryPage());
  }

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
    applyPagePalette();
    applyPageLayoutClass();
    mountAnnouncement();

    var observer = new MutationObserver(function () {
      applyPagePalette();
      applyPageLayoutClass();
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
