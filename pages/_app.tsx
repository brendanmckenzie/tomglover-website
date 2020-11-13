import * as React from "react";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import TagManager from "react-gtm-module";

import "../styles/app.scss";

const tagManagerArgs = {
  gtmId: "GTM-NFKJ3BR",
};

typeof document !== "undefined" && TagManager.initialize(tagManagerArgs);

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, maximum-scale=1"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👋</text></svg>"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
