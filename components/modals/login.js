import AjaxForm from '../ajaxForm';

export default ()=> {
  return (
    <div className="modal modal--login" id="modal-login">
      <div className="modal__dialog">
        <div className="modal__inner">
          <div className="modal__header clearfix">
            <button type="button" className="modal__close" data-dismiss="modal" aria-label="Закрыть">
              <span className="modal__close__icon" aria-hidden="true">×</span>
              <span className="modal__close__text" aria-hidden="true">Закрыть</span>
            </button>
          </div>
          <div className="modal__body">
            <AjaxForm className="form-signin ajax" method="post" action="/ajax/ajax.php">

              <h1 className="form-signin-heading">Вход</h1>

              <div className="form__row form__row--is_required">
                <input name="email" type="email" className="input-block-level" placeholder="Email-адрес" autoFocus/>
                  <span className="m-text_error"/>
              </div>

              <div className="form__row form__row--is_required">
                <input name="password" type="password" className="input-block-level" placeholder="Пароль"/>
                  <span className="m-text_error"/>
              </div>

              <div className="main-error alert alert-error hide"></div>

              <div className="form__row m-text_center">
                <img src="/static/img/logo.png" alt="Logo" style={{width: '40px'}}/>
              </div>

              <div className="form__row form__row--is_required">
                <button className="btn btn-lg btn-info btn-block" type="submit">Войти с помощью Email</button>
              </div>

              <input type="hidden" name="remember-me" value="true"/>
              <input type="hidden" name="act" value="login"/>

              <hr/>

              <p>Нет аккаунта? <a data-dismiss="modal" data-toggle="modal" data-target="#modal-register">Регистрация.</a></p>
            </AjaxForm>
          </div>
        </div>
      </div>
    </div>
  );
}