import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fetchFortune } from './shared/fortune-service'
import { fetchConstellation } from './shared/constellation-service'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url!, 'http://localhost')
            const apiKey = env.TIANAPI_KEY || ''

            if (url.pathname === '/api/fortune') {
              const result = await fetchFortune(apiKey)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.success ? 200 : 400
              res.end(JSON.stringify(result))
              return
            }

            if (url.pathname === '/api/constellation') {
              const sign = url.searchParams.get('sign') || 'aries'
              const result = await fetchConstellation(apiKey, sign)
              res.setHeader('Content-Type', 'application/json')
              res.statusCode = result.success ? 200 : 400
              res.end(JSON.stringify(result))
              return
            }

            next()
          })
        }
      }
    ],
    server: {
      host: true,
      port: 5173,
      strictPort: false,
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  }
})
