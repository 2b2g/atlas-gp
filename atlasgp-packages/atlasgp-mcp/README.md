# ATLAS GP MCP Server

[![npm version](https://img.shields.io/npm/v/atlasgp-mcp.svg)](https://www.npmjs.com/package/atlasgp-mcp)

MCP (Model Context Protocol) server for [ATLAS GP](https://atlasgp.tech). Lets AI assistants like Claude Code and Claude Desktop manage projects and tasks via the ATLAS GP API.

```
AI client  ──stdio──▶  atlasgp-mcp  ──HTTPS──▶  ATLAS GP API
```

## Requirements

- Node.js >= 24
- A ATLAS GP API token (`agp_...`) — generate one in your ATLAS GP account settings [Read about API tokens](https://atlasgp.tech/docs/features/api-tokens)

## Quick start

No installation needed — use `npx` directly in your MCP client config.

### Claude Code

You can set your `URL` to your ATLAS GP instance in `ATLAS_GP_URL`.  
Add to `.claude/settings.json` (project) or `~/.claude.json` (global):

```json
{
  "mcpServers": {
    "atlasgp": {
      "command": "npx",
      "args": ["-y", "atlasgp-mcp"],
      "env": {
        "ATLAS_GP_URL": "https://api.atlasgp.tech",
        "ATLAS_GP_TOKEN": "agp_your_token_here"
      }
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "atlasgp": {
      "command": "npx",
      "args": ["-y", "atlasgp-mcp"],
      "env": {
        "ATLAS_GP_URL": "https://api.atlasgp.tech",
        "ATLAS_GP_TOKEN": "agp_your_token_here"
      }
    }
  }
}
```

### Global install (optional)

If you prefer a pinned install over `npx`:

```bash
npm install -g atlasgp-mcp
```

Then use `"command": "atlasgp-mcp"` (no `args` needed).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ATLAS_GP_URL` | yes | ATLAS GP API server URL (e.g. `https://api.atlasgp.tech`) |
| `ATLAS_GP_TOKEN` | yes (stdio mode) | API token with `agp_` prefix. Not used in HTTP mode — each caller sends their own token |
| `MCP_HTTP_PORT` | no (HTTP mode) | Port for the HTTP server, default `3100` |
| `MCP_PUBLIC_URL` | no (HTTP mode) | Public URL of this server as clients reach it — the OAuth resource identifier. Include the path when the server is mounted under one (`https://api.example.com/mcp`); derived from the request host when unset |
| `MCP_ALLOWED_ORIGINS` | no (HTTP mode) | Comma-separated browser origins allowed to call `/mcp`. Unset means no browser origin is allowed; non-browser clients send no `Origin` and are unaffected |

## HTTP server (remote / self-hosted)

Besides the local stdio mode above, the package ships an HTTP entrypoint
(Streamable HTTP transport) so one shared server can serve many users — each
request authenticates with the caller's own API token:

```bash
ATLAS_GP_URL=https://api.atlasgp.tech atlasgp-mcp-http
# MCP endpoint: http://localhost:3100/mcp, health check: /health
```

Connect from Claude Code:

```bash
claude mcp add --transport http atlasgp https://mcp.example.com/mcp \
  --header "Authorization: Bearer agp_..."
```

or in `.mcp.json` (Claude Code, Cursor, VS Code):

```json
{
  "mcpServers": {
    "atlasgp": {
      "type": "http",
      "url": "https://mcp.example.com/mcp",
      "headers": { "Authorization": "Bearer agp_..." }
    }
  }
}
```

The server is stateless: every request gets its own isolated API client
carrying only that caller's token. Requests without a `Bearer` token get 401.
Self-hosted instances run their own copy next to their API (see `Dockerfile`
in this package) — point `ATLAS_GP_URL` at your API server and put the MCP
port behind your reverse proxy with HTTPS.

### OAuth (ChatGPT and other cloud clients)

Clients that will not accept a pasted API token — ChatGPT connectors among
them — authorize over OAuth 2.1 instead. Nothing extra runs here: this server
advertises itself as the protected resource and points at your ATLAS GP API,
which is the authorization server.

- `GET /.well-known/oauth-protected-resource` returns the resource metadata
  (RFC 9728), naming `ATLAS_GP_URL` as the authorization server.
- A request with no token answers `401` with
  `WWW-Authenticate: Bearer resource_metadata="…"`, which is what starts
  discovery in the client.
- The client then registers, sends the user to the ATLAS GP consent screen,
  and comes back with a `tvo_` access token that it sends here like any other
  bearer token.

Set `MCP_PUBLIC_URL` to the externally reachable URL of this server so the
advertised resource identifier matches what clients actually request.

**Mounted under a path.** When the server sits behind a reverse proxy at
`https://api.example.com/mcp` rather than on its own host, put the full path in
`MCP_PUBLIC_URL`. RFC 9728 then places the metadata at
`/.well-known/oauth-protected-resource/mcp`, which is where a client that
computes the address from the spec — instead of trusting the `WWW-Authenticate`
header — will look. The server publishes it at both that address and the root
one, but the proxy has to route the path-inserted address here too:

```nginx
location = /.well-known/oauth-protected-resource/mcp {
    proxy_pass http://127.0.0.1:3100/.well-known/oauth-protected-resource/mcp;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Manually issued `agp_` tokens keep working exactly as before — OAuth is an
additional way in, not a replacement. Use `agp_` for stdio, CLIs and CI, where
there is no browser to complete an authorization flow.

## Available tools

61 tools covering the full ATLAS GP surface.

**Projects (Goals)** — `list_goals`, `create_goal`, `update_goal`, `delete_goal`

**Lists** — `list_lists`, `create_list`, `update_list`, `delete_list`

**Tasks** — `list_tasks`, `get_task`, `create_task`, `update_task`, `delete_task`, `toggle_task_assignees`, `get_task_history`, `restore_task_from_history`

**Agenda** — `get_agenda` (today, upcoming and recently completed across all projects in one call)

**Tags** — `list_tags`, `create_tag`, `update_tag`, `delete_tag`, `toggle_task_tag`

**Kanban** — `list_kanban_columns`, `create_kanban_column`, `update_kanban_column`, `delete_kanban_column`

**Collaboration** — `list_collaborators`, `list_collaborators_for_goal`, `invite_collaborator`, `remove_collaborator`, `toggle_collaborator_roles`, `list_roles`, `create_role`, `delete_role`, `list_permissions`, `list_role_permissions_for_goal`, `toggle_role_permission`

**Task dependencies (graph)** — `list_task_dependencies`, `add_task_dependency`, `delete_task_dependency`

**Notifications** — `list_notifications`, `mark_notification_read`, `mark_all_notifications_read`

**Organizations** — `list_organizations`, `get_organization`, `create_organization`, `update_organization`, `delete_organization`, `list_organization_members`, `add_organization_member`, `update_organization_member_role`, `remove_organization_member`

**Time tracking** — `start_timer`, `stop_timer`, `get_active_timer`, `log_time`, `list_time_entries`, `update_time_entry`, `delete_time_entry`, `get_time_summary`, `get_time_report`, `get_time_contributors`

## How it works

The MCP server uses the `atlasgp-api` client under the hood. Every tool call goes through the full API stack — authentication, permission checks, and validation. The MCP process itself is stateless; your token never leaves your machine except in `Authorization: Bearer ...` headers to your ATLAS GP API server.

## Development (from monorepo)

If you're working on the package from the ATLAS GP monorepo:

```bash
# from repo root
pnpm build:packages
cd community/atlasgp-packages/atlasgp-mcp
pnpm build

# run directly for debugging
ATLAS_GP_URL=http://localhost:3000 ATLAS_GP_TOKEN=agp_... node dist/index.js
```

## License

See [LICENSE.md](https://github.com/Gimanh/atlasgp-community/blob/main/LICENSE.md) in the ATLAS GP repository.

## Links

- [ATLAS GP](https://github.com/Gimanh/atlasgp-community) — project repository
- [Model Context Protocol](https://modelcontextprotocol.io) — protocol specification
- [Issues](https://github.com/Gimanh/atlasgp-community/issues) — bug reports & feature requests
