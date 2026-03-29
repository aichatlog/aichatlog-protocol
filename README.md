# ConversationObject Protocol

[![CI](https://github.com/aichatlog/aichatlog-protocol/actions/workflows/validate.yml/badge.svg)](https://github.com/aichatlog/aichatlog-protocol/actions/workflows/validate.yml)
[![Release](https://img.shields.io/github/v/tag/aichatlog/aichatlog-protocol?label=release)](https://github.com/aichatlog/aichatlog-protocol/releases)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)

English | [简体中文](README.zh-CN.md)

The ConversationObject is the open transport format used between input plugins and the aichatlog-server. Any tool that produces this JSON format can integrate with AIChatLog.

## Schema

See [conversation.schema.json](conversation.schema.json) for the full JSON Schema definition.

## Quick Reference

```json
{
  "version": 1,
  "source": "claude-code",
  "device": "macbook",
  "session_id": "unique-id",
  "title": "Conversation title",
  "date": "2026-03-20",
  "project": "project-name",
  "project_path": "/path/to/project",
  "model": "claude-sonnet-4",
  "message_count": 4,
  "word_count": 320,
  "content_hash": "md5-or-sha256-hex",
  "messages": [
    {"role": "user", "content": "...", "time_str": "14:30", "is_context": false, "seq": 0},
    {"role": "assistant", "content": "...", "time_str": "14:31", "is_context": false, "seq": 1}
  ]
}
```

## Required Fields

| Field | Type | Description |
| --- | --- | --- |
| `version` | integer | Always `1` |
| `source` | string | AI tool identifier: `claude-code`, `chatgpt`, `claude-ai`, etc. |
| `session_id` | string | Unique conversation ID from the source tool |
| `title` | string | Conversation title |
| `date` | string | `YYYY-MM-DD` format |
| `messages` | array | At least one message |

## Deduplication

The server deduplicates by the tuple `(source_type, device, session_id)`. If a conversation with the same key arrives with a different `content_hash`, it is treated as an update.

## Server API

See [api.openapi.yaml](api.openapi.yaml) for the full OpenAPI specification.

Key endpoints:
- `POST /api/conversations` — Ingest a single ConversationObject
- `POST /api/conversations/batch` — Ingest an array of ConversationObjects
- `GET /api/conversations` — List with filtering, search (FTS5), and pagination
- `GET /api/conversations/:id?full=true` — Get conversation with messages
- `GET /api/conversations/:id/messages` — Get messages only
- `GET /api/stats` — Conversation counts by status

## Examples

- [claude-code-conversation.json](examples/claude-code-conversation.json)
- [chatgpt-conversation.json](examples/chatgpt-conversation.json)

## Building a Plugin

To build an input plugin for a new AI tool:

1. Parse the tool's conversation format
2. Map it to a ConversationObject JSON
3. POST to the server's `/api/conversations` endpoint
4. The server handles dedup, storage, FTS indexing, and output

The `source` field should be a lowercase identifier for your tool (e.g. `gemini`, `copilot`, `cursor`).

## Shared UI Components

The `web/` directory contains shared UI components for rendering conversations. Any dashboard can use them via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-content.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-syntax.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-toolblock.css">
<script src="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-theme.js"></script>
<script src="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-markdown.js"></script>
<script src="https://cdn.jsdelivr.net/gh/aichatlog/aichatlog-protocol@v0.7.0/web/aichatlog-message.js"></script>
```

| Component | Description |
| --------- | ----------- |
| `aichatlog-content.css` | Markdown typography (`.md-content`) |
| `aichatlog-syntax.css` | Code highlighting — One Light (light) / Catppuccin Mocha (dark) |
| `aichatlog-toolblock.css` | Collapsible tool call blocks (`.tool-block`) |
| `aichatlog-theme.js` | Light/dark/auto theme switching |
| `aichatlog-markdown.js` | Markdown rendering engine (markdown-it + DOMPurify + tool-block support) |
| `aichatlog-message.js` | `<aichatlog-message>` Web Component for rendering individual messages |

## Version Compatibility

| Protocol | Server   | CC Plugin | Notes                                  |
|----------|----------|-----------|----------------------------------------|
| 0.5.0    | >= 0.1.0 | >= 0.1.0  | v1 full payload only                   |
| 0.6.0    | >= 0.6.0 | >= 0.8.0  | v2 conditional sync (check/delta/full) |
| 0.7.0    | >= 0.7.0 | >= 0.9.0  | Shared UI components (`web/`)          |

**Versioning note:** The `version` field inside ConversationObject (integer 1 or 2) is the *wire protocol version*. The [VERSION](VERSION) file tracks the *schema/spec release version* (semver). These are distinct — a single release version (e.g. 0.6.0) can support multiple wire versions (v1 and v2).
