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
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="favicon.ico?v=3" />
      <title>{title + (title ? ' | ' : '') + 'Love Canvas'}</title>
      <link href="/static/css/main.css" rel="stylesheet"/>
      {scripts.map((src, i)=> <script key={i} src={src}/>)}
      <meta name="author" content="Victor Fomenko"/>
      <meta name="keywords" content="купить картину, купить принты, принты в казани картины в казани, картина на холсте, картина в раме, печать на холсте, холст, фото, печать, картина, печать картин"/>
      <meta name="description" content="Продажа картин. Создание высококачественных картин. С Love Canvas вы можете превратить свою фотографию в картину."/>
    </Head>
  );
}
