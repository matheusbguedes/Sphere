import Feed from "@/components/Feed";
import { NotAuthenticated } from "@/components/NotAuthenticated";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/Header";

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
