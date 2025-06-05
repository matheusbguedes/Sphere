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
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export const app = fastify();

// Swagger config
app.register(swagger, {
  swagger: {
    info: {
      title: "Sphere",
      description: "API de rede social da Sphere",
      version: "1.0.0"
    },
    tags: [
      { name: "Auth", description: "Endpoints de autenticação" },
      { name: "User", description: "Endpoints de usuário" },
      { name: "Posts", description: "Endpoints de postagens" },
      { name: "Feed", description: "Endpoints do feed" },
      { name: "Likes", description: "Endpoints de likes" },
      { name: "Comments", description: "Endpoints de comentários" },
      { name: "Followers", description: "Endpoints de seguidores" },
      { name: "Upload", description: "Endpoints de upload" }
    ],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header"
      }
    }
  }
});

app.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false
  },
  staticCSP: true
});

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
app.register(userRoutes, { prefix: "/user" });
app.register(feedRoutes, { prefix: "/feed" });
app.register(postsRoutes, { prefix: "/post" });
app.register(likesRoutes, { prefix: "/likes" });
app.register(commentsRoutes, { prefix: "/comments" });
app.register(followerRoutes, { prefix: "/follower" });
