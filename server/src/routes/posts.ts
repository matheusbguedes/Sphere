import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, _) => {
    await request.jwtVerify();
  });

  app.get("/:id", {
    schema: {
      tags: ["Posts"],
      summary: "Obter uma postagem específica",
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", description: "ID do post" }
        },
        required: ["id"]
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_name: { type: "string" },
            user_id: { type: "string" },
            avatar_url: { type: "string" },
            content: { type: "string" },
            post_image_url: { type: "string" },
            is_liked_by_user: { type: "boolean" },
            likes_count: { type: "number" },
            comments_count: { type: "number" },
            created_at: { type: "string" }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
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

  app.post("/", {
    schema: {
      tags: ["Posts"],
      summary: "Criar uma nova postagem",
      body: {
        type: "object",
        properties: {
          content: { type: "string", description: "Conteúdo da postagem" },
          post_image_url: { type: "string", description: "URL da imagem da postagem" },
        },
        required: ["content"]
      },
      response: {
        201: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            content: { type: "string" },
            post_image_url: { type: "string" },
            created_at: { type: "string" }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      post_image_url: z.string().optional(),
    });

    const { content, post_image_url } = bodySchema.parse(request.body);

    const post = await prisma.post.create({
      data: {
        user_id: request.user.sub,
        content,
        post_image_url,
      },
    });

    return reply.status(201).send(post);
  });

  app.delete("/:id", {
    schema: {
      tags: ["Posts"],
      summary: "Deletar uma postagem",
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", description: "ID do post" }
        },
        required: ["id"]
      },
      response: {
        204: {
          type: "null",
          description: "Post deletado com sucesso"
        },
        401: {
          type: "object",
          properties: {
            message: { type: "string" }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
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
