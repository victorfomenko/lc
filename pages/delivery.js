import React from 'react';

import Layout from '../components/layout';

export default class Delivery extends Layout {

  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);
    props.head.title = 'Доставка';
    return props
  }

  content(){
    return(
      <div className="delivery delivery--bg">
        <section className="container m-padding-default">
          <div className="row">
            <div className="col-xs-6 col-sm-6 col-lg-5">
              <h1 className="h1 big">Доставка</h1>
              <h4 className="m-text_big">На данный момент мы предлагаем вам следующие варианты доставки и оплаты ваших заказов:</h4>
            </div>
          </div>
        </section>
        <section className="container m-section-last">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-lg-7">
              <h2 className="h2">Казань</h2>
              <ul>
                <li>Доставка: нашей курьерской службой</li>
                <li>Оплата: наличными в момент передачи заказа</li>
                <li>Стоимость: <strong>100 <span className="m-rubble">i</span></strong>, для заказов свыше 1000 <span className="m-rubble">i</span> — бесплатно!</li>
                <li>Сроки: для заказов без рамы — <strong>3 дня</strong>, с рамой — <strong>7 дней</strong></li>
              </ul>

              <h2 className="h2">Города РФ (кроме Казани)</h2>
              <ul>
                <li>Доставка: «Почтой России»</li>
                <li>Оплата: наложенным платежом при получении заказа в отделении почты</li>
                <li>Стоимость: <strong>350 <span className="m-rubble">i</span></strong> + оплата за денежный перевод по тарифам «Почты России»</li>
                <li>Сроки (передачи заказа на почту): без рамы — <strong>3 дня</strong>, с рамой — <strong>7 дней</strong>.<br/>
                  Сроки доставки необходимо уточнять на сайте «Почты России» <a target="_blank" href="http://www.russianpost.ru/">russianpost.ru</a></li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    )
  }
}