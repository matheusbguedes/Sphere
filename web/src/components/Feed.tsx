import { CardPost } from "./CardPost";
import { NewPost } from "./NewPost";

export function Feed() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-6">
      <NewPost />
      <CardPost />
    </div>
  );
}
