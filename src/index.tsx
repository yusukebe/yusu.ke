import { Hono } from 'hono'
import { renderer } from './renderer'
import about from '../contents/about.md'

const app = new Hono()

app.get('/', renderer(about))

export default app
