"use client";

import { useEffect, useState } from "react";
import Post from "@/app/components/Post";
import Sidebar from "@/app/components/Sidebar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pageToLoad, setPageToLoad] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/science`, {
        next: { revalidate: 0 },
      });
      const json = await res.json();
      setPosts(json.posts);
      setTotalPages(parseInt(json.total));
    }
    fetchPosts();
  }, []);
  useEffect(() => {
    async function fetchMorePosts() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/science?page=${pageToLoad}`,
        {
          next: { revalidate: 0 },
        }
      );
      const json = await res.json();
      setPosts((posts) => [...posts, ...json.posts]);
    }
    if (pageToLoad > 1) {
      fetchMorePosts();
    }
  }, [pageToLoad]);
  return (
    <>
      <main>
        {posts.length > 0 &&
          posts.map((post) => {
            return <Post {...post} key={post._id} />;
          })}
        {pageToLoad < totalPages && (
          <button
            className="load-more"
            onClick={() => {
              if (pageToLoad < totalPages) {
                setPageToLoad(pageToLoad + 1);
              }
            }}
          >
            More Articles
          </button>
        )}
      </main>
      <Sidebar />
    </>
  );
}
