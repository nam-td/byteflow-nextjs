
import dynamic from "next/dynamic"
const CreatePost = dynamic(() => import("components/CreatePost"), {
  ssr: false
})

export default function Page(){
  return <CreatePost />
}