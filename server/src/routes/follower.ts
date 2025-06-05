import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function followerRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const followers = await prisma.follower.findMany({
      where: {
        follower: request.user.sub,
      },
      include: {
        user: true,
      }
    });

    const formattedFollowers = followers.map((follower) => ({
      id: follower.id,
      user_id: follower.followed,
      name: follower.user.name,
      avatar_url: follower.user.avatar_url,
    }));

    return reply.status(200).send(formattedFollowers);
  });

  app.post("/:id/follow", async (request, reply) => {
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

    return reply.status(201).send(follower);
  });

  app.delete("/:id/unfollow", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.follower.delete({
      where: {
        id: id,
      },
    });

    return reply.status(204).send();
  });

  app.get("/sugestions", async (request, reply) => {
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

    const formattedSugestions = nonFollowers.map((user) => ({
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
    }));

    return reply.status(200).send(formattedSugestions);
  });
}
