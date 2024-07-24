import { api } from "@/lib/api";
import { Friend } from "@/types/Friend";
import { Posts } from "@/types/Posts";
import Cookie from "js-cookie";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type FeedContextValue = {
  friends: Friend[];
  sugestions: Friend[];
  posts: Posts[];
  getPosts: () => Promise<void>;
  getFriends: () => Promise<void>;
  getSugestions: () => Promise<void>;
};

export const FeedContext = createContext<FeedContextValue | undefined>(
  undefined
);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sugestions, setSugestions] = useState<Friend[]>([]);

  const token = Cookie.get("token");

  const getPosts = async () => {
    const response = await api.get<Posts[]>("/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setPosts(response.data);
  };

  const getFriends = async () => {
    const response = await api.get<Friend[]>("/friends", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFriends(response.data);
  };

  const getSugestions = async () => {
    const response = await api.get<Friend[]>("/non-friends", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setSugestions(response.data);
  };

  useEffect(() => {
    getPosts();
    getFriends();
    getSugestions();
  }, []);

  return (
    <FeedContext.Provider
      value={{
        friends,
        sugestions,
        posts,
        getFriends,
        getSugestions,
        getPosts,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useProvider = (): FeedContextValue => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("usePosts must be used within a FeedProvider");
  }
  return context;
};
