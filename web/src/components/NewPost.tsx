import { getUser } from "@/lib/auth";
import { NewPostForm } from "./NewPostForm";

export function NewPost() {
  const { avatarUrl, name } = getUser();
  return <NewPostForm avatarUrl={avatarUrl} name={name} />;
}
