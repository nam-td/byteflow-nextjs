
import dynamic from "next/dynamic"
const Search = dynamic(() => import("components/Search"), {
  ssr: false
})

export default function Page(){
  return <Search />
}