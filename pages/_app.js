import "styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { UserContextProvider } from "../contexts/UserContext";
import { RefetchContextProvider } from "../contexts/RefetchContext";

export default function App({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <RefetchContextProvider>
        <Navbar />
        <div className="main-container">
          <Component {...pageProps} />
        </div>
        <Footer />
      </RefetchContextProvider>
    </UserContextProvider>
  );
}
