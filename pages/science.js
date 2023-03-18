import dynamic from "next/dynamic"
const Science = dynamic(() => import("components/Science"), {
  ssr: false
})

export default function Page(){
  return <Science />
}