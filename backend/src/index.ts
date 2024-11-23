import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { useId } from 'hono/jsx'
import { createPost, updatePost } from '@coderkuntl/common'
import bookRouter from './routes/blog'

const app = new Hono();

app.get('/', (c) => {
	return c.json({ id: "123" })
})

app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', bookRouter)




export default app
