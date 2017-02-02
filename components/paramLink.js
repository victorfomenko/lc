import React from 'react';
import Link from 'next/link';

function clean(str) {
  return String(str || '').trim();
}

// url in format: /user/:userId/product as picture/:pictureId
// params in format: {userId: 1, pictureId: 2}

/**
 * Return Link component
 * @param url {String} url in format: /user/:userId/product as picture/:pictureId
 * @param params {Object} in format: {userId: 1, pictureId: 2}
 * @param title {String} link title or children
 * @param children {React.Component instance} children of React. or title
 * @returns {Link}
 */
export default function ({url, params, title, children}) {
  const parts = url.split('/');
  const hrefPath = [];
  const hrefParams = [];
  const asParts = [];

  parts.forEach(part => {
    if (part[0] === ':') {
      const key = part.slice(1);
      const value = encodeURIComponent(params[key]);
      hrefParams.push(key + '=' + value);
      asParts.push(value);
    } else {
      const [page, as] = part.split(' as ');
      hrefPath.push(clean(page));
      asParts.push(clean(as || page));
    }
  });

  const href = hrefPath.join('/') + '?' + hrefParams.join('&');
  const as = asParts.join('/');

  const content = children || <a>{title}</a>;

  return (
    <Link href={href} as={as}>{content}</Link>
  );
}