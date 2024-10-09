"use client";

import Feed from "@/components/feed/feed";
import { NotAuthenticated } from "@/components/notAuthenticated";
import { useUser } from "@/context/userContext";
import { Header } from "../components/header";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header />
      {user ? <Feed /> : <NotAuthenticated />}
    </main>
  );
}
