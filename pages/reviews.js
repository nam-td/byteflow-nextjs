import dynamic from "next/dynamic"
const Reviews = dynamic(() => import("components/Reviews"), {
  ssr: false
})

export default function Page(){
  return <Reviews />
}