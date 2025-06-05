import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function likesRoutes(app: FastifyInstance) {
  app.post("/:postId/like", async (request, reply) => {
    const paramsSchema = z.object({
      postId: z.string().uuid(),
    });

    const { postId } = paramsSchema.parse(request.params);

    const like = await prisma.like.create({
      data: {
        user_id: request.user.sub,
        post_id: postId,
      },
    });

    return reply.status(201).send(like);
  });

  app.delete("/:postId/like", async (request, reply) => {
    const paramsSchema = z.object({
      postId: z.string().uuid(),
    });

    const { postId } = paramsSchema.parse(request.params);

    const liked = await prisma.like.findFirst({
      where: {
        user_id: request.user.sub,
        post_id: postId,
      },
    });

    if (!liked) {
      return reply.status(400).send();
    }

    await prisma.like.delete({
      where: {
        id: liked.id,
      },
    });

    return reply.status(204).send();
  });
} 