import React from 'react';

// components
import Layout from '../../components/layout';
import UserAccountLayout from '../../components/user/UserAccountLayout';

export default class AccountPassword extends Layout {
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

  constructor(props) {
    super(props);
  }

  content() {
  	const userId = this.props.session.user.id;

    return (
      <UserAccountLayout path={this.props.path}>
    		<div className='row'>
			    <div className='col-xs-12 col-sm-8 col-md-7 col-lg-6'>
		        <h1 className='h1'>Заказы</h1>
	        </div>
        </div>
      </UserAccountLayout>
    )
  }
}

