import React from 'react';
import Link from 'next/link';

// url in format: /user/:userId/picture/:pictureId
// params in format: {userId: 1, pictureId: 2}
export default function ({url, params, title, children}) {
  const parts = url.split('/');
  const hrefPath = [];
  const hrefParams = [];
  const pathParts = [];

  parts.forEach(part=> {
    if (part[0] === ':') {
      const key = part.slice(1);
      const value = params[key];
      hrefParams.push(key + '=' + encodeURIComponent(value));
      pathParts.push(value);
    } else {
      hrefPath.push(part);
      pathParts.push(part);
    }
  });

  const href = hrefPath.join('/') + '?' + hrefParams.join('&');
  const as = pathParts.join('/');

  const content = children || <a>{title}</a>;

  return (
    <Link href={href} as={as}>{content}</Link>
  );
}