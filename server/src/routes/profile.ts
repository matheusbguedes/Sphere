import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function profileRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/profile/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const posts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        likes: true,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
        likes: true,
        friends: true,
        userFriends: true,
      },
    });

    return {
      user: {
        id: user!.id,
        name: user!.name,
        avatarUrl: user!.avatarUrl,
        postsCount: user!.posts.length,
        likesCount: user!.likes.length,
        followersCount: user!.followers.length,
        followingCount: user!.following.length,
      },
      posts: posts.map((post) => {
        return {
          id: post.id,
          content: post.content,
          postImageUrl: post.postImageUrl,
          likes: post.likes.length,
          userIdLiked: post.likes,
          createdAt: post.createdAt,
        };
      }),
    };
  });
}
