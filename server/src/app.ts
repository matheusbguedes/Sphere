import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { env } from "./env";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { followerRoutes } from "./routes/follower";
import { postsRoutes } from "./routes/posts";
import { userRoutes } from "./routes/user";
import { uploadRoutes } from "./routes/upload";
import { likesRoutes } from "./routes/likes";
import { commentsRoutes } from "./routes/comments";
import { feedRoutes } from "./routes/feed";

export const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: env.SERVER_SECRET,
});

app.decorate("verifyAuth", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized" });
  }
});

declare module "fastify" {
  interface FastifyInstance {
    verifyAuth(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }
}

app.register(authRoutes);
app.register(uploadRoutes);
app.register(userRoutes, { prefix: "/user", preHandler: [app.verifyAuth] });
app.register(feedRoutes, { prefix: "/feed", preHandler: [app.verifyAuth] });
app.register(postsRoutes, { prefix: "/post", preHandler: [app.verifyAuth] });
app.register(likesRoutes, { prefix: "/like", preHandler: [app.verifyAuth] });
app.register(commentsRoutes, { prefix: "/comment", preHandler: [app.verifyAuth] });
app.register(followerRoutes, { prefix: "/follower", preHandler: [app.verifyAuth] });
