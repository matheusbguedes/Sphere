"use client";

import { useProvider } from "@/context/FeedContext";
import { api } from "@/lib/api";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { Camera, MapPin, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewPost({ user }: { user: User }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [content, setContent] = useState<string>();
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();
  const { getPosts } = useProvider();

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const fileToUpload = formData.get("postImageUrl");

    let postImageUrl = "";

    if (fileToUpload instanceof File && fileToUpload.size > 0) {
      const uploadFormData = new FormData();
      uploadFormData.set("file", fileToUpload);

      const uploadResponse = await api.post("/upload", uploadFormData);

      postImageUrl = uploadResponse.data.fileUrl;
    }

    const formDataValue = formData.get("createData");
    const createdAt: Date = formDataValue
      ? new Date(Date.parse(formDataValue.toString()))
      : new Date();

    const token = Cookie.get("token");

    await api.post(
      "/post",
      {
        content,
        postImageUrl,
        userName: user.name,
        avatarUrl: user.avatarUrl,
        createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (formRef.current) {
      formRef.current.reset();
      setPreview(null);
    }

    toast.success("Você criou uma publicação!", {
      style: {
        background: "rgb(39 39 42)",
        color: "rgb(161 161 170)",
      },
      iconTheme: {
        primary: "#0066FF",
        secondary: "rgb(39 39 42)",
      },
    });

    return getPosts();
  }

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewURL = URL.createObjectURL(files[0]);

    setPreview(previewURL);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleCreatePost}
      className="w-full md:max-w-2xl flex flex-col gap-3 p-5 rounded-xl border-2 border-zinc-800"
    >
      <div className="w-full flex items-center gap-3">
        <Image
          src={user.avatarUrl}
          width={60}
          height={60}
          draggable={false}
          alt="profile-image"
          onClick={() => {
            router.push(`/user/${user.sub}`);
          }}
          className="size-12 rounded-full outline cursor-pointer outline-2 outline-primary"
        />
        <Input
          placeholder={`O que está acontecendo?`}
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
        />
      </div>

      <input
        onChange={onFileSelected}
        type="file"
        name="postImageUrl"
        id="media"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt=""
            className="aspect-video w-full rounded-lg object-cover shadow-sm"
          />
          <span
            className="absolute top-2 right-2 p-2 rounded-md cursor-pointer text-white bg-red-600/80 hover:bg-red-600"
            onClick={() => {
              if (formRef.current) {
                formRef.current.reset();
                setPreview(null);
              }
            }}
          >
            <Trash2 className="size-4" />
          </span>
        </div>
      )}

      <div className="w-full flex items-center justify-between pt-4 border-t-2 border-zinc-800">
        <div className="flex justify-center items-center gap-2">
          <label
            htmlFor="media"
            className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Camera className="size-5" />
          </label>

          <label className="flex cursor-pointer items-center text-sm p-2 rounded-md text-zinc-600 hover:text-primary hover:bg-primary/10 transition-colors">
            <MapPin className="size-5" />
          </label>
        </div>

        <Button variant="outline" size="sm" disabled={!content && !preview}>
          Compartilhar
        </Button>
      </div>
    </form>
  );
}
