import React from 'react';

// services
//import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import AjaxForm from '../../components/ajaxForm';
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
		        <h1 className='h1'>Профиль</h1>
		        <AjaxForm action='/ajax/ajax.php' method='post' className='form ajax'>
		            <h2 className='h2'>Смена пароля</h2>
		            <div className='form__row'>
		                <label className='form__row__label--title' for='password'>Новый пароль</label>
		                <input name='password' id='password' type='password'/>
		                <span className='m-text_error'></span>
		            </div>
		            <div className='form__row'>
		                <label className='form__row__label--title' for='password2'>Новый пароль ещё раз</label>
		                <input name='password2' id='password2' type='password'/>
		                <span className='m-text_error'></span>
		            </div>
		            <div className='form__row'>
		                <input type='hidden' name='userid' value={userId} />
		                <input type='hidden' name='act' value='changePassword' />
		                <button className='btn btn-info btn-lg' type='submit'>Сохранить</button>
		            </div>
		            <div className='info info--success info--hide'>&nbsp;</div>
		        </AjaxForm>
		    	</div>
				</div>
      </UserAccountLayout>
    )
  }
}

