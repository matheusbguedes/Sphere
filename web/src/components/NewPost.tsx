"use client";

import { api } from "@/lib/api";
import { useProvider } from "@/lib/context";
import { User } from "@/types/User";
import Cookie from "js-cookie";
import { Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function NewPost({ user }: { user: User }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
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

    const token = Cookie.get("token");

    // Transforma a Data em string

    const formDataValue = formData.get("createData");
    const createdAt: Date = formDataValue
      ? new Date(Date.parse(formDataValue.toString()))
      : new Date();

    const content = formData.get("content");

    if (!postImageUrl && !content) {
      return toast.error("Compartilhe algo!", {
        style: {
          background: "rgb(39 39 42)",
          color: "rgb(161 161 170)",
        },
        iconTheme: {
          primary: "#0066FF",
          secondary: "rgb(39 39 42)",
        },
      });
    }

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
          alt=""
          className="size-12 rounded-full border-2 border-primary"
        />
        <Input
          name="content"
          type="text"
          placeholder={`O que está acontecendo?`}
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
          <Trash2
            onClick={() => {
              if (formRef.current) {
                formRef.current.reset();
                setPreview(null);
              }
            }}
            className="absolute top-2 right-2 size-5.5 p-1 cursor-pointer text-zinc-500  hover:hover:text-red-600"
          />
        </div>
      )}

      <div className="w-full flex items-center justify-between pt-4 border-t-2 border-zinc-800">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center text-sm p-1 text-zinc-400 hover:text-primary"
        >
          <Camera className="size-5" />
        </label>

        <Button variant="outline" size={"sm"}>
          Compartilhar
        </Button>
      </div>
    </form>
  );
}
