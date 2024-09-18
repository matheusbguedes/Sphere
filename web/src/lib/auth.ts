import { IUser } from "@/types/User";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export function getUser(): IUser {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthenticated");
  }

  const user: IUser = jwtDecode(token);

  return user;
}
