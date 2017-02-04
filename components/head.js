import React from 'react';
import Head from 'next/head';

const isBrowser = (function () {
  try {
    return !!document;
  } catch (e) {
    return false;
  }
})();

export default ({head}) => {
  const title = head.title || '';
  const scripts = [
    "https://code.jquery.com/jquery-2.2.4.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/collageplus/0.3.3/extras/jquery.collageCaption.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/collageplus/0.3.3/jquery.collagePlus.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/collageplus/0.3.3/extras/jquery.removeWhitespace.min.js",
    "/static/js/modal.js",
  ];

  if (isBrowser) {
    if (document._scriptsLoaded) {
      scripts.length = 0;
    }
    document._scriptsLoaded = true;
  }

  return (
    <Head>
      <title>{title + (title ? ' | ' : '') + 'Love Canvas'}</title>
      <link href="/static/css/main.css" rel="stylesheet"/>
      {scripts.map((src, i)=> <script key={i} src={src}/>)}
    </Head>
  );
}
