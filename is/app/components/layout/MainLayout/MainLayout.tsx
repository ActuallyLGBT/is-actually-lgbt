import React from 'react';
import Head from 'next/head';

require('./MainLayout.css');

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout(props: MainLayoutProps): JSX.Element {
  return (
    <main>
      <Head>
        <meta name="viewport" content="width=device-width" />

        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
          integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/sqz1orn.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/default.min.css"
        />
        <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css" />
      </Head>
      {props.children}
    </main>
  );
}

export default MainLayout;
