import React from 'react';
import Router from 'next/router';
import Link from 'next/link';

//services
import api from '../services/appService';

//components
import Layout from '../components/layout';
import Gallery from '../components/gallery';


const bannerNumber = Math.floor((Math.random() * 5) + 1);

export default class Index extends Layout {
  static async getInitialProps(obj) {
    const [
      baseProps,
      pictures
    ] = await Promise.all([
      super.getInitialProps(obj),
      Gallery.getPictures(15)
    ]);

    return {
      ...baseProps,
      pictures
    }
  }

  onClickLoadFile(){
    document.querySelector('input[type="file"]').click();
  }


  handleFileSelect(e){
    let file = e.target.files; // FileList object
    // Only process image files.
    if (!file[0].type.match('image.*')) { return null }
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return (e) => {
        var image = new Image();
        image.src = e.target.result;
        api.imageProp = image.width/image.height;
        Router.onRouteChangeComplete = (url) => {
          api.dataForSent.image = null;
          api.dataForSent.imageBase64 = e.target.result;
          // Render thumbnail.
          var imageContainer = document.getElementById('image-container');
          imageContainer.style.backgroundImage=['url("', e.target.result ,'")'].join('');
          imageContainer.innerHTML = ['<img class="product__image__img" id="mainPicture" src="', e.target.result,
            '" title="', escape(theFile.name), '"/>'].join('');
        };
        Router.push('/canvas')
      };
    })(file[0]);

    // Read in the image file as a data URL.
    reader.readAsDataURL(file[0]);
  }

  content(){
    const {pictures} = this.props;

    return(
      <div>
        <section className={`banner banner--item-${bannerNumber}`}>
          <h1 className="banner__title">Превращаем фотографии в картины</h1>
          <a className="btn btn-info btn-lg" onClick={this.onClickLoadFile}>Загрузить своё фото</a>
          <input className="m-hidden" defaultValue="Загрузить фото" type="file" id="load-file" onChange={this.handleFileSelect}/>
          <p> или <Link href="/gallery"><a className="banner__title__small">посмотреть галерею</a></Link></p>
        </section>
        <section className="container">
          <div className="gallery-section">
            <div className="row">
              <div className="col-xs-12">
                <h2 className="m-text_center big">Галерея готовых работ</h2>
                <div className="m-separator m-separator--after-title"></div>
              </div>
            </div>
            <Gallery pictures={pictures}/>
          </div>
          <p className="m-text_center">
            <Link href="/gallery"><a className="btn btn-lg btn-helper">Посмотреть еще</a></Link>
          </p>
        </section>

        <section className="container pluses">
          <div className="row">
            <div className="col-xs-12">
              <h2 className="m-text_center big">Гарантируем, что вам понравится</h2>
              <div className="m-separator m-separator--after-title"></div>
            </div>
          </div>
          <div className="row pluses__row">
            <div className="col-md-6 col-xs-12 m-text_center">
              <img src="./static/img/pluses/item1.png" alt="100% возврат"/>
              <h3 className="pluses__row__title">100% возврат</h3>
              <span>
                        Мы настолько уверены в качестве своих картин, <br/>
                        что можем себе это позволить в случае, <br/>
                        если вам что-то не понравится.
                    </span>
            </div>
            <div className="col-md-6 col-xs-12 m-text_center">
              <img src="./static/img/pluses/item2.png" alt="просто"/>
              <h3 className="pluses__row__title">просто</h3>
              <span>
                  Напечатать картину никогда не было так просто. <br/>
                  Загрузите фото и отправьте нам заявку <br/>
                  и мы все сделаем сами.
              </span>
            </div>
          </div>
          <div className="row pluses__row">
            <div className="col-md-6 col-xs-12 m-text_center">
              <img src="./static/img/pluses/item3.png" alt="качествено"/>
              <h3 className="pluses__row__title">качественно</h3>
              <span>
                  Качество на первом месте. <br/>
                  Краска, рама, холсты — все только лучшее.
              </span>
            </div>
            <div className="col-md-6 col-xs-12 m-text_center">
              <img src="./static/img/pluses/item4.png" alt="с любовью"/>
              <h3 className="pluses__row__title">с любовью</h3>
              <span>
                  Нам нравится то, что мы делаем. <br/>
                  И это значит, что мы сделаем это правильно и хорошо.
              </span>
            </div>
          </div>
        </section>
        <section>
          <div className="container">
            <img style={{width: '100%'}} src="./static/img/home-section.png" alt="Картины Love Canvas"/>
          </div>
        </section>
        <section className="container">
          <div className="row">
            <div className="col-xs-12">
              <h2 className="m-text_center big">Мы нравимся нашим клиентам</h2>
              <div className="m-separator m-separator--after-title"></div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-xs-12 m-text_center">
              <blockquote className="customer-review">
                <p className="customer-review__text">"Отличный подарок для родственников или друзей, спасибо за оперативность и профессионализм. Думаю, это не последняя картина которую я у вас заказал. Спасибо огромное!"</p>
                <footer className="m-text_left">
                  <Link href="https://vk.com/andrew.danilov">
                    <a target="_blank">
                      <img className="customer-review__avatar" src="./static/img/home/customer-1.png" alt="pic"/> — <cite>Андрей Д</cite>.
                    </a>
                  </Link>
                </footer>
              </blockquote>
            </div>
            <div className="col-md-6 col-xs-12 m-text_center">
              <blockquote className="customer-review">
                <p className="customer-review__text">"Спасибо большое команде Love Canvas за мою чудесную картину!!! Она превзошла все мои ожидания) очень красивая)) понравилось качество работы, приятные люди и удобная доставка."</p>
                <footer className="m-text_left">
                  <Link href="https://vk.com/id6276988">
                    <a target="_blank">
                      <img className="customer-review__avatar" src="./static/img/home/customer-2.png" alt="pic"/> — <cite>Ада К</cite>.
                    </a>
                  </Link>
                </footer>
              </blockquote>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-xs-12 m-text_center">
              <blockquote className="customer-review">
                <p className="customer-review__text">"Спасибо большое за работу!!! Качество, текстура холста, доставка — все на высшем уровне! Нам очень понравилась ваша идея и то ,как вы ее воплотили в реальность!!! Теперь это настоящее украшение для нашего дома)"</p>
                <footer className="m-text_left">
                  <Link href="https://vk.com/id2552680">
                    <a target="_blank">
                      <img className="customer-review__avatar" src="./static/img/home/customer-3.png" alt="pic"/> — <cite>Катя С</cite>.
                    </a>
                  </Link>
                </footer>
              </blockquote>
            </div>
            <div className="col-md-6 col-xs-12 m-text_center">
              <blockquote className="customer-review">
                <p className="customer-review__text">"Были очень рады с супругой, увидев это чудо! С расстояния в один метр можно уверенно говорить, что она написана рукой :) Привлекает внимание, напоминая о важном событии и удивляет гостей) Спасибо всей команде за сервис и старание!!! "</p>
                <footer className="m-text_left">
                  <Link href="https://vk.com/motomixon">
                    <a target="_blank">
                      <img className="customer-review__avatar" src="./static/img/home/customer-4.png" alt="pic"/> — <cite>Михаил Н</cite>.
                    </a>
                  </Link>
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 m-text_center">
              <h2 className="big">Оформить заказ – проще простого!</h2>
              <Link>
                <a className="btn btn-info btn-lg" onClick={this.openLoadFile}>Загрузить своё фото</a>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }
}