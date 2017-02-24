import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';

export default class Profile extends Layout {
  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);
    const user = props.session.user || null;
    return {...props, user};
  }

  componentDidMount() {
    if(!this.props.user) {
      this.props.url.replace('/')
    }
  }

  content() {
    const {user} = this.props;

    const page = user ? (
      <div>{JSON.stringify(user)}</div>
      ) : null;

    return (
      page
    )
  }
}

