import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "contexts/UserContext";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success");

  useEffect(() => {
    if (redirect) {
      router.push("/");
    }
  }, [redirect]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        url: `/api/authentication/login`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { username, password },
        withCredentials: true,
      });
      if (response.status === 200) {
        const data = await response.data;
        const msg = await data.msg;
        setUserInfo(data);
        setMessage(msg);
        setStatus("success");
        setTimeout(() => {
          setMessage("");
        }, 3000);
        setRedirect(true);
      }
    } catch (error) {
      console.log(error);
      const data = await error.response.data;
      console.log(data);
      const msg = await data.msg;
      setMessage(msg);
      setStatus("error");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  return (
    <div className="v-container">
      <h1 className="page-title">Login</h1>
      <form className="login-form" onSubmit={login}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="Log In" />
        <div className="recover-credentials">
          <Link href="/recover-username">Forgot your username</Link>
          <Link href="/recover-password">Forgot your password</Link>
        </div>
      </form>
      <div
        className={
          message !== ""
            ? `response-message response-active ${status}`
            : `response-message ${status}`
        }
      >
        {status === "error" ? (
          <span className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ) : (
          <span className="success-icon">
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
        )}
        <span className="texts">{message}</span>
      </div>
    </div>
  );
}
