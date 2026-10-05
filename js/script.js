/* Odonto Excellence Santa Cruz — interações */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5545991335082';
  var WHATSAPP_MESSAGE = 'Olá! Vim do site da Odonto Excellence Santa Cruz e gostaria de informações.';
  var WHATSAPP_URL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  var desktop = window.matchMedia('(min-width: 960px)');

  document.documentElement.classList.add('js');

  function initWhatsApp() {
    document.querySelectorAll('[data-whatsapp]').forEach(function (link) {
      link.href = WHATSAPP_URL;
    });
  }

  // Exibe um placeholder elegante enquanto a imagem definitiva não existir em /assets
  function initImagePlaceholders() {
    document.querySelectorAll('.media img').forEach(function (img) {
      var holder = img.closest('.media');
      holder.dataset.file = img.getAttribute('src');
      var markEmpty = function () { holder.classList.add('is-empty'); };
      var markLoaded = function () { holder.classList.remove('is-empty'); img.classList.add('is-loaded'); };
      if (img.complete) {
        if (img.naturalWidth === 0) markEmpty(); else markLoaded();
      } else {
        img.addEventListener('error', markEmpty, { once: true });
        img.addEventListener('load', markLoaded, { once: true });
      }
    });
  }

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var update = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');
    var header = document.querySelector('[data-header]');
    if (!toggle || !menu) return;

    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.classList.toggle('is-open', open);
      header.classList.toggle('menu-open', open);
      document.body.classList.toggle('menu-locked', open);
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1080px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  }

  function initActiveNav() {
    var links = document.querySelectorAll('.main-nav__link');
    if (!('IntersectionObserver' in window) || !links.length) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-current'); });
        var link = map[entry.target.id];
        if (link) link.classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal, [data-journey]');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  // "Como podemos cuidar do seu sorriso?" — painel lateral no desktop, accordion no mobile
  function initNeeds() {
    var root = document.querySelector('[data-needs]');
    if (!root) return;
    var triggers = Array.prototype.slice.call(root.querySelectorAll('.needs__trigger'));

    var setActive = function (target) {
      triggers.forEach(function (btn) {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn === target;
        btn.setAttribute('aria-expanded', String(open));
        btn.classList.toggle('is-active', open);
        panel.classList.toggle('is-open', open);
      });
    };

    triggers.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (isOpen && !desktop.matches) setActive(null);
        else setActive(btn);
      });
      btn.addEventListener('keydown', function (e) {
        if (!desktop.matches) return;
        var next = null;
        if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
        if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
        if (next) { e.preventDefault(); next.focus(); setActive(next); }
      });
    });

    desktop.addEventListener('change', function (e) {
      if (e.matches && !root.querySelector('.needs__trigger.is-active')) setActive(triggers[0]);
    });
  }

  function initFaq() {
    var root = document.querySelector('[data-accordion]');
    if (!root) return;
    root.querySelectorAll('button[aria-controls]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') !== 'true';
        btn.setAttribute('aria-expanded', String(open));
        document.getElementById(btn.getAttribute('aria-controls')).classList.toggle('is-open', open);
      });
    });
  }

  // Vídeo institucional: botão de play próprio; controles nativos após iniciar
  function initVideo() {
    document.querySelectorAll('[data-video]').forEach(function (root) {
      var video = root.querySelector('video');
      var button = root.querySelector('[data-video-play]');
      if (!video || !button) return;
      video.controls = false;
      button.addEventListener('click', function () {
        video.controls = true;
        video.play();
      });
      video.addEventListener('play', function () { root.classList.add('is-playing'); });
      video.addEventListener('ended', function () {
        root.classList.remove('is-playing');
        video.controls = false;
      });
    });
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function init() {
    initWhatsApp();
    initImagePlaceholders();
    initHeader();
    initMenu();
    initActiveNav();
    initReveal();
    initNeeds();
    initFaq();
    initVideo();
    initYear();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
