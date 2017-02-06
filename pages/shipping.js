import React from 'react';
import Router from 'next/router';

// services
import appService from '../services/appService';
import $http from '../services/$http';

// components
import Layout from '../components/layout';

export default class Sipping extends Layout {
  static async getInitialProps(obj) {
    const baseProps = await super.getInitialProps(obj);
    const cityOptions = [
      {value: 'Москва', name: 'Москва'},
      {value: 'Санкт-Петербург', name: 'Санкт-Петербург'},
      {value: 'Альметьевск', name: 'Альметьевск'},
      {value: 'Екатеринбург', name: 'Екатеринбург'},
      {value: 'Иркутск', name: 'Иркутск'},
      {value: 'Ижевск', name: 'Ижевск'},
      {value: 'Казань', name: 'Казань'},
      {value: 'Киев', name: 'Киев'},
      {value: 'Краснодар', name: 'Краснодар'},
      {value: 'Минск', name: 'Минск'},
      {value: 'Нижний Новгород', name: 'Нижний Новгород'},
      {value: 'Набережные Челны', name: 'Набережные Челны'},
      {value: 'Новосибирск', name: 'Новосибирск'},
      {value: 'Пермь', name: 'Пермь'},
      {value: 'Ростов-на-Дону', name: 'Ростов-на-Дону'},
      {value: 'Самара', name: 'Самара'},
      {value: 'Тверь', name: 'Тверь'},
      {value: 'Чебоксары', name: 'Чебоксары'},
      {value: 'Челябинск', name: 'Челябинск'}
    ];
    return {
      ...baseProps,
      cityOptions
    }
  }

  constructor(...args){
    super(...args);
    const { formCity, formPrice } = appService.dataForSent;
    const shippingPrice = this.calcShippingPrice(formCity);
    const totalPrice = this.calcTotalPrice(formPrice, shippingPrice);
    this.state = {
      ...appService.dataForSent,
      cityOptions: this.props.cityOptions,
      shippingPrice,
      totalPrice,
      orderModalIsShow: false,
      orderLoading: false,
      orderSuccess: false
    };
    this.onChangeCity = this.onChangeCity.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhone = this.onChangePhone.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangePostal = this.onChangePostal.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.hideOrderModal = this.hideOrderModal.bind(this);
  }

  calcShippingPrice(city){
    if(city !== 'Казань') { return 350 }
    return 0
  }

  calcTotalPrice(price, shippingPrice){
    price = price || 0;
    shippingPrice = shippingPrice || 0;
    return price + shippingPrice
  }

  onChangeCity(e){
    const formCity = e.target.value;
    const shippingPrice = this.calcShippingPrice(formCity);
    const totalPrice = this.calcTotalPrice(this.state.formPrice, shippingPrice);
    this.setState({
      formCity,
      totalPrice,
      shippingPrice
    });
  }

  onChangeName(e){
    this.setState({formName: e.target.value});
  }

  onChangePhone(e){
    this.setState({formPhone: e.target.value});
  }

  onChangeEmail(e){
    this.setState({formEmail: e.target.value});
  }

  onChangeAddress(e){
    this.setState({formAddress: e.target.value});
  }

  onChangePostal(e){
    this.setState({formPostal: e.target.value});
  }

  hideOrderModal(){
    this.setState({formOrderModalIsShow: false});
  }

  onSubmitForm(e) {
    e.preventDefault();
    let dataForSent = {
      formCity: this.state.formCity,
      formAddress: this.state.formAddress,
      formBorderType: this.state.formBorderType,
      formEmail: this.state.formEmail,
      formFrameSize: this.state.formFrameSize,
      formFrameType: this.state.formFrameType,
      formName: this.state.formName,
      formPhone: this.state.formPhone,
      formPostal: this.state.formPostal,
      formPrice: this.state.formPrice,
      formProduct: this.state.formProduct,
      image: this.state.image,
      imageBase64: this.state.imageBase64
    };


    this.setState({orderModalIsShow: true});
    let goHomePage = () => { Router.push('/'); };
    this.setState({orderLoading : true});

    $http.post('/ajax/order.php', JSON.stringify(dataForSent))
      .then(data => {
        if(data.status === "ok") {
          this.setState({orderLoading: false});
          this.setState({orderSuccess: true});
          setTimeout(goHomePage, 3000);
        }
        else {
          console.log('error');
        }
    });
  };

