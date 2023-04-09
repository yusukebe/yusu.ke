import { html, raw } from 'hono/html'
import { getContentFromKVAsset } from 'hono/utils/cloudflare'
import { getFilePath } from 'hono/utils/filepath'
import { bufferToString } from 'hono/utils/buffer'
import { marked } from 'marked'
import { MiddlewareHandler } from 'hono'

import { Header } from './components/Header'
import { Footer } from './components/Footer'

// @ts-ignore
import manifest from '__STATIC_CONTENT_MANIFEST'

export type SiteData = {}

export const renderer = (filename: string, data: SiteData): MiddlewareHandler => {
  return async (c, next) => {
    const path = getFilePath({
      filename: filename,
      root: './contents',
    })

    const content = await getContentFromKVAsset(path, {
      namespace: c.env.__STATIC_CONTENT,
      manifest: manifest,
    })

    if (content) {
      const text = bufferToString(content)
      const body = marked(text)
      const html = layout(body, data)
      return c.html(html)
    }
    await next()
  }
}

export const layout = (body: string, data: SiteData) => {
  const App = () => {
    return (
      <div class='wrapper'>
        <Header />
        <div class='content'>{raw(body)}</div>
        <Footer />
      </div>
    )
  }

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Yusuke Wada</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/static/css/style.css" />
        <meta property="og:title" content="Yusuke Wada" />
        <meta property="og:description" content="A web framework developer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yusu.ke" />
        <meta
          property="og:image"
          content="https://yusu.ke/static/images/profile_childfood_400x400.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@yusukebe" />
      </head>
      <body>
        ${(<App />)}
      </body>
    </html>`
}
