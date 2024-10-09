"use client";

import api from "@/lib/api";
import { IPost } from "@/types/Post";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

interface ContextType {
  posts: IPost[];
  isLoading: boolean;
  refreshPosts: () => Promise<void>;
}

const Context = createContext<ContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getFeed = async () => {
    try {
      const response = await api.get<IPost[]>("/post/feed");
      setPosts(response.data);
    } catch {
      toast.error("Erro ao resgatar postagens");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <Context.Provider value={{ posts, isLoading, refreshPosts: getFeed }}>
      {children}
    </Context.Provider>
  );
}

export function useFeed() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
}