  content() {
    const {
      formCity, formPrice, formName,
      formPhone, formEmail, formAddress,
      formPostal, cityOptions, shippingPrice,
      totalPrice, orderModalIsShow, orderLoading, orderSuccess
    } = this.state;
    return (
      <div>
        <section className="container m-padding-main">
        {/*{JSON.stringify(appService.dataForSent)}*/}
        <form onSubmit={this.onSubmitForm} className="form">
          <div className="row">
            <div className="col-xs-8">
              <div className="row">
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="name">Имя</label>
                    <input id="name" type="text" name="formName" value={formName} onChange={this.onChangeName} required/>
                  </div>
                </div>
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="phone">Номер телефона</label>
                    <input id="phone" type="tel" name="formPhone" value={formPhone} onChange={this.onChangePhone} required/>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="city">Город</label>
                    <div className="select">
                      <select id="city" name="formCity" value={formCity} onChange={this.onChangeCity} required>
                        {
                          cityOptions.map((city, index)=>(
                            <option key={index} value={city.value}>{city.name}</option>
                          ))
                        }
                      </select>

                    </div>
                  </div>
                </div>
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="email">Почта</label>
                    <input id="email" type="email" value={formEmail} onChange={this.onChangeEmail} required/>
                  </div>
                </div>
              </div>
              <div className="row m-break">
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="address">Адрес</label>
                    <input id="address" placeholder="Улица, дом, квартира" type="text" value={formAddress} onChange={this.onChangeAddress} required/>
                  </div>
                </div>
                <div className="col-xs-12 col-md-6 col-lg-6">
                  <div className="form__row form__row--is_required">
                    <label htmlFor="postalcode">Индекс</label>
                    <input id="postalcode" type="text" placeholder="Почтовый индекс" value={formPostal} onChange={this.onChangePostal} required/>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  {/*<input type="hidden" id="image" value={image || ''}/>*/}
                  {/*<input type="hidden" id="imageBase64" value={imageBase64 || ''}/>*/}
                  {/*<input type="hidden" id="formProduct" value={formProduct || ''}/>*/}
                  {/*<input type="hidden" id="formPrice" value={formPrice || ''}/>*/}
                  {/*<input type="hidden" id="formFrameSize" value={formFrameSize || ''}/>*/}
                  {/*<input type="hidden" id="formFrameType" value={formFrameType || ''}/>*/}
                  {/*<input type="hidden" id="formBorderType" value={formBorderType || ''}/>*/}
                  <input className="btn btn-info btn-lg" type="submit" style={{display: 'block', width: '100%'}} value="Купить"/>
                  <small className="m-text_info">100% гарантия возврата средств</small>
                </div>
              </div>
            </div>
            <div className="col-xs-4">
              <div className="order-info">
                <h2 className="order-info__title">Сумма заказа</h2>
                <table className="order-info__table">
                  <tbody>
                    <tr className="order-info__table__row">
                      <td className="order-info__table__row__cell">Подитог:</td>
                      <td className="order-info__table__row__cell">{formPrice}<span className="form__price__rouble m-rubble">i</span></td>
                    </tr>
                    <tr className="order-info__table__row order-info__table__row--shipping">
                      <td className="order-info__table__row__cell">Доставка:</td>
                      <td className="order-info__table__row__cell">{shippingPrice}<span className="form__price__rouble m-rubble">i</span></td>
                    </tr>
                    <tr className="order-info__table__row order-info__table__row--summary">
                      <td className="order-info__table__row__cell">Итог:</td>
                      <td className="order-info__table__row__cell">{totalPrice}<span className="form__price__rouble m-rubble">i</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </section>
        {
          orderModalIsShow ?
            <div className="modal-order-confirm">
              <div className="modal-order-confirm__close"><i className="m-close" onClick={this.hideOrderModal}/></div>
              <div className="modal-order-confirm__container">
                <div className="modal-order-confirm__data" >
                  {
                    orderLoading ?
                    <img src="/static/img/loading.gif" alt="Loading"/>
                    : null
                  }
                  {
                    orderSuccess ?
                    <h2 className="m-text_center">Спасибо, {this.state.formName}! Ваш заказ принят!</h2>
                    : null
                  }
                </div>
              </div>
            </div>
            : null
        }

      </div>

    )
  }
}