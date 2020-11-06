import { AppProps } from "next/dist/next-server/lib/router/router";
import "../styles/app.scss";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;
