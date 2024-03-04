import { getUser } from "@/lib/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function Profile() {
  const { name, avatarUrl } = getUser();

  return (
    <div className="flex items-center gap-4 text-right relative">
      <div className="flex flex-col gap-1">
        <p className="max-w-[140px] text-zinc-400 text-base">{name}</p>{" "}
        <div className="flex items-center justify-end gap-2 max-w-[140px]">
          <a
            href="/api/auth/logout"
            className="flex items-center justify-center p-1 gap-2 max-w-[140px] text-sm text-red-600 cursor-pointer rounded-lg hover:bg-red-600/20"
          >
            Sair <LogOut className="size-4" />
          </a>
        </div>
      </div>

      <Image
        src={avatarUrl}
        width={60}
        height={60}
        draggable={false}
        alt=""
        className="size-14 rounded-full border-2 border-primary"
      />
      <span className="absolute bottom-0 right-1 size-3 rounded-full border-2 border-zinc-900 bg-primary" />
    </div>
  );
}
