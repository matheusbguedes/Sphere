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

type PostsContextValue = {
  friends: Friend[];
  nonFriends: NonFriend[];
  posts: Posts[];
  getPosts: () => Promise<void>;
  getFriends: () => Promise<void>;
  getNonFriends: () => Promise<void>;
};

export const PostsContext = createContext<PostsContextValue | undefined>(
  undefined
);

export const PostsProvider: React.FC<{ children: ReactNode }> = ({
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
    <PostsContext.Provider
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
    </PostsContext.Provider>
  );
};

export const useProvider = (): PostsContextValue => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
