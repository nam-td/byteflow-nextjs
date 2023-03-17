import { useEffect, useState } from "react";
import Post from "components/Post";
import Sidebar from "components/Sidebar";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pageToLoad, setPageToLoad] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/science`
        );
        const data = await res.data;
        setPosts(data.posts);
        setTotalPages(parseInt(data.total));
      } catch (error) {
        console.log(error);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    async function fetchMorePosts() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/science?page=${pageToLoad}`
        );
        const data = await res.data;
        setPosts((posts) => [...posts, ...data.posts]);
      } catch (error) {
        console.log(error);
      }
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
