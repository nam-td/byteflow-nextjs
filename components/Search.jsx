import { useEffect, useState } from "react";
import Post from "components/Post";
import Sidebar from "components/Sidebar";
import { useRouter } from "next/router";
import axios from "axios";

export default function Search() {
  const router = useRouter();
  const { q, page } = router.query;
  const [posts, setPosts] = useState([]);
  const [pageToLoad, setPageToLoad] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  async function fetchPosts() {
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/search?q=${q}&page=${page}`
      );
      const data = await res.data;
      setPosts(data.posts);
      setTotalPages(parseInt(data.total));
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchMorePosts() {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/search?q=${q}&page=${pageToLoad}`
      );
      const data = await res.data;
      setPosts((posts) => [...posts, ...data.posts]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [router.query]);

  useEffect(() => {
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
