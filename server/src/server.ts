import "dotenv/config";

import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastify from "fastify";
import { resolve } from "node:path";
import { authRoutes } from "./routes/auth";
import { friendRoutes } from "./routes/friends";
import { postsRoutes } from "./routes/posts";
import { profileRoutes } from "./routes/profile";
import { uploadRoutes } from "./routes/upload";

const app = fastify();

app.register(multipart);

app.register(require("@fastify/static"), {
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: "sphere-api-94cb44d5-ae9c-456e",
});

app.register(authRoutes);
app.register(uploadRoutes);
app.register(postsRoutes, { prefix: "/post" });
app.register(profileRoutes, { prefix: "/profile" });
app.register(friendRoutes, { prefix: "/friend" });

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is up! 🚀");
  });
