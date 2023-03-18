import dynamic from "next/dynamic"
const Tech = dynamic(() => import("components/Tech"), {
  ssr: false
})

export default function Page(){
  return <Tech />
}