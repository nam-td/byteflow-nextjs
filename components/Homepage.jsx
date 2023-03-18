import { useEffect, useState } from "react";
import Post from "components/Post";
import Sidebar from "components/Sidebar";
import Head from "next/head";
import axios from "axios";

export default function Homepage() {
  const [posts, setPosts] = useState([]);
  const [pageToLoad, setPageToLoad] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await axios.get(
          `/api/posts?page=1`
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
          `/api/posts?page=${pageToLoad}`
        );
        const data = await res.data;
        setPosts((posts) => [...posts, ...data.posts]);
      } catch (error) {
        console.log(error);
      }
    }
    if (pageToLoad >= 2) {
      fetchMorePosts();
    }
  }, [pageToLoad]);

  return (
    <>
      <Head>
        <title>Byteflow Tech Blog</title>
        <meta name="title" content="Byteflow Tech Blog" />
        <meta name="description" content="Keep up with latest news in tech" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://metatags.io/" />
        <meta property="og:title" content="Byteflow - Tech Blog" />
        <meta
          property="og:description"
          content="Keep up with latest news in tech"
        />
        <meta
          property="og:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://metatags.io/" />
        <meta property="twitter:title" content="Byteflow - Tech Blog" />
        <meta
          property="twitter:description"
          content="Keep up with latest news in tech"
        />
        <meta
          property="twitter:image"
          content="https://metatags.io/assets/meta-tags-16a33a6a8531e519cc0936fbba0ad904e52d35f34a46c97a2c9f6f7dd7d336f2.png"
        />
      </Head>
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
