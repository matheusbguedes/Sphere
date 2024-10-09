import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function postsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/feed", async (request) => {
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
            userId: request.user.sub,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    return posts.map((post) => {
      const isLikedByUser = post.likes.find(
        (like) => like.userId == request.user.sub
      );

      return {
        id: post.id,
        userName: post.userName,
        userId: post.userId,
        avatarUrl: post.avatarUrl,
        content: post.content,
        postImageUrl: post.postImageUrl,
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
        createdAt: post.createdAt,
      };
    });
  });

  app.get("/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    const isLikedByUser = post.likes.find(
      (like) => like.userId == request.user.sub
    );

    return {
      id: post.id,
      userName: post.userName,
      userId: post.userId,
      avatarUrl: post.avatarUrl,
      content: post.content,
      postImageUrl: post.postImageUrl,
      isLikedByUser,
      likesCount: post.likes.length,
      commentsCount: post.comments.length,
      ...(post.likes.length > 0 && {
        likes: post.likes.slice(-5),
      }),
      ...(post.comments.length > 0 && {
        comments: post.comments,
      }),
      createdAt: post.createdAt,
    };
  });

  app.get("/user/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const userPosts = await prisma.post.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        likes: true,
        comments: true,
      },
    });

    return userPosts.map((post) => {
      return {
        id: post.id,
        userName: post.userName,
        userId: post.userId,
        avatarUrl: post.avatarUrl,
        content: post.content,
        postImageUrl: post.postImageUrl,
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
        createdAt: post.createdAt,
      };
    });
  });

  app.post("/", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      postImageUrl: z.string(),
      createdAt: z.string(),
    });

    const { content, postImageUrl, createdAt } = bodySchema.parse(request.body);

    const post = await prisma.post.create({
      data: {
        userId: request.user.sub,
        userName: request.user.name,
        avatarUrl: request.user.avatarUrl,
        content,
        postImageUrl,
        createdAt,
      },
    });

    return post;
  });

  app.delete("/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (post.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });
  });

  // Like

  app.post("/:id/like", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const liked = await prisma.like.findFirst({
      where: {
        userId: request.user.sub,
        postId: id,
      },
    });

    if (liked) {
      return await prisma.like.delete({
        where: {
          id: liked.id,
        },
      });
    }

    const like = await prisma.like.create({
      data: {
        userId: request.user.sub,
        userName: request.user.name,
        avatarUrl: request.user.avatarUrl,
        postId: id,
      },
    });

    return like;
  });

  // Comment

  app.post("/:id/comment", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      content: z.string(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { content } = bodySchema.parse(request.body);

    const comment = await prisma.postComment.create({
      data: {
        userId: request.user.sub,
        userName: request.user.name,
        avatarUrl: request.user.avatarUrl,
        postId: id,
        content,
      },
    });

    return comment;
  });
}
