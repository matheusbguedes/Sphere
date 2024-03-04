import { getUser } from "@/lib/auth";
import Image from "next/image";

export function Profile() {
  const { name, avatarUrl } = getUser();

  return (
    <div className="flex items-center gap-4 text-right relative">
      <p className="max-w-[140px] text-zinc-400 text-base">{name}</p>{" "}
      <Image
        src={avatarUrl}
        width={60}
        height={60}
        draggable={false}
        alt=""
        className="size-12 rounded-full border-2 border-primary"
      />
      <span className="absolute bottom-0 right-1 size-3 rounded-full border-2 border-zinc-900 bg-primary" />
    </div>
  );
}
