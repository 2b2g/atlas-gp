import axios from 'axios'

const ATLAS_GP_URL = process.env.ATLAS_GP_URL
const ATLAS_GP_LOGIN = process.env.ATLAS_GP_LOGIN
const ATLAS_GP_PASSWORD = process.env.ATLAS_GP_PASSWORD
const ATLAS_GP_TOKEN_PROVIDED = process.env.ATLAS_GP_TOKEN

let createdTokenId: number | null = null
let createdToken: string | null = null

async function loginWithRetry(attempts = 5) {
  let lastError: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await axios.post(`${ATLAS_GP_URL}/module/auth/login`, {
        login: ATLAS_GP_LOGIN,
        password: ATLAS_GP_PASSWORD,
      })
    } catch (e) {
      lastError = e
      await new Promise((r) => setTimeout(r, 500 * (i + 1)))
    }
  }
  throw lastError
}

export async function setup() {
  if (!ATLAS_GP_URL) return
  if (ATLAS_GP_TOKEN_PROVIDED) return
  if (!ATLAS_GP_LOGIN || !ATLAS_GP_PASSWORD) return

  const loginRes = await loginWithRetry()
  const jwt = loginRes.data.access
  if (!jwt) throw new Error('Login succeeded but no access token returned')

  const tokenRes = await axios.post(
    `${ATLAS_GP_URL}/module/api-tokens`,
    { name: `mcp-integration-${Date.now()}` },
    { headers: { Authorization: `Bearer ${jwt}` } },
  )
  const item = tokenRes.data.response?.item
  const token = tokenRes.data.response?.token
  if (!token || !item?.id) throw new Error('Failed to create API token')

  createdTokenId = item.id
  createdToken = token
  process.env.ATLAS_GP_TOKEN = token
  process.env.__ATLAS_GP_LOGIN_JWT__ = jwt
}

export async function teardown() {
  if (!createdTokenId || !createdToken) return
  const jwt = process.env.__ATLAS_GP_LOGIN_JWT__
  if (!jwt) return

  await axios
    .delete(`${ATLAS_GP_URL}/module/api-tokens`, {
      data: { id: createdTokenId },
      headers: { Authorization: `Bearer ${jwt}` },
    })
    .catch(() => { })
}
