// import { useEffect, useState } from "react";
import Link from "next/link";

async function emailVerify(userid, token){
    try {
        const body = {
          userId: userid,
          token: token,
        };
        console.log(body)
        const url = `${process.env.NEXT_PUBLIC_API_URL}/authentication/${userid}/verify/${token}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });
        return res;
      } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch data');
      }

}

const Page = async ({params}) => {
    const {userid, token} = params;
    let validUrl = false;
    let message = "";
    const res = await emailVerify(userid, token);
    const json = await res.json();
    message = await json.msg;
    if (res.status === 200){
        validUrl = true;
    }
    return (
        <div className="email-verify">
          {validUrl ? (
            <>
              <h1>
                <span className="tick">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{message}</span>
              </h1>
              <div className="redirect">
                <Link href="/login">Log In</Link>
                <Link href="/">Homepage</Link>
              </div>
            </>
          ) : (
            <h1>{message}</h1>
          )}
        </div>
      );
    };

    export default Page