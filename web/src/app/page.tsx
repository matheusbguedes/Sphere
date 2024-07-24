import Feed from "@/components/feed";
import { NotAuthenticated } from "@/components/notAuthenticated";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/header";

export default function Home() {
  const isAuthenticated = cookies().has("token");

  let user;

  if (isAuthenticated) {
    user = getUser();
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header />
      {isAuthenticated ? <Feed user={user!} /> : <NotAuthenticated />}
      <Toaster position="bottom-center" />
    </main>
  );
}
