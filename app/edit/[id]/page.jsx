"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/app/components/Editor";

export default function EditPost({ params }) {
  const router = useRouter();
  const { id } = params;
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function fetchPost(id) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/` + id);
      const postInfo = await res.json();
      setTitle(postInfo.title);
      setContent(postInfo.content);
      setSummary(postInfo.summary);
      setTags(postInfo.tags);
    }
    fetchPost(id);
  }, []);

  useEffect(() => {
    if (redirect) {
        router.replace(`/post/${id}`);
      }
  }, [redirect])

  const editPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("id", id);
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    tags.forEach((tag) => {
      data.append("tags[]", tag);
    });
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      setRedirect(true);
    }
  };

  return (
    <form className="create-post" onSubmit={editPost}>
      <input
        type="title"
        placeholder={"Title"}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder={"Summary"}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input type="file" onChange={(e) => setFiles(e.target.files)} />
      <Editor value={content} onChange={(newValue) => setContent(newValue)} />
      <input
        type="text"
        placeholder="tags (Seperate tags by comma. Ex: Tech, Business, Finance, ...)"
        value={tags.join(", ")}
        onChange={(e) => {
          const input = e.target.value;
          const inputArr = input.split(", ");
          setTags(inputArr);
        }}
      />
      <button>Save Edit</button>
    </form>
  );
}
