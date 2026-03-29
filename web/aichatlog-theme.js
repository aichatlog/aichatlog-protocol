/**
 * AIChatLog Theme Manager
 * Light/dark/auto theme switching with localStorage persistence.
 */
(function() {
  'use strict';
  var ns = window.AIChatLog = window.AIChatLog || {};
  var current = localStorage.getItem('aichatlog-theme') || 'auto';

  function apply() {
    var isDark = current === 'dark' || (current === 'auto' && window.matchMedia('(prefers-color-scheme:dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  }

  function updateButtons() {
    ['auto','light','dark'].forEach(function(m, i) {
      var b = document.querySelectorAll('.theme-btn')[i];
      if (b) {
        b.classList.toggle('!border-blue-500', m === current);
        b.classList.toggle('!text-blue-500', m === current);
      }
    });
  }

  ns.setTheme = function(mode) {
    current = mode;
    localStorage.setItem('aichatlog-theme', mode);
    apply();
    updateButtons();
  };
  ns.applyTheme = apply;
  ns.updateThemeButtons = updateButtons;
  ns.getTheme = function() { return current; };

  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function() {
    if (current === 'auto') apply();
  });
})();
