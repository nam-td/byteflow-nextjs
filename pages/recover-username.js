import dynamic from "next/dynamic"
const RecoverUsernameForm = dynamic(() => import("components/RecoverUsernameForm"), {
  ssr: false
})

export default function Page(){
  return <RecoverUsernameForm />
}