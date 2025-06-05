import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function userRoutes(app: FastifyInstance) {
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

    const findFollower = await prisma.follower.findFirst({
      where: {
        follower: request.user.sub,
        followed: id,
      },
    });

    const isFollower = !!findFollower;

    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar_url,
      isFollower,
      followerId: findFollower?.id,
      postsCount: user.posts.length,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    };
  });

  app.get("/:id/posts", async (request) => {
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

    return userPosts.map((post) => {
      return {
        id: post.id,
        userName: post.user.name,
        userId: post.user.id,
        avatarUrl: post.user.avatar_url,
        content: post.content,
        postImageUrl: post.post_image_url,
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
        createdAt: post.created_at,
      };
    });
  });
}
