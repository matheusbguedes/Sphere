import { useProvider } from "@/lib/context";
import { FriendCard } from "./FriendCard";
import { NonFriendCard } from "./NonFriendCard";

export default function Friends() {
  const { friends, nonFriends } = useProvider();

  return (
    <div className="w-full h-full flex flex-col items-center py-6 gap-5 overflow-scroll scrollbar">
      {friends.length > 0 && (
        <div className="w-full flex flex-col">
          {friends.map((friend) => {
            return <FriendCard key={friend.id} friend={friend} />;
          })}
        </div>
      )}

      {nonFriends.length > 0 && (
        <div className="w-full flex flex-col">
          <p className="text-zinc-700 font-medium text-base pb-3">
            Sugestões pra você
          </p>

          {nonFriends.map((nonFriend) => {
            return <NonFriendCard key={nonFriend.id} friend={nonFriend} />;
          })}
        </div>
      )}
    </div>
  );
}
