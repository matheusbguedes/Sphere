import { cookies } from "next/headers";
import Image from "next/image";
import { Profile } from "./Profile";
import { SignIn } from "./SignIn";
import sphere from "/public/sphere-logo.svg";

export function Header() {
  const isAuthenticated = cookies().has("token");

  return (
    <div className="w-full flex items-center justify-between p-4 sm:px-10 border-b border-zinc-800">
      <div className="flex items-center justify-center gap-4">
        <Image src={sphere} alt="sphere-logo" className="size-12" />
      </div>

      <div className="flex items-center justify-center gap-4 ">
        {isAuthenticated ? <Profile /> : <SignIn />}
      </div>
    </div>
  );
}
