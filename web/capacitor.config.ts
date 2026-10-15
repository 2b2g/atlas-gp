import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.handscream.atlasgp.app',
  appName: 'ATLAS GP',
  webDir: 'dist',
  zoomEnabled: false,
  android: {
    zoomEnabled: false,
  },
  ios: {
    zoomEnabled: false,
    webContentsDebuggingEnabled: true,
  },
  server: {
    hostname: 'app.atlasgp.tech',
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false,
    },
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    WidgetBridge: {
      appGroup: 'group.com.handscream.atlasgp.app',
    },
  },
}

export default config
