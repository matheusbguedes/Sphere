import axios from "axios";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", {
    schema: {
      tags: ["Auth"],
      summary: "Registrar/Autenticar usuário com GitHub",
      description: "Realiza autenticação OAuth com GitHub e retorna um token JWT",
      body: {
        type: "object",
        properties: {
          code: { type: "string", description: "Código de autorização do GitHub" }
        },
        required: ["code"]
      },
      response: {
        200: {
          type: "object",
          properties: {
            token: { type: "string", description: "Token JWT para autenticação" }
          }
        }
      }
    }
  }, async (request, reply) => {
    const bodySchema = z.object({
      code: z.string(),
    });

    const { code } = bodySchema.parse(request.body);

    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = accessTokenResponse.data;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });

    const userInfo = userSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
      where: {
        github_id: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          github_id: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
        },
      });
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatar_url: user.avatar_url,
      },
      {
        sub: user.id,
        expiresIn: "10 days",
      }
    );

    return reply.status(200).send({
      token,
    });
  });
}
