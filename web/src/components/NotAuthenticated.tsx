import { Github } from "lucide-react";
import { Button } from "./ui/button";

export function NotAuthenticated() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
      <h1 className="flex font-medium text-zinc-400 text-2xl md:text-3xl">
        Você ainda não está
        <span className="ml-2 text-primary">conectado</span>.
      </h1>
      <p className=" text-zinc-500 text-sm md:text-base">
        Conecte-se facilmente com sua conta do Github.
      </p>
      <a
        href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
        className="flex items-center gap-3 pt-4"
      >
        <Button variant="outline">
          Conectar com Github
          <Github className="ml-2 size-4" />
        </Button>
      </a>
    </div>
  );
}
