import Link from "next/link";
import { format } from "date-fns";
import { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "contexts/UserContext";
import axios from "axios";

export default function Dashboard() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const [email, setEmail] = useState("");
  const [emailButtonState, setEmailButtonState] = useState("Change Email");
  const inputRef = useRef(null);

  const [emailWarning, setEmailWarning] = useState("");
  const [emailWaringToggle, setEmailWarningToggle] = useState("hide");

  const [newPwdWarning, setNewPwdWarning] = useState("");
  const [newPwdWarningToggle, setNewPwdWarningToggle] = useState("hide");

  const [pageToLoad, setPageToLoad] = useState(1);
  const [totalPages, setTotalPages] = useState(null);

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("success");

  const emailValidate = (e) => {
    const emailInput = e.target.value;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput)) {
      setEmailWarning("");
      setEmailWarningToggle("hide");
      setEmail(emailInput);
    } else {
      setEmailWarning("Invalid email!");
      setEmailWarningToggle("show");
      setEmail("");
    }
  };

  const newPwdValidate = (e) => {
    const newPwdInput = e.target.value;

    if (
      oldPwd === newPwdInput ||
      newPwdInput.length < 8 ||
      newPwdInput.length > 20
    ) {
      setNewPwdWarning("Invalid password!");
      setNewPwdWarningToggle("show");
      setNewPwd("");
    } else {
      setNewPwdWarning("");
      setNewPwdWarningToggle("hide");
      setNewPwd(newPwdInput);
    }
  };
  const triggerEmailChange = (e) => {
    e.preventDefault();
    if (inputRef.current.disabled === true) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
      setEmailButtonState("Cancel");
    } else {
      inputRef.current.disabled = true;
      setEmailButtonState("Change Email");
    }
  };

  const submitChanges = async (e) => {
    e.preventDefault();
    if (email === "" && oldPwd !== "" && newPwd !== "") {
      try {
        const res = await axios({
          url: `/api/authentication/accountsettings`,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          data: { oldPwd, newPwd },
          withCredentials: true,
        });
        const data = await res.data;

        if (res.statusText === "OK") {
          setMessage(await data.msg);
          setStatus("success");
        } else {
          const msg = "Failed to update account settings";
          setMessage(msg);
          setStatus("error");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (email !== "" && oldPwd === "" && newPwd === "") {
      try {
        const res = await axios({
          url: `/api/authentication/accountsettings`,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          data: { newEmail: email },
          withCredentials: true,
        });
        const data = await res.data;
        if (res.statusText === "OK") {
          setMessage(await data.msg);
          setStatus("success");
          fetchIdentity();
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          const msg = "Failed to update account settings";
          setMessage(msg);
          setStatus("error");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (oldPwd !== "" && newPwd !== 0 && email !== "") {
      try {
        const res = await axios({
          url: `/api/authentication/accountsettings`,
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          data: { newEmail: email, oldPwd, newPwd },
          withCredentials: true,
        });
        const data = await res.data;
        if (res.statusText === "OK") {
          setMessage(await data.msg);
          setStatus("success");
          fetchIdentity();
          setTimeout(() => {
            setMessage("");
          }, 3000);
        } else {
          const msg = "Failed to update account settings";
          setMessage(msg);
          setStatus("error");
          setTimeout(() => {
            setMessage("");
          }, 3000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  async function fetchIdentity() {
    try {
      const res = await axios({
        url: `/api/authentication/profile`,
        method: "GET",
        withCredentials: true,
      });
      if (res.status === 200) {
        const credential = await res.data;
        setUserInfo(credential);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchPosts() {
    if (userInfo) {
      const res = await axios.get(
        `/api/posts?page=1`
      );
      const data = await res.data;
      const posts = await data.posts;
      setPosts(posts);
      setTotalPages(parseInt(data.total));
    }
  }

  async function refetchPosts() {
    try {
      const res = await axios.get(
        `/api/posts?page=${pageToLoad}`
      );
      const data = await res.data;
      setPosts(data.posts);
      setTotalPages(parseInt(data.total));
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchIdentity();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (pageToLoad >= 1) {
      refetchPosts();
    }
  }, [pageToLoad]);

  function PostItem({ _id, title, author, createdAt, userInfo }) {
    const deletePost = async (e) => {
      e.preventDefault();
      try {
        const data = new FormData();
        data.set("id", _id);

        const res = await axios({
          url: `/api/posts/${_id}`,
          method: "DELETE",
          data: data,
          withCredentials: true,
        });

        if (res.statusText === "OK") {
          const res2 = await axios.get(
            `/api/posts`
          );
          const data2 = await res2.data;
          const posts = data2.posts;
          setPosts(posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <li>
        <div className="title">
          <Link href={`/post/${_id}`}>{title}</Link>
        </div>
        <div className="info">
          <div className="author">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>by {author?.username}</span>
          </div>
          <time>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                clipRule="evenodd"
              />
            </svg>
            <span>{format(new Date(createdAt), "MMM d, yyyy - HH:mm")}</span>
          </time>
          {userInfo.id === author?._id && (
            <div className="modifying">
              <Link href={`/edit/${_id}`} className="edit">
                Edit
              </Link>
              <button className="delete" onClick={deletePost}>
                Delete
              </button>
            </div>
          )}
        </div>
      </li>
    );
  }

  if (userInfo === null) {
    return (
      <>
        <div></div>
      </>
    );
  }

  return (
    <>
      <div className="dashboard">
        <div className="all-posts">
          <h4>All Posts</h4>
          <ul>
            {posts.length > 0 &&
              posts.map((post) => {
                return (
                  <PostItem {...post} userInfo={userInfo} key={post._id} />
                );
              })}
          </ul>
          <div className="page-controls">
            <button
              onClick={() => {
                if (pageToLoad > 1) {
                  setPageToLoad(pageToLoad - 1);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <p>
              {pageToLoad} / {totalPages}
            </p>
            <button
              onClick={() => {
                if (pageToLoad < totalPages) {
                  setPageToLoad(pageToLoad + 1);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="account-settings">
          <h4>Account Settings</h4>
          <form onSubmit={(e) => submitChanges(e)}>
            <h5>Change Email</h5>
            <div className="info-display">
              <div className="username-display">
                <label>Username:</label>
                <span>{userInfo.username}</span>
              </div>
              <div className="email-display">
                <label>Email:</label>
                <input
                  type="text"
                  defaultValue={userInfo.email || ""}
                  disabled={true}
                  ref={inputRef}
                  onChange={(e) => emailValidate(e)}
                />
              </div>
              <p
                className={`validation-message message-${emailWaringToggle} error`}
              >
                {emailWarning}
              </p>
            </div>

            <div className="modify-settings">
              <button onClick={triggerEmailChange}>{emailButtonState}</button>
            </div>

            <h5>Change Password</h5>

            <div className="pwd-input">
              <input
                type="password"
                placeholder="Type in old password"
                onChange={(e) => setOldPwd(e.target.value)}
              />
              <input
                type="password"
                placeholder="Type in new password"
                onChange={(e) => newPwdValidate(e)}
              />
              <p
                className={`validation-message message-${newPwdWarningToggle} error`}
              >
                {newPwdWarning}
              </p>
              <p className="input-guide">
                Password must be 8 - 20 character long. New password must be
                different from the old password.
              </p>
            </div>

            <button>Save Changes</button>
          </form>
        </div>
      </div>
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
    </>
  );
}
