import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getUser } from "@/lib/auth";
import { User } from "@/types/User";
import { LogOut, UsersRound } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import { SignIn } from "./signIn";
import { Button } from "./ui/button";
import sphere from "/public/sphere-logo.svg";

export function Header() {
  const isAuthenticated = cookies().has("token");
  let user: User;

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
        <div className="flex items-center justify-center gap-5 md:gap-12 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link">
                Amigos
                <UsersRound className="ml-2 size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="max-h-screen bg-zinc-900">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-zinc-400">
                  Amigos
                  <UsersRound className="ml-2 size-4 text-primary" />
                </SheetTitle>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4 text-right relative">
            <div className="flex flex-col items-end text-right gap-1">
              <p className="max-w-[140px] text-zinc-400 text-sm">
                {user!.name}
              </p>
              <a
                href="/api/auth/logout"
                className="flex items-center gap-2 text-sm text-zinc-500  transition-colors hover:hover:text-red-600"
              >
                sair <LogOut className="size-3" />
              </a>
            </div>

            <Image
              src={user!.avatarUrl}
              width={60}
              height={60}
              draggable={false}
              alt="profile-image"
              className="size-11 sm:size-12 rounded-full outline outline-2 outline-primary"
            />
          </div>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
