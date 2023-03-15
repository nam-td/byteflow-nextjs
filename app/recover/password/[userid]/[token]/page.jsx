
import NewPasswordForm from "./NewPasswordForm";

const verifyEmailUrl = async (userId, token) => {
  try {
    const body = {
      userId: userId,
      token: token,
    };
    const url = `${process.env.API_URL}/authentication/recover/password/${userId}/${token}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const msg = await data.msg;

    if (res.status === 200) {
       const validUrl = true;
       const message =  msg;
       return {validUrl, message};
    } else {
      const validUrl = false;
      const message =  msg;
      return {validUrl, message};
    }


  } catch (err) {
    console.log(err);
    const validUrl = false;
    const message =  "Invalid Link";
    return {validUrl, message};
  }
};


const ChangePassword = async ({params}) => {
  const {userid, token} = params;
  const data = await verifyEmailUrl(userid, token);
  const {validUrl, message} = data;

  return (
    <div className="v-container">
      {validUrl ? (
        <NewPasswordForm userId={userid} token={token} />
      ) : (
        <h1>{message}</h1>
      )}
    </div>
  );
};

export default ChangePassword;