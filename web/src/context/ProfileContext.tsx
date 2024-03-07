import { api } from "@/lib/api";
import { Posts } from "@/types/Posts";
import { UserProfile } from "@/types/Profile";
import Cookie from "js-cookie";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type ProfileContextValue = {
  profile: UserProfile | undefined;
  posts: Posts[];
  getPosts: () => Promise<void>;
  getProfile: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined
);

export const ProfileProvider: React.FC<{ children: ReactNode; id: string }> = ({
  children,
  id,
}) => {
  const [profile, setProfile] = useState<UserProfile>();
  const [posts, setPosts] = useState<Posts[]>([]);

  const token = Cookie.get("token");

  const getProfile = async () => {
    const response = await api.get<UserProfile>(`/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProfile(response.data);
  };

  const getPosts = async () => {
    const response = await api.get<Posts[]>(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts(response.data);
  };

  useEffect(() => {
    getProfile();
    getPosts();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        posts,
        getPosts,
        getProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProvider = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("usePosts must be used within a ProfileProvider");
  }
  return context;
};
