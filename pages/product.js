import React from 'react';
import Router from 'next/router';

// services
import $http from '../services/$http';
import appService from '../services/appService';

// components
import Layout from '../components/layout';
import ParamLink from '../components/paramLink';
import ProductTypeSelector from '../components/ProductTypeSelector';

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
    dataForSent.imageBase64 = null;
    dataForSent.image = picData.full;
    !onServer && updateMainClass();
  } 
  $scope.sizeOptions = formListOptions.sizesV;
  $scope.imageProportion = appService.imageProp;
  if(appService.imageProp > 1 ) {
    $scope.formFrameSize = appService.optionsList.sizesH[1].value;
    $scope.sizeOptions = formListOptions.sizesH;
  }
  $scope.formPrice = appService.calcPriceSaveForSent();


  $scope.changeSize = function (frameSize, state) {
    $scope.formFrameSize = frameSize;
    $scope.mounted && updateImageProportions();
    updateBordersSizes();
  };
  $scope.changeFrame = function (frameType) {
    dataForSent.formFrameType = frameType;
    $scope.formFrameType = frameType;
    updateMainClass();
    $scope.formPrice = appService.calcPriceSaveForSent();
  };
  $scope.changeBorder = function (borderType, state) {
    $scope.formBorderType = borderType;
    updateMainClass();
    updateBordersSizes();
  };
  $scope.changeProduct = function (product, state) {
    console.log(state);
    baseMainClass = product.class;
    $scope.formProduct = product.id;
    $scope.formFrameType = state.frameType;
    $scope.formFrameSize = state.frameSize;
    $scope.formBorderType = state.edgeType;

    updateMainClass();
    updateBordersSizes();
  };
  $scope.updateImageProportions = updateImageProportions;
  $scope.updateMainClass = updateMainClass;

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
    const maxImageHeight = window.innerHeight - document.querySelector('.header').offsetHeight - 130;
    const maxImageWidth = document.querySelector('.product-wrapper').offsetWidth;
    
    const params = $scope.formFrameSize.split('|');
    const selectedHeight = params[0];
    const selectedWidth = params[1];
    const proportions = selectedHeight / selectedWidth;
    
    let mainImageWidth = maxImageWidth;
    let mainImageHeight = mainImageWidth * proportions;
    
    if(mainImageHeight > maxImageHeight) {
      mainImageHeight = maxImageHeight;
      mainImageWidth = mainImageHeight / proportions;
    }

    return {
      'height': mainImageHeight,
      'width': mainImageWidth,
      'proportions': proportions
    }
  }
  function updateBordersSizes() {
    const {height} = getImageData();
    const [selectedHeight] = $scope.formFrameSize.split('|');

    const mateBorderSize = $scope.formBorderType === '630MA' ? 6 : 0;
    const frameBorderSize = $scope.formProduct === 'FP' ? 2.2 : 0;
    const mate = height * mateBorderSize / selectedHeight;
    const frame = height * frameBorderSize / selectedHeight;
    console.log({ mate, frame })
    $scope.mateSize = mate;
    $scope.frameSize = frame;
  }
  function updateImageProportions(){
    $scope.productImageHeight = getImageData().height;
    $scope.productImageWidth = getImageData().width;
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
          <div className="col-xs-12 col-sm-7 col-lg-8 m-text_center product-wrapper">
            <div className={"product product--loaded " + $scope.productClass} id="productImage" style={{'height': $scope.productImageHeight + 'px', 'width': $scope.productImageWidth + 'px'}}>
              <div className="product__before"></div>
              <div className="product__frame" style={{'padding': $scope.frameSize + 'px'}}>
                <div className="product__split product__split--top"></div>
                <div className="product__split product__split--bottom"></div>
                <div className="product__mate" style={{'padding': $scope.mateSize + 'px'}}>
                  <div className="product__shadow">
                    <div className="product__image" id="image-container" style={{'height': '100%', 'width': '100%', 'backgroundImage': `url(${$scope.pic.full})`}}>
                      <img className="product__image__img" id="mainPicture" src={$scope.pic.full} alt={$scope.pic.name} style={{'height': '100%', 'width': '100%'}} />
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
                <ProductTypeSelector
                  imageProportion={$scope.imageProportion}
                  onProductTypeChange={(product, state)=>{$scope.changeProduct(product, state) & this.forceUpdate()}}
                  onEdgeTypeChange={(edgeType, state)=>{$scope.changeBorder(edgeType, state) & this.forceUpdate()}}
                  onFrameSizeChange={(frameSize, state)=>{$scope.changeSize(frameSize, state) & this.forceUpdate()}}
                />
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