"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefetchContext } from "../contexts/RefetchContext";

export default function ModifyPost({ postId, postAuthorId }) {
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState("");
  const router = useRouter();
  const {setRefetch} = useContext(RefetchContext);

  useEffect(() => {
    async function fetchIdentity() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/authentication/profile`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const credential = await res.json();
      const { username, id } = credential;
      setUsername(username);
      setUserid(id);
    }
    fetchIdentity();
  }, []);

    const deletePost = async (e) => {
      e.preventDefault();
      const data = JSON.stringify({id: postId});
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        method: "DELETE",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        setRefetch(true);
        router.replace("/");
      }
    };

  return (
    <>
      {userid === postAuthorId && (
        <div className="modify-control">
          <Link href={`/edit/${postId}`} className="edit">
            Edit Post
          </Link>
          <button className="delete" onClick={deletePost}>
            Delete Post
          </button>
        </div>
      )}
    </>
  );
}
