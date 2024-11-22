import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { useId } from 'hono/jsx'

const app = new Hono<{
	Bindings: {
		DATABASE_URL: string
		JWT_SECRET: string
	},
	Variables: {
		userId: string
	}
}>();

app.get('/', (c) => {
	return c.json({ id: "123" })
})

app.route('/api/v1/user', userRouter)
// app.use('/api/v1/book', bookRouter)

app.use('/api/v1/blog/*', async (c, next) => {
	const jwt = c.req.header('Authorization') as string | undefined;
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



app.post('/api/v1/blog', async (c) => {

	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try {
		const body = await c.req.json();
		const post = await prisma.post.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: userId
			}
		});
		return c.json({
			id: post.id
		});
	}
	catch {
		return c.json({ error: 'error while signing up' })

	}

})

app.put('/api/v1/blog', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try{
		const body = await c.req.json();
		await prisma.post.update({
			where: {
				id: body.id,
				authorId: userId
			},
			data: {
				title: body.title,
				content: body.content
			}
		});
	
		return c.text('updated post');
	}
	catch{
		return c.json({ error: 'error while creating blog' })

	}


})

app.get('/api/v1/blog/bulk', async (c) => {
	// console.log("checkpoint 1")
	const userId = c.get("userId") as string | undefined
	// console.log(userId)
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try{
		const posts = await prisma.post.findMany({})
		console.log(posts)
		return c.json(posts)

	}
	catch(err){
		return c.json({error: "some error occour"})
	}
})

app.get('/api/v1/blog/:id', async (c) => {
	const id = c.req.param("id") as string | undefined;
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
	try{
		const post = await prisma.post.findUnique({
			where: {
				id
			}
		})
		return c.json({post})
	}
	catch(err){
		return c.json({error: "some error occour"})
	}
})



export default app
