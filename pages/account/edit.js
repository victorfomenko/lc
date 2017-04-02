import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import AjaxForm from '../../components/ajaxForm';
import UserAccountLayout from '../../components/user/UserAccountLayout';

export default class AccountEdit extends Layout {
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
    this.state = {
      isHidden: true,
      user: this.prepareUserValues(this.props.session.user)
    }
    this.onChangeUrl = this.onChangeUrl.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeAbout = this.onChangeAbout.bind(this);
    this.onChangeWebsite = this.onChangeWebsite.bind(this);
  }

  prepareUserValues(user = {}){
    for(const key in user){
      if(user.hasOwnProperty(key)){
        user[key] = user[key] ? user[key] : ''
      }
    }
    return user
  }

  onChangeUrl(e){
    this.setState({
      user: {
        ...this.state.user, 
        url: e.target.value
      }
    })
  }

  onChangeName(e){
    this.setState({
      user: {
        ...this.state.user, 
        name: e.target.value
      }
    })
  }

  onChangeEmail(e){
    this.setState({
      user: {
        ...this.state.user, 
        email: e.target.value
      }
    })
  }

  onChangePhone(e){
    this.setState({
      user: {
        ...this.state.user, 
        phone: e.target.value
      }
    })
  }

  onChangeAbout(e){
    this.setState({
      user: {
        ...this.state.user, 
        about: e.target.value
      }
    })
  }

  onChangeWebsite(e){
    this.setState({
      user: {
        ...this.state.user, 
        website: e.target.value
      }
    })
  }

  content() {
    const { isHidden, user } = this.state;

    return (
      <UserAccountLayout path={this.props.path}>
        <div className='row'>
          <div className='col-xs-12 col-sm-10 col-md-9 col-lg-8'>
            <h1 className='h1'>Профиль</h1>
            <h2 className='h2'>Аватар</h2>
            <div className='media dz m-margin-bottom_small'>
                <div className='media__aside'>
                    <div className={`dz-original-avatar ${!isHidden ? 'm-hidden' : ''}`}>
                        <img className='user-avatar' src={user.avatar} alt={user.name} title={user.name}/>
                    </div>
                    <div className='dropzone-previews dz-preview'></div>
                </div>
                <div className='media__body' id='dz-actions'>
                    <button className={`btn btn-lg btn-helper dz-select ${!isHidden ? 'm-hidden' : ''}`}>Изменить фото</button>
                    <button className={`btn btn-lg btn-info dz-start ${isHidden ? 'm-hidden' : ''}`}>Применить</button>
                    <button className={`btn btn-lg btn-helper dz-cancel ${isHidden ? 'm-hidden' : ''}`}>Отмена</button>
                    <p>
                      <small>Это фото является публичным.</small>
                    </p>
                </div>
            </div>
            <AjaxForm action={`/api/users/${user.id}`} method='PATCH' className='form ajax'>
                <h2 className='h2'>Информация о профиле</h2>
                <div>
                    <label htmlFor='url' className='form__row__label--title'>Имя пользователя</label>
                    <div className='form__row form__row--prefix'>
                        <span className='form__row--prefix__label'>https://lovecanvas.ru/</span>
                        <input id='url' type='text' className='input-block-level form__row--prefix--love' placeholder={user.url} disabled />
                        <input type='hidden' name='url' value={user.url} onChange={this.onChangeUrl} />
                        <small>Данное имя пользователя даёт вам уникальную ссылку на ваш профиль, которую вы можете давать вашим знакомым и друзьям. Эта ссылка не может быть изменена.</small>
                    </div>
                </div>
                <div className='form__row form__row--is_required'>
                    <label className='form__row__label--title' htmlFor='name'>Отображаемое имя</label>
                    <input name='name' id='name' type='text' value={user.name} onChange={this.onChangeName} required/>
                    <span className='m-text_error'></span>
                </div>
                <div className='row'>
                    <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form__row form__row--is_required'>
                            <label className='form__row__label--title' htmlFor='email'>Email</label>
                            <input name='email' id='email' type='email' value={user.email} onChange={this.onChangeEmail} required/>
                            <span className='m-text_error'></span>
                        </div>
                    </div>
                    <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form__row'>
                            <label className='form__row__label--title' htmlFor='phone'>Телефон</label>
                            <input name='phone' id='phone' type='tel' value={user.phone} onChange={this.onChangePhone}/>
                        </div>
                    </div>
                </div>
                <div className='form__row'>
                    <label className='form__row__label--title' htmlFor='about'>О себе</label>
                    <textarea name='about' id='about' cols='30' rows='6' value={user.about} onChange={this.onChangeAbout}></textarea>
                </div>
                <div className='form__row'>
                    <label className='form__row__label--title' htmlFor='name'>Сайт</label>
                    <input name='website' id='website' type='text' value={user.website} onChange={this.onChangeWebsite}/>
                </div>
                <div className='form__row'>
                    <input type="hidden" name="act" value="profileSave" />
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

