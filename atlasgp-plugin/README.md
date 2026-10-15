# ATLAS GP plugin for Claude Code

Browse and manage your [ATLAS GP](https://atlasgp.tech) projects and tasks directly from Claude Code. The plugin bundles the [`atlasgp-mcp`](https://www.npmjs.com/package/atlasgp-mcp) server plus skills and slash commands, so setup is just "install and paste a token" — no manual config editing.

## What you get

- **Bundled MCP server** — the full ATLAS GP tool surface (projects, lists, tasks, tags, kanban, collaboration, dependencies, notifications), no separate install.
- **Slash commands:**
  - `/atlasgp-projects` — list your projects
  - `/atlasgp-tasks [project]` — show tasks in a project
  - `/atlasgp-new-task <description>` — create a task
  - `/atlasgp-log [project]` — log the work done this session as a task
- **Skill** — conventions so the assistant resolves ids correctly, paginates, and logs completed work as top-level tasks.

## Requirements

- Node.js >= 24 (the bundled MCP server runs via `npx`)
- A ATLAS GP API token (`agp_...`) from your account settings — see [API tokens](https://atlasgp.tech/docs/features/api-tokens)

## Install

```text
/plugin marketplace add Gimanh/atlasgp-community
/plugin install atlasgp@atlasgp
```

On install you'll be prompted for two values:

| Setting | Example | Notes |
|---|---|---|
| **ATLAS GP API URL** | `https://api.atlasgp.tech` | ATLAS GP Cloud, or your self-hosted instance URL |
| **ATLAS GP API token** | `agp_...` | Stored securely in your system keychain. Scope it to the minimum permissions/projects needed. |

That's it — the `atlasgp` MCP server and the commands become available after the plugin is enabled.

## Security

The token is supplied via the plugin's secure `userConfig` (marked sensitive → stored in the OS keychain, not in plaintext settings) and passed to the MCP server only as an environment variable. Every tool call still goes through the full ATLAS GP API stack — authentication, permission checks, and token-scope intersection. Give the token only the scope the assistant should have.
