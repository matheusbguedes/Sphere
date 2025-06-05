import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function commentsRoutes(app: FastifyInstance) {
  app.post("/:postId/comment", async (request, reply) => {
    const paramsSchema = z.object({
      postId: z.string().uuid(),
    });

    const bodySchema = z.object({
      content: z.string(),
    });

    const { postId } = paramsSchema.parse(request.params);
    const { content } = bodySchema.parse(request.body);

    const comment = await prisma.comment.create({
      data: {
        user_id: request.user.sub,
        post_id: postId,
        content,
      },
    });

    return reply.status(201).send(comment);
  });

  app.delete("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const comment = await prisma.comment.findFirst({
      where: {
        id,
      },
    });

    if (!comment) {
      return reply.status(404).send();
    }

    if (comment.user_id !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.comment.delete({
      where: {
        id,
      },
    });

    return reply.status(204).send();
  });
} 