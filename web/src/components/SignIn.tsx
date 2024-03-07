import { Github } from "lucide-react";
import { Button } from "./ui/button";

export function SignIn() {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      className="flex items-center gap-3"
    >
      <Button variant="outline">
        Github
        <Github className="ml-2 size-4" />
      </Button>
    </a>
  );
}
