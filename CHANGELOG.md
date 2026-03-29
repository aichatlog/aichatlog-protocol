# Changelog

All notable changes to the AIChatLog protocol will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/).

## [0.7.0] - 2026-03-29

### Added
- Shared UI components in `web/` directory
- `aichatlog-content.css` — markdown typography styles
- `aichatlog-syntax.css` — code highlighting (One Light / Catppuccin Mocha)
- `aichatlog-toolblock.css` — collapsible tool call block styles
- `aichatlog-theme.js` — light/dark/auto theme management
- `aichatlog-markdown.js` — markdown rendering engine with tool-block support
- `aichatlog-message.js` — `<aichatlog-message>` Web Component

## [0.6.0] - 2026-03-24

### Added
- v2 conditional sync protocol (`sync_mode`: check/delta/full)
- `sync_mode`, `delta_from_seq`, `has_code` fields in ConversationObject
- `POST /api/conversations/sync` endpoint with SyncResponse
- Batch ingest endpoint `POST /api/conversations/batch`

## [0.5.0] - 2026-03-20

### Added
- Initial protocol spec extracted from monorepo
- ConversationObject v1 JSON Schema
- OpenAPI 3.1 specification for server API
- Example conversations (claude-code, chatgpt)
