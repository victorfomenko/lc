import React, { Component } from 'react';

import ParamLink from '../components/paramLink';

class NavPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nav: [
        {
          title: 'Аккаунт',
          items:[{
            name: 'Редактировать',
            icon: 'icon-users-42',
            link: '/account/edit'
          },{
            name: 'Смена пароля',
            icon: 'icon-edition-59',
            link: '/account/password'
          }]
        }, {
          title: 'Заказы',
          items: [{
            name: 'История заказов',
            icon: 'icon-users-42',
            link: '/account/orders'
          }]
        }
      ]
    }
  }

  render() {
    const nav = this.state.nav.map((nav, index) => {
      return (
        <div key={index}>
          <h2 className='admin-nav__title'>{nav.title}</h2>
          <ul className='admin-nav__list'>
            {nav.items.map((item, index) => {
              const activeClassName = this.props.path === item.link ? 'is-active' : ''
              return (
                <li key={index} className={`admin-nav__list__item ${activeClassName}`}>
                  <ParamLink url={item.link} title={item.name}>
                    <a className='admin-nav__list__item__link'><i className={`icon ${item.icon}`}></i>{item.name}</a>
                  </ParamLink>
                </li>
              )
            })}
          </ul>
        </div>
      )
    });

    return (
      <div>
        {nav}
      </div>
    )
  }
}


NavPanel.propTypes = {
  path: React.PropTypes.string.isRequired
};

export default NavPanel
