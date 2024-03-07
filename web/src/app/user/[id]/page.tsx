import Wrapper from "@/components/profile/Wrapper";
import { getUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";

export default function User({ params }: { params: { id: string } }) {
  const isAuthenticated = cookies().has("token");
  let user;

  if (isAuthenticated) {
    user = getUser();
  }

  return (
    <>
      <Wrapper id={params.id} user={user!} />
      <Toaster position="bottom-center" />
    </>
  );
}
