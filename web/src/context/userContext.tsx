"use client";

import { IUser } from "@/types/User";
import { createContext, ReactNode, useContext, useState } from "react";

interface ContextType {
  user: IUser;
}

const Context = createContext<ContextType | undefined>(undefined);

export function UserProvider({
  children,
  loggedUser,
}: {
  children: ReactNode;
  loggedUser: IUser;
}) {
  const [user, setUser] = useState<IUser>(loggedUser);

  return <Context.Provider value={{ user }}>{children}</Context.Provider>;
}

export function useUser() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
