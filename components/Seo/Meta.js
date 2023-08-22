import Head from "next/head";
import { METADATA } from "../../constants";

const Meta = ({ children }) => {
  return (
    <>
      <Head>
        <title>{METADATA.title}</title>
        <meta name="description" content={METADATA.description} />
        <meta name="keywords" content={METADATA.keywords} />
        <meta name="robots" content="index,follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content={METADATA.language} />
        <meta name="author" content={METADATA.author} />
        <meta httpEquiv="content-language" content="en" />
        <meta name="msapplication-TileColor" content="#7000FF" />
        <link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
      </Head>
      {children}
    </>
  );
};

export default Meta;
