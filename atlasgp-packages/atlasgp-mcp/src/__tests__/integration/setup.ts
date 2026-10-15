import axios from 'axios'
import { TvApi } from 'atlasgp-api'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export const ts = () => Date.now()

const ATLAS_GP_URL = process.env.ATLAS_GP_URL
const ATLAS_GP_TOKEN = process.env.ATLAS_GP_TOKEN

if (!ATLAS_GP_URL || !ATLAS_GP_TOKEN) {
  throw new Error(
    'Integration tests require ATLAS_GP_URL and ATLAS_GP_TOKEN env vars.\n'
    + 'Example: ATLAS_GP_URL=https://api.atlasgp.tech ATLAS_GP_TOKEN=agp_... pnpm test:integration',
  )
}

const $axios = axios.create({ baseURL: ATLAS_GP_URL, timeout: 30000 })
$axios.defaults.headers.common['Authorization'] = `Bearer ${ATLAS_GP_TOKEN}`

export const api = new TvApi($axios)

type ToolEntry = {
  name: string
  cb: (args: Record<string, unknown>) => Promise<{ content: { type: string; text: string }[]; isError?: boolean }>
}

export function captureServer() {
  const tools: ToolEntry[] = []
  const server = {
    registerTool(name: string, _config: unknown, cb: ToolEntry['cb']) {
      tools.push({ name, cb })
    },
  } as unknown as McpServer
  return { server, tools }
}

export function call(tools: ToolEntry[], name: string, args: Record<string, unknown> = {}) {
  const tool = tools.find((t) => t.name === name)
  if (!tool) throw new Error(`Tool "${name}" not found`)
  return tool.cb(args)
}

export function parse(result: { content: { text: string }[]; isError?: boolean }) {
  const text = result.content[0].text
  if (result.isError) throw new Error(text)
  return JSON.parse(text)
}
