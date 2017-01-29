import React, {Component} from 'react';
import cookie from 'cookie';

//services
import auth from '../services/authService';

// components
import Head from './head';
import Header from './header';
import Footer from './footer';
import Modals from './modals';

export default class Layout extends Component {
  static async getInitialProps({pathname, req}) {
    const cookies = cookie.parse(req ? req.headers.cookie : document.cookie);
    const sid = cookies['PHPSESSID'];

    const user = await auth.getProfile(sid);

    return {path: pathname, user: user}
  }

  render() {
    const {path, user} = this.props;
    return (
      <div className="l-body">
        <Head/>
        <Header path={path} user={user}/>
        <div className="l-content">
          {/*<h4>user: {JSON.stringify(user)}</h4>*/}
          {this.content && this.content()}
        </div>
        <Footer/>
        <Modals user={user}/>
      </div>
    )
  }
}

