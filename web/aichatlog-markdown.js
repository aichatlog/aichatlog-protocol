/**
 * AIChatLog Markdown Renderer
 * Initializes markdown-it, processes XML tags, renders content with tool-block support.
 * Requires: markdown-it, DOMPurify, highlight.js (loaded by the host page).
 * All HTML output is sanitized via DOMPurify.sanitize() before DOM injection.
 */
(function() {
  'use strict';
  var ns = window.AIChatLog = window.AIChatLog || {};

  // ── Markdown Initialization ──
  ns.initMarkdown = function() {
    var md = window.markdownit({
      html: false, linkify: true, typographer: true,
      highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try { return hljs.highlight(str, {language: lang}).value; } catch(_) {}
        }
        try { return hljs.highlightAuto(str).value; } catch(_) {}
        return '';
      }
    });
    if (window.markdownitFootnote) md.use(window.markdownitFootnote);
    if (window.texmath) md.use(window.texmath, {engine: katex, delimiters: 'dollars'});
    return md;
  };

  // ── XML Tag Processing ──
  ns.stripXmlTags = function(text) {
    // 1. Large context blocks -> badge + code block
    text = text.replace(/<(system-reminder|ide_selection|available-deferred-tools|task-notification|gitStatus|fast_mode_info|claudeMd|antml:thinking)>([\s\S]*?)<\/\1>/g, function(_, tag, body) {
      var n = body.trim().split('\n').length;
      return '\n`[' + tag + ' (' + n + ' lines)]`\n```\n' + body.trim() + '\n```\n';
    });
    // 2. File opened tags -> file badge
    text = text.replace(/<ide_opened_file>[^<]*<\/ide_opened_file>/g, function(m) {
      var f = m.match(/file\s+([^\s]+)/);
      return f ? '`[Opened: ' + f[1].split('/').pop() + ']`' : '`[file opened]`';
    });
    // 3. Command/hook tags -> badge + content
    text = text.replace(/<(command-name|command-message|command-args|local-command-caveat|local-command-stdout|user-prompt-submit-hook)>([\s\S]*?)<\/\1>/g, function(_, tag, body) {
      return '`[' + tag + ']` ' + body.trim();
    });
    // 4. Remaining paired tags -> badge + keep content
    text = text.replace(/<([a-zA-Z][a-zA-Z0-9_:-]*)(?:\s[^>]*)?>(([\s\S]*?))<\/\1>/g, function(_, tag, body) {
      if (!body.trim()) return '`[' + tag + ']`';
      return '`[' + tag + ']` ' + body.trim();
    });
    // 5. Self-closing tags -> badge
    text = text.replace(/<[a-zA-Z][a-zA-Z0-9_:-]*(?:\s[^>]*)?\s*\/>/g, function(m) {
      var tag = m.match(/<([a-zA-Z][a-zA-Z0-9_:-]*)/);
      return tag ? '`[' + tag[1] + ']`' : '';
    });
    // 6. Orphan open/close tags -> badge
    text = text.replace(/<\/?([a-zA-Z][a-zA-Z0-9_:-]*)(?:\s[^>]*)?>/g, function(_, tag) {
      return '`[' + tag + ']`';
    });
    return text;
  };

  // ── Content Rendering ──
  // All output is sanitized by DOMPurify before DOM insertion
  ns.renderContent = function(parent, text, md) {
    if (!text) return;
    // Extract tool blocks as placeholders before XML/markdown processing
    var toolBlocks = [];
    text = text.replace(
      /\*\*Tool: (\w+)\*\*\n([\s\S]*?)(?:\n\n<!-- tool_result -->\n([\s\S]*?)\n<!-- \/tool_result -->)/g,
      function(_, name, params, result) {
        var i = toolBlocks.length;
        toolBlocks.push({n: name, p: params.trim().replace(/\n/g, ', ').replace(/\s{2,}/g, ' '), r: result});
        return '\n\nTOOLBLK' + i + 'END\n\n';
      }
    );
    text = text.replace(
      /<!-- tool_result -->\n([\s\S]*?)\n<!-- \/tool_result -->/g,
      function(_, result) {
        var i = toolBlocks.length;
        toolBlocks.push({n: 'Tool Result', p: '', r: result});
        return '\n\nTOOLBLK' + i + 'END\n\n';
      }
    );
    text = ns.stripXmlTags(text);
    var html = DOMPurify.sanitize(md.render(text));
    // Inject tool blocks back as <details> elements (inner content also sanitized)
    toolBlocks.forEach(function(b, i) {
      var inner = DOMPurify.sanitize(md.render(b.r));
      var det = '<details class="tool-block"><summary><strong>' + DOMPurify.sanitize(b.n) + '</strong>' +
        (b.p ? ' <span class="tool-params">' + DOMPurify.sanitize(b.p) + '</span>' : '') +
        '</summary><div class="tool-body">' + inner + '</div></details>';
      html = html.replace('<p>TOOLBLK' + i + 'END</p>', det).replace('TOOLBLK' + i + 'END', det);
    });
    var div = document.createElement('div');
    div.className = 'md-content';
    // Content fully sanitized by DOMPurify above
    div.innerHTML = html;
    parent.appendChild(div);
  };

  // Backward compat
  window.AIChatLogUI = ns;
})();
