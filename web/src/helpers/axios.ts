import axios from 'axios'
import { useAtlasGPMainUrl } from '@/composables/useAtlasGPMainUrl'

const $api = axios.create({
  withCredentials: true,
  baseURL: useAtlasGPMainUrl(),
  timeout: 10000,
})

export default $api
