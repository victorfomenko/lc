import React from 'react';
import cn from 'classnames';
import Link from 'next/link';

import AjaxForm from './ajaxForm';
import ParamLink from './paramLink';


export default ({ path, user }) => {
  const items = [
    { href: '/gallery', title: 'Галерея' },
    { href: '/delivery', title: 'Доставка' },
    { href: '/price', title: 'Цены' },
    user && user.role === 'admin' && { href: '/orders', title: 'Заказы' },
  ].filter(i => i).map(({ title, href }) => {
    const classes = cn('menu__item', {
      'active': href === path
    });

    return (
      <li key={href} className={classes}>
        <Link href={href}><a className="menu__item__link">{title}</a></Link>
      </li>
    )
  });

  let userPanel;

  if (user) {
    userPanel = (
      <div>
        <AjaxForm className="ajax" method="post" action="/ajax/ajax.php">
          <input type="hidden" name="act" value="logout" />
          {user.role === 'admin' ? <span>admin: </span> : null}
          <ParamLink url='/account' title={user.name || user.url} />
          <button className="btn btn-link header__flex__item__email" type="submit">выход</button>
        </AjaxForm>
      </div>
    );
  } else {
    userPanel = (
      <div>
        <span className="header__flex__item__email">
          <a href="/auth/vkontakte">vk</a>&nbsp;
          <a href="/auth/instagram">instagram</a>
        </span>
      </div>
    );
  }

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__flex">
          <div className="header__flex__item col-md-4 col-xs-4 header__flex__item--logo">
            <Link href='/'><a className="header__flex__item__link"><img className="header__flex__item__link__logo" src="/static/img/logo.png" alt="Love Canvas" /></a></Link>
            <div className="header__flex__item__title">
              <span className="header__flex__item__title__name"><Link href="/"><a>Love Canvas</a></Link></span><br />
              <span className="header__flex__item__title__note">Создание принтов</span>
            </div>
          </div>
          <div className="header__flex__item col-md-5 col-xs-5 m-text_right">
            <ul className="menu">
              {
                items
              }
            </ul>
          </div>
          <div className="header__flex__item col-md-3 col-xs-3 m-text_right header__flex__item--contacts m-padding-right_clear">
            <span className="header__flex__item__phone"><a href="tel:+79063239638">+7 (906) 323-96-38</a></span> <br />
            <div className="m-text_right">
              {userPanel}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
