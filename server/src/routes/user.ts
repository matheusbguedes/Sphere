import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, _) => {
    await request.jwtVerify();
  });
  
  app.get("/:id", {
    schema: {
      tags: ["User"],
      summary: "Obter informações de um usuário",
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", description: "ID do usuário" }
        },
        required: ["id"]
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            avatar_url: { type: "string" },
            is_follower: { type: "boolean" },
            follower_id: { type: "string", nullable: true },
            posts_count: { type: "number" },
            followers_count: { type: "number" },
            following_count: { type: "number" }
          }
        },
        404: {
          type: "object",
          properties: {
            error: { type: "string" }
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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    const findFollower = await prisma.follower.findFirst({
      where: {
        follower: request.user.sub,
        followed: id,
      },
    });

    const is_follower = !!findFollower;

    return reply.status(200).send({
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      is_follower,
      follower_id: findFollower?.id,
      posts_count: user.posts.length,
      followers_count: user.followers.length,
      following_count: user.following.length,
    });
  });

  app.get("/:id/posts", {
    schema: {
      tags: ["User"],
      summary: "Obter posts de um usuário",
      params: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid", description: "ID do usuário" }
        },
        required: ["id"]
      },
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
              likes_count: { type: "number" },
              comments_count: { type: "number" },
              created_at: { type: "string" }
            }
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

    const userPosts = await prisma.post.findMany({
      where: {
        user_id: id,
      },
      orderBy: {
        created_at: "asc",
      },
      include: {
        user: true,
        likes: true,
        comments: true,
      },
    });

    const formattedPosts = userPosts.map((post) => ({
      id: post.id,
      user_name: post.user.name,
      user_id: post.user.id,
      avatar_url: post.user.avatar_url,
      content: post.content,
      post_image_url: post.post_image_url,
      likes_count: post.likes.length,
      comments_count: post.comments.length,
      ...(post.likes.length > 0 && {
        likes: post.likes.slice(-5),
      }),
      ...(post.comments.length > 0 && {
        comments: post.comments.slice(-5),
      }),
      created_at: post.created_at,
    }));

    return reply.status(200).send(formattedPosts);
  });
}
