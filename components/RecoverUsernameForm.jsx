import { useState } from "react";
import axios from "axios";

const RecoverUsernameForm = () => {
  const [helper, setHelper] = useState("");
  const [email, setEmail] = useState("");

  const emailFetch = async (e) => {
    e.preventDefault();
    const body = {
      email: email,
    };
    try {
      const res = await axios({
        url: `${process.env.NEXT_PUBLIC_API_URL}/authentication/recover/username`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: body,
      });
      const data = await res.data;
      const msg = await data.msg;
      setHelper(msg);
    } catch (err) {
      console.log(err);
    }
  };
  const emailValidate = async (e) => {
    const emailInput = e.target.value;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput)) {
      setHelper("");
      setEmail(emailInput);
    } else {
      setHelper("Invalid email!");
      setEmail("");
    }
  };
  return (
    <div className="v-container">
      <form onSubmit={(e) => emailFetch(e)}>
        <label>{`We'll check for your username`}</label>
        <input
          onChange={emailValidate}
          type="email"
          placeholder="Type in your email"
        />
        <p className="helper">{helper}</p>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
};

export default RecoverUsernameForm;
