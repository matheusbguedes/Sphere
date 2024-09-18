import Feed from "@/components/feed/feed";
import { NotAuthenticated } from "@/components/notAuthenticated";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { Header } from "../components/header";

export default function Home() {
  let user;
  const isAuthenticated = cookies().has("token");

  if (isAuthenticated) {
    user = getUser();
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header user={user!} />
      {isAuthenticated ? <Feed user={user!} /> : <NotAuthenticated />}
    </main>
  );
}
