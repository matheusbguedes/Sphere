import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { env } from "./env";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { friendRoutes } from "./routes/friends";
import { postsRoutes } from "./routes/posts";
import { profileRoutes } from "./routes/profile";
import { uploadRoutes } from "./routes/upload";

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

app.register(authRoutes);
app.register(uploadRoutes);
app.register(postsRoutes, { prefix: "/post" });
app.register(profileRoutes, { prefix: "/profile" });
app.register(friendRoutes, { prefix: "/friend" });
