import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function profileRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/:id", async (request, response) => {
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
      return response.status(404).send({ error: "User not found" });
    }

    const findFriend = await prisma.friend.findFirst({
      where: {
        follower: request.user.sub,
        followed: id,
      },
    });

    const isFriend = !!findFriend;

    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      isFriend,
      friendshipId: findFriend?.id,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  });
}
