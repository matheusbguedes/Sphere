"use client";

import { IComment } from "@/types/Comment";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

export function Comment({ comment }: { comment: IComment }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between px-1 py-2">
      <div className="flex items-start justify-between gap-3">
        <Image
          src={comment.avatarUrl ?? ""}
          width={60}
          height={60}
          draggable={false}
          alt="profile-image"
          onClick={() => {
            router.push(`/profile/${comment.userId}`);
          }}
          className="size-10 rounded-full cursor-pointer outline hover:outline-2 hover:outline-primary"
        />
        <div className="flex flex-col gap-2">
          <div className="flex flex-col bg-zinc-800 bg-opacity-20 py-3 px-4 rounded-lg">
            <p className="text-zinc-400 text-sm font-medium">
              {comment.userName}
            </p>
            <p className="text-zinc-500 text-base">{comment.content}</p>
          </div>
          <p className="text-zinc-500 text-xs">
            {dayjs(comment.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </div>
  );
}
