import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const eventbriteToken = env.VITE_EVENTBRITE_API_KEY || ''
  const kaggleUsername = env.VITE_KAGGLE_USERNAME || ''
  const kaggleKey = env.VITE_KAGGLE_API_KEY || ''
  const kaggleBasic = kaggleUsername && kaggleKey
    ? Buffer.from(`${kaggleUsername}:${kaggleKey}`).toString('base64')
    : ''

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/eventbrite': {
          target: 'https://www.eventbriteapi.com/v3',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/eventbrite/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (eventbriteToken) {
                proxyReq.setHeader('Authorization', `Bearer ${eventbriteToken}`)
                proxyReq.setHeader('Accept', 'application/json')
              }
            })
          }
        },
        '/api/kaggle': {
          target: 'https://www.kaggle.com/api/v1',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/kaggle/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (kaggleBasic) {
                proxyReq.setHeader('Authorization', `Basic ${kaggleBasic}`)
                proxyReq.setHeader('Accept', 'application/json')
              }
            })
          }
        }
        ,
        '/api/mlh': {
          target: 'https://mlh.io',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/mlh/, '')
        }
      }
    }
  }
})
