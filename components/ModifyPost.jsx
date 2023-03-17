import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefetchContext } from "../contexts/RefetchContext";
const axios = require("axios");

export default function ModifyPost({ postId, postAuthorId }) {
  const [username, setUsername] = useState("");
  const [userid, setUserid] = useState("");
  const router = useRouter();
  const { setRefetch } = useContext(RefetchContext);

  useEffect(() => {
    async function fetchIdentity() {
      try {
        const res = await axios({
          url: `${process.env.NEXT_PUBLIC_API_URL}/authentication/profile`,
          method: "GET",
          withCredentials: true,
        });
        const credential = await res.data;
        const { username, id } = credential;
        setUsername(username);
        setUserid(id);
      } catch (error) {
        console.log(error);
      }
    }
    fetchIdentity();
  }, []);

  const deletePost = async (e) => {
    e.preventDefault();
    const data = { id: postId };
    try {
      const response = await axios(    
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
          method: "DELETE",
          data: data,
          withCredentials: true,
        }
      );
  
      if (response.ok) {
        setRefetch(true);
        router.replace("/");
      }
    } catch (error) {
      console.log(error)
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
