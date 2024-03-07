import { useProvider } from "@/context/FeedContext";
import { api } from "@/lib/api";
import { Friend } from "@/types/Friend";
import Cookie from "js-cookie";
import { UserRoundX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function FriendCard({ friend }: { friend: Friend }) {
  const router = useRouter();
  const { getFriends, getNonFriends } = useProvider();

  const handleRemoveFriend = async () => {
    const token = Cookie.get("token");
    await api.delete(`/friend/remove/${friend.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    getFriends();

    getNonFriends();

    return toast.success(`Você deixou de seguir ${friend.name.split(" ")[0]}`, {
      style: {
        background: "rgb(39 39 42)",
        color: "rgb(161 161 170)",
      },
      iconTheme: {
        primary: "#0066FF",
        secondary: "rgb(39 39 42)",
      },
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-xl transition-colors hover:bg-zinc-800">
      <div className="flex items-center gap-3">
        <Image
          src={friend.avatarUrl}
          width={60}
          height={60}
          draggable={false}
          alt="avatar-image"
          onClick={() => {
            router.push(`/user/${friend.userId}`);
          }}
          className="size-12 rounded-full hover:outline outline-2 outline-primary cursor-pointer"
        />

        <p className="max-w-[140px] text-zinc-400 text-base">{friend.name}</p>
      </div>

      <UserRoundX
        onClick={handleRemoveFriend}
        className="size-6 p-1 cursor-pointer transition-colors text-zinc-500 hover:hover:text-red-600"
      />
    </div>
  );
}
