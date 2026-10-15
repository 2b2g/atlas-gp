type AtlasGPRuntimeConfig = {
  apiUrl?: string
}

declare global {
  interface Window {
    __ATLAS_GP_CONFIG__?: AtlasGPRuntimeConfig
  }
}

export const getConfiguredApiUrl = (): string | null => {
  const url = window.__ATLAS_GP_CONFIG__?.apiUrl?.trim()
  return url ? url.replace(/\/+$/, '') : null
}
