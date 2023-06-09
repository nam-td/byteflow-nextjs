"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordForm({userId, token}){
    const [password, setPassword] = useState("");
    const [helper, setHelper] = useState("");
    const [redirect, setRedirect] = useState(false);
    const router = useRouter();

    const passwordValidate = (e) => {
        const passwordInput = e.target.value;
        if (passwordInput.length >= 8 && passwordInput.length <= 20) {
          setPassword(passwordInput);
          setHelper("");
        } else {
          setPassword("");
          setHelper("Password must be 8 - 20 characters long.");
        }
      };

    const resetPassword = async (e, userId, token) => {
        e.preventDefault();
        if (password !== "") {
          try {
            const body = {
              userId: userId,
              token: token,
              password: password,
            };
            const url = `${process.env.NEXT_PUBLIC_API_URL}/authentication/recover/password/${userId}/${token}`;
            const res = await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
            const data = await res.json();
            const msg = await data.msg;
            setHelper(msg);
            setTimeout(() => {
                setRedirect(true);
            }, 3000);
          } catch (err) {
            console.log(err);
            setHelper("Reset Password Failed!")
          }
        }
      };

      if (redirect){
        router.push("/");
      }  

    return (
        <form onSubmit={(e) => resetPassword(e, userId, token)}>
        <label>New Password:</label>
        <input onChange={(e) => passwordValidate(e)} type="password" />
        <p className="helper">{helper}</p>
        <input type="submit" value="Submit" />
      </form>
    )
}