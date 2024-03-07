"use client";

import { ProfileProvider } from "@/context/ProfileContext";
import { User } from "@/types/User";
import Profile from "./Profile";

export default function Wrapper({ id, user }: { id: string; user: User }) {
  return (
    <ProfileProvider id={id}>
      <Profile user={user} />
    </ProfileProvider>
  );
}
