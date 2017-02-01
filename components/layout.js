import React, {Component} from 'react';
import cookie from 'cookie';

//services
import auth from '../services/authService';
import $http from '../services/$http';

// components
import Head from './head';
import Header from './header';
import Footer from './footer';
import Modals from './modals';

export default class Layout extends Component {
  static async getInitialProps({pathname, req}) {
    if (req) {
      $http.host = req.protocol + '://' + req.get('host');
    }

    const cookies = cookie.parse(req ? (req.headers.cookie || '') : document.cookie);
    const sid = cookies['PHPSESSID'];

    const user = await auth.getProfile(sid);

    return {path: pathname, head: {}, session: {id: sid, user}}
  }

  render() {
    const {path, session, head} = this.props;
    return (
      <div className="l-body">
        <Head head={head}/>
        <Header path={path} user={session.user}/>
        <div className="l-content">
          {this.content && this.content()}
        </div>
        <Footer/>
        <Modals user={session.user}/>
      </div>
    )
  }
}

