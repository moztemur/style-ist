import { createServer } from 'http'
import { createReadStream } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
}

const server = createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  // Handle favicon.ico request
  if (req.url === '/favicon.ico') {
    res.writeHead(204)
    res.end()
    return
  }

  // Serve index.html for root path
  let filePath = req.url === '/' ? '/index.html' : req.url
  filePath = join(__dirname, 'dist', filePath)

  const extnamee = String(extname(filePath)).toLowerCase()
  const contentType = mimeTypes[extnamee] || 'application/octet-stream'

  createReadStream(filePath)
    .on('error', () => {
      res.writeHead(404)
      res.end('File not found')
    })
    .on('open', () => {
      res.setHeader('Content-Type', contentType)
      res.writeHead(200)
    })
    .pipe(res)
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
