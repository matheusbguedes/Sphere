import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function feedRoutes(app: FastifyInstance) {
  app.get("/", {
    schema: {
      tags: ["Feed"],
      summary: "Obter feed de posts",
      description: "Retorna os posts dos usuários que o usuário atual segue e seus próprios posts",
      response: {
        200: {
          type: "array",
          items: {
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
              created_at: { type: "string" },
              likes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    user_id: { type: "string" },
                    post_id: { type: "string" }
                  }
                }
              },
              comments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    content: { type: "string" },
                    user_id: { type: "string" },
                    post_id: { type: "string" }
                  }
                }
              }
            }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            user: {
              followers: {
                some: {},
              },
            },
          },
          {
            user_id: request.user.sub,
          },
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    const formattedPosts = posts.map((post) => {
      const isLikedByUser = post.likes.find(
        (like) => like.user_id === request.user.sub
      );

      return {
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
          comments: post.comments.slice(-5),
        }),
        created_at: post.created_at,
      };
    });

    return reply.status(200).send(formattedPosts);
  });
} 