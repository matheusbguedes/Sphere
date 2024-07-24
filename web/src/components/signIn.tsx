"use client";

import { Github, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      onClick={() => setIsLoading(true)}
      className="flex items-center gap-3"
    >
      {isLoading ? (
        <Loader2 className="size-8 animate-spin text-primary" />
      ) : (
        <Button variant="outline">
          GitHub
          <Github className="ml-2 size-4" />
        </Button>
      )}
    </a>
  );
}
