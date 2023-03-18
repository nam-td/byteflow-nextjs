import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/router";
const axios = require("axios");

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [tags, setTags] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect]);

  const createNewPost = async (e) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);
    tags.forEach((tag) => {
      data.append("tags[]", tag);
    });
    e.preventDefault();
    try {
      const response = await axios({
        url: `/api/posts`,
        method: "POST",
        data: data,
        withCredentials: true,
      });

      if (response.ok) {
        setRedirect(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <form className="create-post" onSubmit={createNewPost}>
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
      <ReactQuill
        modules={modules}
        formats={formats}
        onChange={(newValue) => setContent(newValue)}
      />
      <input
        type="tags"
        placeholder="tags (Seperate tags by comma. Ex: Tech, Business, Finance, ...)"
        onChange={(e) => {
          const input = e.target.value;
          const inputArr = input.split(", ");
          setTags(inputArr);
        }}
      />
      <button>Create Post</button>
    </form>
  );
}
