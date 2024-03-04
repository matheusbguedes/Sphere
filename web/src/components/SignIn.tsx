import { LogIn } from "lucide-react";
import { Button } from "./ui/button";

export function SignIn() {
  return (
    <a
      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
      className="flex items-center gap-3 text-left transition-colors hover:text-gray-50"
    >
      <Button variant="outline">
        Login
        <LogIn className="ml-2 size-4" />
      </Button>
    </a>
  );
}
