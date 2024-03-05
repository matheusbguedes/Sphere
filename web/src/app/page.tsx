import  Feed  from "@/components/Feed";
import { cookies } from "next/headers";
import { Header } from "../components/Header";

export default function Home() {
  const isAuthenticated = cookies().has("token");
  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header />
      {isAuthenticated ? <Feed /> : ""}
    </main>
  );
}
