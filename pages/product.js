import React from 'react';

// services
import $http from '../services/$http';
import appService from '../services/appService';

// components
import Layout from '../components/layout';
import ParamLink from '../components/paramLink';

function Cotroller(picData, onServer) {
  var $scope = {};
  var productModefierPrefix = 'product--';
  var dataForSent = appService.dataForSent;
  //Default states
  $scope.formProduct = dataForSent.formProduct;
  $scope.formFrameType = dataForSent.formFrameType;
  $scope.formBorderType = dataForSent.formBorderType;
  $scope.productClass = productModefierPrefix + "canvas " + productModefierPrefix + "150";
  $scope.productStates = appService.productStates;
  var baseMainClass = $scope.productStates[1].class;
  var formListOptions = appService.optionsList;
  $scope.mainClass = baseMainClass;
  $scope.frameOptions = formListOptions.canvas.frame;
  $scope.borderOptions = formListOptions.canvas.borders;
  $scope.samplesIsShow = false;


  $scope.changeSize = function (frameSize) {
    dataForSent.formFrameSize = frameSize;
    $scope.formPrice = appService.calcPriceSaveForSent();
  };
  $scope.changeFrame = function (frameType) {
    dataForSent.formFrameType = frameType;
    updateMainClass();
    $scope.formPrice = appService.calcPriceSaveForSent();
  };
  $scope.changeBorder = function (borderType) {
    dataForSent.formBorderType = borderType;
    updateMainClass();
    $scope.formPrice = appService.calcPriceSaveForSent();
  };
  $scope.changeProduct = function (product) {
    $scope.productStates.forEach(function (item) {
      item.isActive = false
    });
    product.isActive = true;
    $scope.disableEdge = false;
    //disable edge form if border frame selected
    if (baseMainClass === 'canvas' && (dataForSent.formFrameType === "BF" || dataForSent.formFrameType === "WF" || dataForSent.formFrameType === "EF")) {
      $scope.disableEdge = true;
    }
    if (product.id === "PO") {
      $scope.formFrameType = dataForSent.formFrameType = null;
      $scope.formBorderType = dataForSent.formBorderType = null;
      $scope.borderOptions = formListOptions.print.borders;
      $scope.frameOptions = formListOptions.print.frame;
    }
    else if (product.id === "CP") {
      $scope.formFrameType = dataForSent.formFrameType = "150";
      $scope.formBorderType = dataForSent.formBorderType = "BB";
      $scope.borderOptions = formListOptions.canvas.borders;
      $scope.frameOptions = formListOptions.canvas.frame;
    }
    else if (product.id === "FP") {
      $scope.formFrameType = dataForSent.formFrameType = "BF";
      $scope.formBorderType = dataForSent.formBorderType = "630MA";
      $scope.borderOptions = formListOptions.inframe.borders;
      $scope.frameOptions = formListOptions.inframe.frame;
    }
    baseMainClass = product.class;
    updateMainClass();
    dataForSent.formProduct = product.id;
    $scope.formPrice = appService.calcPriceSaveForSent();
    //console.log(dataForSent);
  };
  function updateMainClass() {
    $('.product__before').css({'background-image': 'none'});
    $('.product__after').css({'background-image': 'none'});
    $scope.mainClass = baseMainClass;
    $scope.productClass = [productModefierPrefix + baseMainClass,
      productModefierPrefix + $scope.formFrameType,
      productModefierPrefix + $scope.formBorderType].join(' ');
    if ($scope.formBorderType === 'LB') {
      var picUrl = 'url("/static' + picData.full + '")';
      $('.product__before').css({'background-image': picUrl});
      $('.product__after').css({'background-image': picUrl});
    }
  }

  $scope.pic = picData;
  if (picData.sizes.length > 0) {
    dataForSent.formFrameSize = picData.sizes[0].value;
    dataForSent.imageBase64 = null;
    dataForSent.image = picData.full;
    $scope.formFrameSize = dataForSent.formFrameSize;
    $scope.sizeOptions = picData.sizes;
    !onServer && updateMainClass();
  }
  $scope.formPrice = appService.calcPriceSaveForSent();
  return $scope;
}

