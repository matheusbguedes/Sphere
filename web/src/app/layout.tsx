import { FeedProvider } from "@/context/feedContext";
import { UserProvider } from "@/context/userContext";
import { getUser } from "@/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sphere",
  description: "Conecte-se a esfera.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user;
  const hasCookie = cookies().has("token");

  if (hasCookie) {
    user = getUser();
  }

  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <UserProvider loggedUser={user!}>
          <FeedProvider>{children}</FeedProvider>
        </UserProvider>

        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgb(39 39 42)",
              color: "rgb(161 161 170)",
            },
            iconTheme: {
              primary: "#0066FF",
              secondary: "rgb(39 39 42)",
            },
          }}
        />
      </body>
    </html>
  );
}
