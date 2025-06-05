import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
  app.get("/:id", async (request, reply) => {
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

  app.get("/:id/posts", async (request, reply) => {
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
