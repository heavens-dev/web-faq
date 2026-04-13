(function () {
  var CANARY_SEGMENT = '/canary_faq/';

  var STABLE_PALETTE = {
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
  var lastPathname = null;

  function isCanaryPage() {
    return window.location.pathname.indexOf(CANARY_SEGMENT) !== -1;
  }

  function applyPaletteForPage() {
    var palette = isCanaryPage() ? CANARY_PALETTE : STABLE_PALETTE;

    document.body.setAttribute('data-md-color-media', palette.media);
    document.body.setAttribute('data-md-color-scheme', palette.scheme);
    document.body.setAttribute('data-md-color-primary', palette.primary);
    document.body.setAttribute('data-md-color-accent', palette.accent);

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

    var option = document.querySelector(selector);
    if (option) {
      option.checked = true;
    }
  }

  function refreshPaletteIfPathChanged(force) {
    if (!force && lastPathname === window.location.pathname) {
      return;
    }

    lastPathname = window.location.pathname;
    applyPaletteForPage();
  }

  function scrollToCurrentHash() {
    if (!window.location.hash) {
      return;
    }

    var id = decodeURIComponent(window.location.hash.slice(1));
    var target = document.getElementById(id);
    if (!target) {
      return;
    }

    // Instant navigation can update hash without triggering native anchor jump.
    requestAnimationFrame(function () {
      target.scrollIntoView({ block: 'start' });
    });
  }

  function bindTocClickScroll() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('.md-sidebar--secondary a[href*="#"]');
      if (!link) {
        return;
      }

      var href = link.getAttribute('href');
      if (!href) {
        return;
      }

      var url = new URL(href, window.location.href);
      if (!url.hash || url.pathname !== window.location.pathname) {
        return;
      }

      var id = decodeURIComponent(url.hash.slice(1));
      requestAnimationFrame(function () {
        var target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ block: 'start' });
        }
      });
    });
  }

  function init() {
    refreshPaletteIfPathChanged(true);

    if (typeof window.document$ !== 'undefined' && window.document$ && typeof window.document$.subscribe === 'function') {
      window.document$.subscribe(function () {
        refreshPaletteIfPathChanged(false);
      });
    }

    window.addEventListener('popstate', function () {
      refreshPaletteIfPathChanged(false);
    });

    window.addEventListener('hashchange', scrollToCurrentHash);
    bindTocClickScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