export default class ProductPage extends Layout {
  static async getInitialProps(obj) {
    const {query, req} = obj;
    const {pictureUrl} = query || {};

    const [
      baseProps,
      picture
    ] = await Promise.all([
      super.getInitialProps(obj),
      this.getPicture(pictureUrl)
    ]);

    if (picture) {
      baseProps.head.title = picture.name + ' от ' + picture.author;
    }

    return {
      ...baseProps,
      picture,
      pictureUrl,
      onServer: !!req
    }
  }

  static getPicture(pictureUrl) {
    return $http.post('/ajax/getPic.php', pictureUrl);
  }

  $scope = Cotroller(this.props.picture || {}, this.props.onServer);

  componentDidMount() {
    $("body").animate({scrollTop: 0}, 1);
  }

  content() {
    const {$scope, props} = this;
    const {pictureUrl} = props;

    return (
      <section className={"container m-padding-main " + $scope.mainClass}>
        <div className="row">
          <div className="col-xs-12 col-sm-7 col-lg-8 m-text_center">
            <div className={"product " + $scope.productClass} id="productImage">
              <div className="product__before"></div>
              <div className="product__frame">
                <div className="product__split product__split--top"></div>
                <div className="product__split product__split--bottom"></div>
                <div className="product__mate">
                  <div className="product__shadow">
                    <img className="product__image__img" id="mainPicture" src={'/static' + $scope.pic.full} alt={$scope.pic.name}/>
                  </div>
                </div>
              </div>
              <div className="product__after"></div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-5 col-lg-4 ">
            <div className="product-info">
              <div className="product-info__header">
                <h1 className="product-info__header__title">{$scope.pic.name}</h1>
                <p className="product-info__header__author">Автор:&nbsp;
                  <ParamLink url='/user/:userUrl' params={{userUrl: $scope.pic.urlname}} title={$scope.pic.author}/>
                </p>
              </div>
              <hr/>
              <form action={"/shipping/" + pictureUrl} className="form">
                <div className="form__samples row">
                  {
                    $scope.productStates.map(product=> (
                      <div className="col-xs-4" key={product.id}>
                        <input id={"product-" + product.id} type="radio" name="product_code" className="radio radio--image"
                               onChange={e=> ($scope.formProduct = e.target.value) & $scope.changeProduct(product) & this.forceUpdate()}
                               value={product.id}
                               checked={$scope.formProduct === product.id}/>
                        <label htmlFor={"product-" + product.id}>
                          <small>{product.name}</small>
                          <img src={"/static/img/products/product-" + product.id + '.jpg'} alt="Тип продукта"/>
                        </label>
                      </div>
                    ))
                  }
                </div>
                <div className="form__row">
                  <a href="#" className="btn btn-block btn-helper" data-toggle="modal" data-target="#samples">Посмотреть
                    примеры</a>
                </div>
                <div className="form__row form__row--size">
                  <label htmlFor="imgSizing">Размер</label>
                  <div className="select">
                    <select id="imgSizing" name="size" required value={$scope.formFrameSize || ''}
                            onChange={e=> ($scope.formFrameSize = e.target.value) & $scope.changeSize($scope.formFrameSize) & this.forceUpdate()}>
                      {$scope.sizeOptions.map(o=> (
                        <option key={o.value} value={o.value}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form__row form__row--frame">
                  <label htmlFor="imgFrame">Рамка</label>
                  <div className="select">
                    <select id="imgFrame" name="frame" required value={$scope.formFrameType || ''}
                            onChange={e=> ($scope.formFrameType = e.target.value) & $scope.changeFrame($scope.formFrameType) & this.forceUpdate()}>
                      {$scope.frameOptions.map(o=> (
                        <option key={o.value} value={o.value}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form__row form__row--border">
                  <label htmlFor="imgEdge">Края</label>
                  <div className="select">
                    <select id="imgEdge" name="edge" required value={$scope.formBorderType || ''}
                            disabled={$scope.disableEdge}
                            onChange={e=> ($scope.formBorderType = e.target.value) & $scope.changeBorder($scope.formBorderType) & this.forceUpdate()}>
                      {$scope.borderOptions.map(o=> (
                        <option key={o.value} value={o.value}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form__price">{$scope.formPrice}<span className="form__price__rouble m-rubble">i</span></div>

                <input className="btn btn-info btn-lg" type="submit" style={{display: 'block', width: '100%'}}
                       value="Оформить доставку"/>
                <small className="m-text_info">100% гарантия возврата средств</small>
                <br/>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}