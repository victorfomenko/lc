import React from 'react';
import Link from 'next/link';

export default (props) => (
  <footer className="l-footer">
    <div className="container m-text_center">
      <ul className="social social--footer">
        <li className="social__item">
          <Link href="https://vk.com/lovecanvas">
            <a target="_blank"><i className="social-vkontakte"/></a>
          </Link>
        </li>
        <li className="social__item">
          <Link href="https://instagram.com/lovecanvasru">
            <a target="_blank"><i className="social-instagram-fontawesome"/></a>
          </Link>
        </li>
        <li className="social__item">
          <Link href="https://twitter.com/i_love_canvas">
            <a target="_blank"><i className="social-twitter"/></a>
          </Link>
        </li>
      </ul>
      <span>© 2017 Love Canvas</span>
    </div>
  </footer>
)
