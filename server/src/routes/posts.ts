import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
  app.get("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    const isLikedByUser = post.likes.find(
      (like) => like.user_id === request.user.sub
    );

    return reply.status(200).send({
      id: post.id,
      user_name: post.user.name,
      user_id: post.user_id,
      avatar_url: post.user.avatar_url,
      content: post.content,
      post_image_url: post.post_image_url,
      is_liked_by_user: isLikedByUser,
      likes_count: post.likes.length,
      comments_count: post.comments.length,
      ...(post.likes.length > 0 && {
        likes: post.likes.slice(-5),
      }),
      ...(post.comments.length > 0 && {
        comments: post.comments,
      }),
      created_at: post.created_at,
    });
  });

  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      post_image_url: z.string(),
      created_at: z.string(),
    });

    const { content, post_image_url, created_at } = bodySchema.parse(request.body);

    const post = await prisma.post.create({
      data: {
        user_id: request.user.sub,
        content,
        post_image_url,
        created_at,
      },
    });

    return reply.status(201).send(post);
  });

  app.delete("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (post.user_id !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return reply.status(204).send();
  });
}
