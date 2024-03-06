import { getUser } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Profile() {
  const { name, avatarUrl } = getUser();

  return (
    <div className="flex items-center gap-4 text-right relative">
      <div className="flex flex-col items-end text-right gap-1">
        <p className="max-w-[140px] text-zinc-400 text-sm">{name}</p>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:hover:text-red-600"
        >
          sair <LogOut className="size-3" />
        </a>
      </div>

      <Image
        src={avatarUrl}
        width={60}
        height={60}
        draggable={false}
        alt="avatar-image"
        className="size-11 sm:size-12 rounded-full border-2 border-primary"
      />
      <span className="absolute bottom-0 right-0 sm:right-1 size-3 rounded-full border-2 border-zinc-900 bg-primary" />
    </div>
  );
}
