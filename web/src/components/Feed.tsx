import { NewPost } from "./NewPost";
import { Toaster } from "./ui/sonner";
import PostsLists from "./PostsList";

export default function Feed() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 p-6">
      <NewPost />
      <PostsLists/>
      <Toaster />
    </div>
  );
}
