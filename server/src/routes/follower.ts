import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function followerRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    const followers = await prisma.follower.findMany({
      where: {
        follower: request.user.sub,
      },
      include: {
        user: true,
      }
    });

    return followers.map((follower) => {
      return {
        id: follower.id,
        userId: follower.followed,
        name: follower.user.name,
        avatarUrl: follower.user.avatar_url,
      };
    });
  });

  app.post("/:id/follow", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const follower = await prisma.follower.create({
      data: {
        follower: request.user.sub,
        followed: id,
      },

    });

    return follower;
  });

  app.delete("/:id/unfollow", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    return await prisma.follower.delete({
      where: {
        id: id,
      },
    });
  });

  app.get("/sugestions", async (request) => {
    const allUsers = await prisma.user.findMany();

    const followers = await prisma.follower.findMany({
      where: {
        follower: request.user.sub,
      },
    });

    const nonFollowers = allUsers.filter(
      (user) =>
        user.id !== request.user.sub &&
        !followers.some((follower) => follower.followed === user.id)
    );

    return nonFollowers.map((user) => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar_url,
    }));
  });
}
