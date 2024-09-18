import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function friendRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/", async (request) => {
    const friends = await prisma.friend.findMany({
      where: {
        follower: request.user.sub,
      },
    });

    return friends.map((friend) => {
      return {
        id: friend.id,
        userId: friend.followed,
        name: friend.name,
        avatarUrl: friend.avatarUrl,
      };
    });
  });

  app.post("/add", async (request) => {
    const bodySchema = z.object({
      id: z.string(),
      userName: z.string(),
      avatarUrl: z.string(),
    });

    const { id, userName, avatarUrl } = bodySchema.parse(request.body);

    const friend = await prisma.friend.create({
      data: {
        follower: request.user.sub,
        followed: id,
        name: userName,
        avatarUrl,
      },
    });

    return friend;
  });

  app.delete("/:id/remove", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    return await prisma.friend.delete({
      where: {
        id: id,
      },
    });
  });

  app.get("/sugestions", async (request) => {
    const allUsers = await prisma.user.findMany();

    const friends = await prisma.friend.findMany({
      where: {
        follower: request.user.sub,
      },
    });

    const nonFriends = allUsers.filter(
      (user) =>
        user.id !== request.user.sub &&
        !friends.some((friend) => friend.followed === user.id)
    );

    return nonFriends.map((user) => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }));
  });
}
