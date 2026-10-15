#!/usr/bin/env node
import axios from 'axios'
import { TvApi } from 'atlasgp-api'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createMcpServer } from './server.js'

const ATLAS_GP_URL = process.env.ATLAS_GP_URL
const ATLAS_GP_TOKEN = process.env.ATLAS_GP_TOKEN

if (!ATLAS_GP_URL || !ATLAS_GP_TOKEN) {
  console.error('Required environment variables: ATLAS_GP_URL, ATLAS_GP_TOKEN')
  console.error('Example: ATLAS_GP_URL=https://api.atlasgp.tech ATLAS_GP_TOKEN=agp_...')
  process.exit(1)
}

const $axios = axios.create({
  baseURL: ATLAS_GP_URL,
  timeout: 30000,
})
$axios.defaults.headers.common['Authorization'] = `Bearer ${ATLAS_GP_TOKEN}`

const api = new TvApi($axios)
const server = createMcpServer(api)
const transport = new StdioServerTransport()

await server.connect(transport)
