import { api } from "@/lib/api";
import { Friend, NonFriend } from "@/types/Friend";
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
  nonFriends: NonFriend[];
  posts: Posts[];
  getPosts: () => Promise<void>;
  getFriends: () => Promise<void>;
  getNonFriends: () => Promise<void>;
};

export const FeedContext = createContext<FeedContextValue | undefined>(
  undefined
);

export const FeedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Posts[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [nonFriends, setNonFriends] = useState<NonFriend[]>([]);

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

  const getNonFriends = async () => {
    const response = await api.get<Friend[]>("/non-friends", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNonFriends(response.data);
  };

  useEffect(() => {
    getPosts();
    getFriends();
    getNonFriends();
  }, []);

  return (
    <FeedContext.Provider
      value={{
        friends,
        nonFriends,
        posts,
        getFriends,
        getNonFriends,
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
