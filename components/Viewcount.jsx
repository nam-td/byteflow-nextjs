import { useEffect } from "react";
import { useRouter } from "next/router";
const axios = require("axios");

export default function Viewcount() {
  const router = useRouter();
  useEffect(() => {
    const id = router.query.id;
    async function updateViewcount(id) {
      try {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/posts/viewcount/${id}`,
        );
        const data = await res.data;
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    updateViewcount(id);
  }, []);
  return <div></div>;
}
