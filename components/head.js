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
      <link rel="shortcut icon" href="/static/favicon.ico?v=3" />
      <title>{title + (title ? ' | ' : '') + 'Love Canvas'}</title>
      <link href="/static/css/main.css" rel="stylesheet"/>
      {scripts.map((src, i)=> <script key={i} src={src}/>)}
      <meta name="author" content="Victor Fomenko"/>
      <meta name="keywords" content="купить картину, купить принты, принты в казани картины в казани, картина на холсте, картина в раме, печать на холсте, холст, фото, печать, картина, печать картин"/>
      <meta name="description" content="Продажа картин. Создание высококачественных картин. С Love Canvas вы можете превратить свою фотографию в картину."/>

      {/* BEGIN JIVOSITE CODE {literal} */}
      <script dangerouslySetInnerHTML={{__html: `(function(){ var widget_id = 'KGBOISDYED'; var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = '//code.jivosite.com/script/widget/'+widget_id; var ss = document.getElementsByTagName('script')[0]; ss.parentNode.insertBefore(s, ss);})();` }} />
      {/* {/literal} END JIVOSITE CODE */}

      {/* Yandex.Metrika counter */}
      <script dangerouslySetInnerHTML={{__html: `(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter26717241 = new Ya.Metrika({ id:26717241, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true, trackHash:true }); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = "https://mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");` }} />
      <noscript dangerouslySetInnerHTML={{__html: `<div><img src="https://mc.yandex.ru/watch/26717241" style="position:absolute; left:-9999px;" alt="" /></div>`}} />
      {/* Yandex.Metrika counter */}

      {/* GA */}
      <script dangerouslySetInnerHTML={{__html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-28757035-4', 'auto');
        ga('send', 'pageview');` }} />
      {/* GA */}
    </Head>
  );
}
