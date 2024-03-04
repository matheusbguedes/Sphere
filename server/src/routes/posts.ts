import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/posts", async (request) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return posts.map(
      (post: {
        id: string;
        userName: string;
        avatarUrl: string;
        content: string;
        postImageUrl: string | null;
        createdAt: Date;
      }) => {
        return {
          id: post.id,
          userName: post.userName,
          avatarUrl: post.avatarUrl,
          content: post.content,
          postImageUrl: post.postImageUrl,
          createdAt: post.createdAt,
        };
      }
    );
  });

  app.post("/post", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      postImageUrl: z.string(),
      userName: z.string(),
      avatarUrl: z.string(),
      createdAt: z.string(),
    });

    const { content, postImageUrl, userName, avatarUrl, createdAt } =
      bodySchema.parse(request.body);

    const post = await prisma.post.create({
      data: {
        content,
        postImageUrl,
        userName,
        avatarUrl,
        userId: request.user.sub,
        createdAt,
      },
    });

    return post;
  });

  app.delete("/post/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (post.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });
  });
}
