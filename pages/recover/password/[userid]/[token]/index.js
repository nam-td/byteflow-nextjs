import axios from "axios";
import dynamic from "next/dynamic";
const NewPasswordForm = dynamic(() => import("components/NewPasswordForm"), {
  ssr: false
});

const verifyEmailUrl = async (userId, token) => {
  try {
    const body = {
      userId: userId,
      token: token,
    };
    const url = `${process.env.API_URL}/authentication/recover/password/${userId}/${token}`;
    const res = await axios({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
    
    if (res.status === 200) {
      const data = await res.data;
      const msg = await data.msg;
      const validUrl = true;
      const message = msg;
      return { validUrl, message };
    }

  } catch (err) {
    console.log(err);
    const data = await err.response.data;
    const validUrl = false;
    const message = data.msg;
    return { validUrl, message };
  }
};

export async function getServerSideProps({ params }) {
  const { userid, token } = params;
  console.log(userid);
  console.log(token);
  const data = await verifyEmailUrl(userid, token);
  const { validUrl, message } = data;

  return { props: { validUrl, message } };
}
const ChangePassword = ({ validUrl, message }) => {
  return (
    <div className="v-container">
      {validUrl ? (
        <NewPasswordForm />
      ) : (
        <h1>{message}</h1>
      )}
    </div>
  );
};

export default ChangePassword;
