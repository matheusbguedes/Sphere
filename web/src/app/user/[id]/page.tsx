import { UserPage } from "@/components/UserPage";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";

export default function User({ params }: { params: { id: string } }) {
  const isAuthenticated = cookies().has("token");

  let user;

  if (isAuthenticated) {
    user = getUser();
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
        <UserPage id={params.id}/>
    </main>
  );
}
