import dynamic from "next/dynamic"
const Entertainment = dynamic(() => import("components/Entertainment"), {
  ssr: false
})

export default function Page(){
  return <Entertainment />
}