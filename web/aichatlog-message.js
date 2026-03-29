/**
 * <aichatlog-message> Web Component
 * Renders a single conversation message with role-based styling.
 *
 * Attributes:
 *   role       - "user" | "assistant"
 *   content    - message text (markdown + tool blocks)
 *   timestamp  - ISO8601 timestamp
 *   model      - model name (assistant only)
 *   input-tokens  - token count (assistant only)
 *   output-tokens - token count (assistant only)
 *
 * Requires: AIChatLog.initMarkdown(), AIChatLog.renderContent() from aichatlog-markdown.js
 */
(function() {
  'use strict';

  // Shared markdown instance (lazy init)
  var _md = null;
  function getMd() {
    if (!_md) _md = window.AIChatLog.initMarkdown();
    return _md;
  }

  class AIChatLogMessage extends HTMLElement {
    connectedCallback() {
      var role = this.getAttribute('role') || 'assistant';
      var content = this.getAttribute('content') || '';
      var timestamp = this.getAttribute('timestamp') || '';
      var model = this.getAttribute('model') || '';
      var inTok = parseInt(this.getAttribute('input-tokens')) || 0;
      var outTok = parseInt(this.getAttribute('output-tokens')) || 0;
      var isUser = role === 'user';

      // Container
      this.className = 'max-w-[85%] flex flex-col ' + (isUser ? 'self-end' : 'self-start');

      // Header (role label + timestamp + model)
      var hd = document.createElement('div');
      hd.className = 'flex items-center gap-2 mb-1 text-[11px] ' +
        (isUser ? 'justify-end text-blue-500' : 'text-emerald-500');
      hd.textContent = isUser ? 'User' : 'Assistant';

      if (timestamp) {
        var ts = document.createElement('span');
        ts.className = 'text-gray-400 dark:text-slate-500';
        ts.textContent = timestamp.replace('T', ' ').slice(11, 19);
        hd.appendChild(ts);
      }
      if (!isUser && model) {
        var ms = document.createElement('span');
        ms.className = 'text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 px-1.5 rounded text-[10px]';
        ms.textContent = model.replace('claude-', '').replace(/-2025\d+/, '');
        hd.appendChild(ms);
      }
      this.appendChild(hd);

      // Bubble
      var bubble = document.createElement('div');
      bubble.className = isUser
        ? 'rounded-2xl rounded-br-sm px-4 py-3 bg-blue-500 text-white text-sm leading-relaxed'
        : 'rounded-2xl rounded-bl-sm px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-slate-200 text-sm leading-relaxed border border-gray-200 dark:border-slate-700/50';

      if (isUser) {
        bubble.textContent = content;
      } else {
        window.AIChatLog.renderContent(bubble, content, getMd());
      }
      this.appendChild(bubble);

      // Token counts
      if (!isUser && (inTok || outTok)) {
        var tk = document.createElement('div');
        tk.className = 'text-[10px] text-gray-400 dark:text-slate-500 mt-1';
        tk.textContent = (inTok / 1000).toFixed(1) + 'k in / ' + (outTok / 1000).toFixed(1) + 'k out';
        this.appendChild(tk);
      }
    }
  }

  customElements.define('aichatlog-message', AIChatLogMessage);
})();
