import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function friendsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/friends", async (request) => {
    const friends = await prisma.friend.findMany({
      where: {
        friendId: request.user.sub,
      },
    });

    return friends.map(
      (friend: {
        id: string;
        userId: string;
        name: string;
        avatarUrl: string;
      }) => {
        return {
          id: friend.id,
          userId: friend.userId,
          name: friend.name,
          avatarUrl: friend.avatarUrl,
        };
      }
    );
  });

  app.post("/friend/add", async (request) => {
    const bodySchema = z.object({
      id: z.string(),
      userName: z.string(),
      avatarUrl: z.string(),
    });

    const { id, userName, avatarUrl } = bodySchema.parse(request.body);

    const friend = await prisma.friend.create({
      data: {
        followed: id,
        follower: request.user.sub,
        name: userName,
        avatarUrl,
      },
    });

    return friend;
  });

  app.delete("/friend/remove/:id", async (request) => {
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

  app.get("/non-friends", async (request) => {
    const friends = await prisma.friend.findMany({
      where: {
        followed: request.user.sub,
      },
    });

    const allUsers = await prisma.user.findMany();

    const nonFriends = allUsers.filter(
      (user) =>
        user.id !== request.user.sub &&
        !friends.some((friend) => friend.userId === user.id)
    );

    return nonFriends.map((user) => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }));
  });
}
