import { createPost, updatePost } from "@coderkuntl/common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

bookRouter.use('*', async (c, next) => {
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

bookRouter.post('/', async (c) => {
    const userId = c.get('userId') as string | undefined;
    console.log(userId)
    if (!userId) {
        c.status(400);
        return c.json({ error: "User ID is required" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = createPost.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({ error: "Invalid Input" })
    }
    try {
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

bookRouter.put('/', async (c) => {
    const userId = c.get('userId') as string | undefined;
    if (!userId) {
        c.status(400);
        return c.json({ error: "User ID is required" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = updatePost.safeParse(body)
    if (!success) {
        c.status(400)
        return c.json({ error: "Invalid Input" })
    }
    try {
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
    catch {
        return c.json({ error: 'error while creating blog' })

    }


})

bookRouter.get('/bulk', async (c) => {
    const userId = c.get('userId') as string | undefined;
    if (!userId) {
        c.status(400);
        return c.json({ error: "User ID is required" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const posts = await prisma.post.findMany({})
        console.log(posts)
        return c.json(posts)

    }
    catch (err) {
        return c.json({ error: "some error occour" })
    }
})

bookRouter.get('/:id', async (c) => {
    const id = c.req.param("id") as string | undefined;
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })
        return c.json({ post })
    }
    catch (err) {
        return c.json({ error: "some error occour" })
    }
})

export default bookRouter;