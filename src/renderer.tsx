import { html, raw } from 'hono/html'
import { marked } from 'marked'
import { createMiddleware } from 'hono/factory'

import { Header } from './components/Header'
import { Footer } from './components/Footer'

export type SiteData = {}

export const renderer = (content: string) =>
  createMiddleware(async (c) => {
    const body = marked(content)
    const html = layout(body)
    return c.html(html)
  })

export const layout = (body: string) => {
  const App = () => {
    return (
      <div class="wrapper">
        <Header />
        <div class="content">{raw(body)}</div>
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
        <meta property="og:image" content="https://yusu.ke/static/images/profile_childfood_400x400.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@yusukebe" />
      </head>
      <body>
        ${(<App />)}
      </body>
    </html>`
}
