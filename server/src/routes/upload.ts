import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { extname, resolve } from "node:path";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", {
    schema: {
      tags: ["Upload"],
      summary: "Fazer upload de uma imagem",
      description: "Permite o upload de imagens com tamanho máximo de 5MB",
      consumes: ["multipart/form-data"],
      body: {
        type: "object",
        properties: {
          file: { type: "string", format: "binary", description: "Arquivo de imagem" }
        },
        required: ["file"]
      },
      response: {
        200: {
          type: "object",
          properties: {
            fileUrl: { type: "string", description: "URL da imagem enviada" }
          }
        },
        400: {
          type: "null",
          description: "Arquivo não fornecido ou formato inválido"
        }
      }
    }
  }, async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    const mimeTypeRegex = /^(image)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    const fileId = randomUUID();
    const extension = extname(upload.filename);

    const fileName = fileId.concat(extension);

    const writeStream = createWriteStream(
      resolve(__dirname, "../../uploads/", fileName)
    );

    await pump(upload.file, writeStream);

    const fullUrl = request.protocol.concat("://").concat(request.hostname);
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  });
}
