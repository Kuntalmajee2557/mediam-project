import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  },
  Variables : {
		userId: string
	}
}>();

app.route('/api/v1/user', userRouter)
// app.use('/api/v1/book', bookRouter)

app.use('/api/v1/blog/*', async (c, next) => {
  const jwt = c.header('Authorization') as string | undefined;

  if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
  const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET) as { id: string } | null;;
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id);
	await next()
})  



app.post('/api/v1/blog', (c) => {
  console.log(c.get('userId'));
	return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
  return c.text('PUT /api/v1/blog')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('GET /api/v1/blog/:id')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('GET /api/v1/blog/bulk')
})

export default app
