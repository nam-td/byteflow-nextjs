import dynamic from "next/dynamic"
const RecoverPasswordForm = dynamic(() => import("components/RecoverPasswordForm"), {
  ssr: false
})

export default function Page(){
  return <RecoverPasswordForm />
}