import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function likesRoutes(app: FastifyInstance) {
  app.post("/:postId/like", {
    schema: {
      tags: ["Likes"],
      summary: "Curtir um post",
      params: {
        type: "object",
        properties: {
          postId: { type: "string", format: "uuid", description: "ID do post" }
        },
        required: ["postId"]
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            post_id: { type: "string" }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
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

  app.delete("/:postId/like", {
    schema: {
      tags: ["Likes"],
      summary: "Remover curtida de um post",
      params: {
        type: "object",
        properties: {
          postId: { type: "string", format: "uuid", description: "ID do post" }
        },
        required: ["postId"]
      },
      response: {
        204: {
          type: "null",
          description: "Curtida removida com sucesso"
        },
        400: {
          type: "null",
          description: "Post não foi curtido pelo usuário"
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
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