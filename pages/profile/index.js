import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import ProductTypeSelector from '../../components/ProductTypeSelector';

export default class Profile extends Layout {
  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);

    if(obj.req && !props.session.user) {
      obj.res.writeHead(302, { Location: '/' })
      return 
    }
    else if(!props.session.user) {
      document.location.pathname = '/'
      return
    }
    return props;    
  }

  content() {
    const {user} = this.props.session;

    const page = user ? (
      <div>{JSON.stringify(user)}</div>
      ) : null;

    return (
      <form>
        <ProductTypeSelector imageProportion={1.5}/>
      </form>
    )
  }
}

