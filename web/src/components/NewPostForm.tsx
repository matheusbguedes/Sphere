'use client';

import { api } from "@/lib/api";
import Cookie from "js-cookie";
import { Camera, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { FormEvent } from "react";
import { MediaPicker } from "./MediaPicker";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner"

export function NewPostForm({
  avatarUrl,
  name,
}: {
  avatarUrl: string;
  name: string;
}) {

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const fileToUpload = formData.get("postImageUrl");

    let postImageUrl = "";

    console.log(fileToUpload)

    if (fileToUpload) {
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

    await api.post(
      "/post",
      {
        content: formData.get("content"),
        postImageUrl,
        userName: name,
        avatarUrl,
        createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
      );

      toast("Você criou uma publicação!",
      {
        description: "Continue compartilhando.",
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
        duration: 1000 * 2, // 2 seconds
      })
  }
  
  return (
    <form
      onSubmit={handleCreatePost}
      className="w-1/3 flex flex-col gap-3 rounded-xl p-5 border-2 border-zinc-800"
    >
      <div className="w-full flex items-center justify-between gap-3 pb-4 border-b-2 border-zinc-800">
        <div className="flex items-center gap-3">
          <Image
            src={avatarUrl}
            width={60}
            height={60}
            draggable={false}
            alt=""
            className="size-12 rounded-full border-2 border-primary"
          />
          <p className="max-w-[140px] text-zinc-400 text-base">{name}</p>
        </div>

        <label className="flex cursor-pointer items-center text-sm p-2 rounded-md text-primary hover:hover:bg-primary/20">
          <MoreHorizontal className="size-5" />
        </label>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-2">
        <Input name="content" type="text" placeholder="Escreva algo..." />
        <MediaPicker />
      </div>

      <div className="w-full flex items-center justify-between">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center text-sm p-2 rounded-md text-primary hover:hover:bg-primary/20"
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
