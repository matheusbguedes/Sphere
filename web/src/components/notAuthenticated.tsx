"use client";

import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import Globe from "./magicui/globe";
import { Button } from "./ui/button";

export function NotAuthenticated() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="relative h-screen w-screen flex flex-col justify-center items-center overflow-hidden gap-4">
      <h1 className="flex font-medium text-zinc-400 text-2xl md:text-3xl">
        Você ainda não está
        <span className="ml-2 text-primary">conectado</span>.
      </h1>
      <p className=" text-zinc-600 text-base">
        Entre facilmente com sua conta do Github.
      </p>

      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
        onClick={() => setIsLoading(true)}
        className="flex items-center gap-3 pt-4"
      >
        {isLoading ? (
          <Loader2 className="size-8 animate-spin text-primary" />
        ) : (
          <Button variant="outline">
            Entrar com GitHub
            <Github className="ml-2 size-4" />
          </Button>
        )}
      </a>

      <Globe className="absolute -bottom-40 md:-bottom-80" />
    </div>
  );
}
