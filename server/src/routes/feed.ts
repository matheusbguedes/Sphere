import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function feedRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
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

    return posts.map((post) => {
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
        isLikedByUser,
        likesCount: post.likes.length,
        commentsCount: post.comments.length,
        // Last 5 likes
        ...(post.likes.length > 0 && {
          likes: post.likes.slice(-5),
        }),
        // Last 5 comments
        ...(post.comments.length > 0 && {
          comments: post.comments.slice(-5),
        }),
        created_at: post.created_at,
      };
    });
  });
} 