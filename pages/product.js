import React from 'react';
import Router from 'next/router';

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

  //Default states
  $scope.formFrameSize =      appService.optionsList.sizesV[1].value;
  $scope.sizeOptions =        formListOptions.sizesV;
  $scope.pic = picData;

  if (picData.sizes.length > 0) {
    const [ width, height ] = picData.sizes[0].value.split('|');
    appService.imageProp = calcProportions({ width, height });
    //dataForSent.formFrameSize = picData.sizes[0].value;
    dataForSent.imageBase64 = null;
    dataForSent.image = picData.full;
    //$scope.formFrameSize = dataForSent.formFrameSize;
    //$scope.sizeOptions = picData.sizes;
    !onServer && updateMainClass();
  } 
  $scope.sizeOptions = formListOptions.sizesV;

  if(appService.imageProp > 1 ) {
    $scope.formFrameSize = appService.optionsList.sizesH[1].value;
    $scope.sizeOptions = formListOptions.sizesH;
  }
  $scope.formPrice = appService.calcPriceSaveForSent();


  $scope.changeSize = function (frameSize) {
    dataForSent.formFrameSize = frameSize;
    $scope.mounted && updateImageProportions();
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
  $scope.changeProportionsNoteText = changeProportionsNoteText;
  $scope.updateImageProportions = updateImageProportions;
  function updateMainClass() {
    $('.product__before').css({'background-image': 'none'});
    $('.product__after').css({'background-image': 'none'});
    $scope.mainClass = baseMainClass;
    $scope.productClass = [productModefierPrefix + baseMainClass,
      productModefierPrefix + $scope.formFrameType,
      productModefierPrefix + $scope.formBorderType].join(' ');
    if ($scope.formBorderType === 'LB') {
      var picUrl = 'url("' + picData.full + '")';
      $('.product__before').css({'background-image': picUrl});
      $('.product__after').css({'background-image': picUrl});
    }
  }
  function proportions() {
    var frameProportions = getImageData().proportions,
      imageHeight = document.getElementById('mainPicture').naturalHeight,
      imageWidth = document.getElementById('mainPicture').naturalWidth,
      imageProportions = imageHeight/imageWidth,
      result = 1;
    if(frameProportions<imageProportions) result = -1;
    if ( Math.round(frameProportions*100)/100 === Math.round(imageProportions*100)/100) result = 0;
    return result
  }
  function getImageData () {
    var params = $scope.formFrameSize.split('|'),
      selectedHeight = params[0],
      selectedWidth = params[1],
      proportions = selectedHeight / selectedWidth,
      mainImageWidth = document.getElementById('image-container').offsetWidth,
      mainImageHeight = mainImageWidth * proportions;
    return {
      'height': mainImageHeight+ 'px',
      'width': mainImageWidth+ 'px',
      'proportions': proportions
    }
  }
  function updateImageProportions(){
    $scope.productImageHeight = getImageData().height;
    changeProportionsNoteText();
  }
  function changeProportionsNoteText () {
    $scope.showProportionsNoteText = '';
    $scope.showProportionsNote = false;
    if (proportions() === -1 || proportions() === 1) {
      $scope.showProportionsNote = true;
      $scope.showProportionsNoteText = '(фото обрежется по краям)'
    }
    if (proportions() === 0) {
      $scope.showProportionsNote = true;
      $scope.showProportionsNoteText = '(идеальный)'
    }
  }
  function calcProportions({ width, height }) {
    if(typeof width !== 'number' || typeof height !== 'number') {
      width = Number(width);
      height = Number(height);
    }
    if(isNaN(width) || isNaN(height)){
      console.warn('width or height is not a number')
      return null;
    }
    return height / width;
  }
  
  return $scope;
}

export default class ProductPage extends Layout {
  static async getInitialProps(obj) {
    const baseProps = await super.getInitialProps(obj);
    let picture;

    const {query, req} = obj;
    const {pictureUrl} = query || {};

    if (pictureUrl) {
      picture = await this.getPicture(pictureUrl);

      if (picture) {
        baseProps.head.title = picture.name + ' от ' + picture.author;
        picture.full = '/static' + picture.full;
      }
    } else {
      const file = appService.dataForSent.imageBase64;
      if (file) {
        picture = {
          full: file,
          sizes: []
        }
      }
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

  constructor(...args) {
    super(...args);
    try {
      this.$scope = Cotroller(this.props.picture || {}, this.props.onServer);
    } catch (e) {
      console.error(e.stack)
    }
  }

  componentDidMount() {
    $("body").animate({scrollTop: 0}, 1);
    this.$scope.mounted = true;
    this.$scope.changeProportionsNoteText();
    this.$scope.updateImageProportions();
    this.forceUpdate();
  }

  onSubmit(e) {
    e.preventDefault();
    Router.push('/shipping')
  }

  content() {
    const {$scope, props} = this;
    const {pictureUrl} = props;

    return (
      <section className={"container m-padding-main " + $scope.mainClass}>
        <div className="row">
          <div className="col-xs-12 col-sm-7 col-lg-8 m-text_center">
            <div className={"product product--loaded " + $scope.productClass} id="productImage">
              <div className="product__before"></div>
              <div className="product__frame">
                <div className="product__split product__split--top"></div>
                <div className="product__split product__split--bottom"></div>
                <div className="product__mate">
                  <div className="product__shadow">
                    <div className="product__image" id="image-container" style={{'height': $scope.productImageHeight, 'backgroundImage': `url(${$scope.pic.full})`}}>
                      <img className="product__image__img" id="mainPicture" src={$scope.pic.full} alt={$scope.pic.name} style={{'height': $scope.productImageHeight}} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="product__after"></div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-5 col-lg-4 ">
            <div className="product-info">
              {
                $scope.pic.author && (
                  <div className="product-info__header">
                    <h1 className="product-info__header__title">{$scope.pic.name}</h1>
                    <p className="product-info__header__author">Автор:&nbsp;
                      <ParamLink url='/user/:userUrl' params={{userUrl: $scope.pic.urlname}} title={$scope.pic.author}/>
                    </p>
                  </div>
                )
              }
              {$scope.pic.author && <hr/>}
              <form action="/shipping/" onSubmit={e=> this.onSubmit(e)} className="form">
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
                  <label htmlFor="imgSizing">Размер&nbsp; {
                    $scope.showProportionsNote && (
                      <span className="form__row__note m-text_info">{$scope.showProportionsNoteText}</span>
                    )
                  }</label>
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