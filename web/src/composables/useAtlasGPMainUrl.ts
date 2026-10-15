import { getConfiguredApiUrl } from '@/helpers/serverConfig'

/**
 * Use this composition to get OFFICIAL SERVER URL
 * We allow updates only from our servers
 * @returns
 */
export const useAtlasGPMainUrl = () => {
  // Self-hosted deployments pin the API URL at deploy time (config.js generated from ATLAS_GP_API_URL).
  // Mobile builds ship the empty config stub, so the updater below always talks to the official server.
  const configuredUrl = getConfiguredApiUrl()
  if (configuredUrl) return configuredUrl

  // DO NOT CHANGE THIS URL WE ALLOW UPDATES ONLY FROM THIS OUR SERVERS
  return process.env.NODE_ENV !== 'production' ? 'http://localhost:1401' : 'https://api.atlasgp.tech'
}
