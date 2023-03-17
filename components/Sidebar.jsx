import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
const axios = require("axios");

function MostViewedPost({ _id, title, cover, summary, tags }) {
  return (
    <li>
      <div className="image">
        <Link href={`/post/${_id}`}>
          <Image
            src={
              `${process.env.NEXT_PUBLIC_API_URL}/` +
              cover.replaceAll("\\", "/")
            }
            alt={title}
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: "100%", height: "100%" }}
          />
        </Link>
      </div>
      <div className="texts">
        <h3>
          <Link href={`/post/${_id}`}>{title}</Link>
        </h3>
        <div className="tags">
          {tags.length > 0 &&
            tags.map((tag) => {
              return (
                <Link key={tag} href={`/${tag}`}>
                  {tag[0].toUpperCase() + tag.substring(1)}
                </Link>
              );
            })}
        </div>
      </div>
    </li>
  );
}

export default function Sidebar() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchMostViewedPosts() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts?sort=mostviewed`
        );
        const data = await res.data;
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMostViewedPosts();
  }, []);

  return (
    <aside>
      <h2>Most Read Stories</h2>
      <ul>
        {posts.length > 0 &&
          posts.map((post) => {
            return <MostViewedPost {...post} key={post._id} />;
          })}
      </ul>
    </aside>
  );
}
