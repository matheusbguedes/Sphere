import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function commentsRoutes(app: FastifyInstance) {
  app.post("/:postId/comment", {
    schema: {
      tags: ["Comments"],
      summary: "Adicionar um comentário a um post",
      params: {
        type: "object",
        properties: {
          postId: { type: "string", format: "uuid", description: "ID do post" }
        },
        required: ["postId"]
      },
      body: {
        type: "object",
        properties: {
          content: { type: "string", description: "Conteúdo do comentário" }
        },
        required: ["content"]
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            content: { type: "string" },
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

  app.delete("/:id", {
    schema: {
      tags: ["Comments"],
      summary: "Deletar um comentário",
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", description: "ID do comentário" }
        },
        required: ["id"]
      },
      response: {
        204: {
          type: "null",
          description: "Comentário deletado com sucesso"
        },
        401: {
          type: "null",
          description: "Usuário não autorizado a deletar este comentário"
        },
        404: {
          type: "null",
          description: "Comentário não encontrado"
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
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