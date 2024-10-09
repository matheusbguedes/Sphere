"use client";

import { Header } from "@/components/header";
import { Post } from "@/components/post/post";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContext";
import api from "@/lib/api";
import { IPost } from "@/types/Post";
import { IProfile } from "@/types/Profile";
import { Circle, UserPlus2, UserRoundX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Profile({ params }: { params: { id: string } }) {
  const { user } = useUser();

  const router = useRouter();
  const [profile, setProfile] = useState<IProfile>();
  const [posts, setPosts] = useState<IPost[]>();

  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await api.get(`/profile/${params.id}`);
      setProfile(response.data);

      if (response.data.postsCount! > 0) {
        getPosts();
      }
    } catch (error) {
      toast.error("Erro ao resgatar perfil");
      return router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const getPosts = async () => {
    try {
      const response = await api.get(`/post/user/${params.id}`);
      setPosts(response.data);
    } catch (error) {
      toast.error("Erro ao resgatar postagens");
      return router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (!profile) return;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-900">
      <Header />
      <div className="w-full h-full flex flex-1 flex-col items-center gap-4 py-6 px-2 mt-20">
        <div className="w-full md:max-w-2xl flex justify-center items-center relative">
          <div className="w-full flex flex-col">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <div className="w-full flex items-center justify-between mb-4 pb-6 border-b-2 border-zinc-800">
                <div className="flex items-center gap-4">
                  <Image
                    src={user!.avatarUrl}
                    width={1000}
                    height={1000}
                    draggable={false}
                    alt="profile-image"
                    className="size-32 rounded-full outline outline-4 outline-zinc-900"
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-medium text-zinc-400 text-2xl">
                      {profile.name}
                    </h1>
                    <p className="flex items-center text-zinc-500 text-base">
                      <Circle className="size-2 fill-primary text-primary mr-2" />
                      {profile.followersCount}
                      {profile.followersCount == 1 ? " amigo" : " amigos"}
                    </p>
                  </div>
                </div>

                {profile.id != user.sub && (
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className={`mt-6 border-zinc-600 text-zinc-600 hover:bg-transparent ${
                      profile.isFriend
                        ? "hover:border-red-600 hover:text-red-600"
                        : "hover:border-primary hover:text-primary"
                    }`}
                  >
                    {profile.isFriend ? (
                      <UserRoundX className="size-5" />
                    ) : (
                      <UserPlus2 className="size-5" />
                    )}
                  </Button>
                )}
              </div>

              {posts && posts.map((post) => <Post key={post.id} post={post} />)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
