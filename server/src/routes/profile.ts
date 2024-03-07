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

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
        likes: true,
        followers: true,
        following: true,
      },
    });

    return {
      id: user!.id,
      name: user!.name,
      avatarUrl: user!.avatarUrl,
      postsCount: user!.posts.length,
      likesCount: user!.likes.length,
      followersCount: user!.followers.length,
      followingCount: user!.following.length,
    };
  });
}
