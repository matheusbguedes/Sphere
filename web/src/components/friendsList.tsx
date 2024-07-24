import { useProvider } from "@/context/FeedContext";
import { FriendCard } from "./friendCard";

export default function FriendsList() {
  const { friends, sugestions } = useProvider();

  return (
    <div className="w-full h-full flex flex-col items-center py-6 gap-5 overflow-scroll scrollbar">
      {friends.length > 0 && (
        <div className="w-full flex flex-col">
          {friends.map((friend) => {
            return <FriendCard key={friend.id} friend={friend} isFriend />;
          })}
        </div>
      )}

      {sugestions.length > 0 && (
        <div className="w-full flex flex-col">
          <p className="text-zinc-700 font-medium text-base pb-3">
            Sugestões pra você
          </p>

          {sugestions.map((sugestion) => {
            return <FriendCard key={sugestion.id} friend={sugestion} />;
          })}
        </div>
      )}
    </div>
  );
}
