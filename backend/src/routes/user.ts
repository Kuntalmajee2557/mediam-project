import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();


userRouter.post('/signup', async (c) => {
  console.log("enter")
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    })
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt })
  } catch (err) {
    console.error("Error in signup:", err);
    c.status(403)
    return c.json({ error: 'error while signing up' })
  }
})

userRouter.post('/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    console.log('check 1')
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      }
    })

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }
    console.log('check 2')
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt })
  } catch (err) {
    c.status(403)
    return c.json({ error: 'error while signing up' })
  }
})