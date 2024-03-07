import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getUser } from "@/lib/auth";
import { UsersRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { Profile } from "./Profile";
import { SignIn } from "./SignIn";
import { Button } from "./ui/button";
import sphere from "/public/sphere-logo.svg";

export function Header() {
  const isAuthenticated = cookies().has("token");
  let user;

  if (isAuthenticated) {
    user = getUser();
  }

  return (
    <div className="w-full flex items-center justify-between p-4 sm:px-10 fixed top-0 border-b-2 border-zinc-800 bg-zinc-900 z-50">
      <div className="flex items-center justify-center gap-4">
        <Image
          src={sphere}
          alt="sphere-logo"
          draggable={false}
          className="size-10 sm:size-12"
        />
      </div>

      {isAuthenticated ? (
        <div className="flex items-center justify-center gap-3 md:gap-12 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">
                <UsersRound className="mr-2 size-4" />
                amigos
              </Button>
            </SheetTrigger>
            <SheetContent className="max-h-screen bg-zinc-900">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-zinc-400">
                  amigos
                  <UsersRound className="ml-2 size-4 text-primary" />
                </SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Profile user={user!} />
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
