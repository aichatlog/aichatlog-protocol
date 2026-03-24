# Contributing to AIChatLog Protocol

Thanks for your interest in contributing! This guide covers the ConversationObject protocol specification.

## Overview

The protocol defines the ConversationObject JSON schema and OpenAPI specification — the contract between input plugins and the server.

## Getting Started

```bash
git clone https://github.com/aichatlog/aichatlog-protocol.git
cd aichatlog-protocol
```

## How to Contribute

### Proposing Schema Changes

1. Open an issue describing the change and motivation
2. Update `conversation.schema.json`
3. Update `api.openapi.yaml` if the change affects API endpoints
4. Add examples in `examples/` if helpful
5. Update `CHANGELOG.md`

### Conventions

- ConversationObject v1: full payload, always includes messages
- ConversationObject v2: conditional sync (check/delta/full modes)
- Universal fields are top-level; source-specific data goes in `metadata` dict
- The `source` field should be a lowercase identifier (e.g. `claude-code`, `chatgpt`, `gemini`)

### Cross-Repo Impact

Schema changes may require updates in:
- [aichatlog-server](https://github.com/aichatlog/aichatlog-server) — storage and API
- [aichatlog-plugin-cc](https://github.com/aichatlog/aichatlog-plugin-cc) — serialization

## Pull Request Process

1. Fork and create a feature branch
2. Make your changes
3. Validate schema: ensure JSON Schema is valid
4. Update CHANGELOG.md
5. Submit PR with a clear description of what and why

## Naming Conventions

For external repos/packages:

```text
aichatlog-plugin-{source}     # Input plugins (e.g. aichatlog-plugin-chatgpt)
aichatlog-adapter-{dest}      # Output adapters (e.g. aichatlog-adapter-notion)
```

## License

AGPL-3.0 — see [LICENSE](LICENSE).
