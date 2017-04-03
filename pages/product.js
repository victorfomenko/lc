import React from 'react';
import Router from 'next/router';

// services
import $http from '../services/$http';
import appService from '../services/appService';

// components
import Layout from '../components/layout';
import ParamLink from '../components/paramLink';
import ProductTypeSelector from '../components/ProductTypeSelector';
import ProductPreview from '../components/ProductPreview';

function Cotroller(picData) {
  var $scope = {};
  var productModefierPrefix = 'product--';
  var dataForSent = appService.dataForSent;
  var baseMainClass = appService.productStates[1].class;
  $scope.mainClass = baseMainClass;
  $scope.samplesIsShow = false;
  $scope.formBorderType = dataForSent.formBorderType;
  $scope.formFrameType = dataForSent.formFrameType;
  $scope.formProduct = dataForSent.formProduct;
  $scope.formFrameSize = appService.optionsList.sizesV[1].value;

  //Default states
  $scope.pic = picData;
  if (picData.sizes.length > 0) {
    const [ width, height ] = picData.sizes[0].value.split('|');
    appService.imageProp = calcProportions({ width, height });
    dataForSent.imageBase64 = null;
    dataForSent.image = picData.full;
  } 
  $scope.imageProportion = appService.imageProp;
  if(appService.imageProp > 1 ) {
    $scope.formFrameSize = appService.optionsList.sizesH[1].value;
    dataForSent.formFrameSize = $scope.formFrameSize;
  }
  dataForSent.formPrice = appService.calcPriceSaveForSent();


  $scope.changeSize = function (frameSize, state) {
    $scope.formFrameSize = frameSize;
    dataForSent.formFrameSize = frameSize;
    dataForSent.formPrice = state.price;
  };
  $scope.changeFrame = function (frameType, state) {
    $scope.formFrameType = frameType;
    dataForSent.formFrameType = frameType;
    dataForSent.formPrice = state.price;
  };
  $scope.changeBorder = function (borderType, state) {
    $scope.formBorderType = borderType;
    dataForSent.formBorderType = borderType;
    dataForSent.formPrice = state.price;
  };
  $scope.changeProduct = function (product, state) {
    baseMainClass = product.class;
    $scope.formProduct = product.id;
    $scope.formFrameType = state.frameType;
    $scope.formFrameSize = state.frameSize;
    $scope.formBorderType = state.edgeType;

    dataForSent.formProduct = product.id;
    dataForSent.formPrice = state.price;
    dataForSent.formFrameType = state.frameType;
    dataForSent.formFrameSize = state.frameSize;
    dataForSent.formBorderType = state.edgeType;

  };

 
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
      pictureUrl
    }
  }

  static getPicture(pictureUrl) {
    return $http.post('/ajax/getPic.php', pictureUrl);
  }

  constructor(...args) {
    super(...args);
    try {
      this.$scope = Cotroller(this.props.picture || {});
    } catch (e) {
      console.error(e.stack)
    }
  }

  componentDidMount() {
    $("body").animate({scrollTop: 0}, 1);
    this.$scope.mounted = true;
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
          <ProductPreview
            frameHeight={Number($scope.formFrameSize.split('|')[0])}
            frameWidth={Number($scope.formFrameSize.split('|')[1])}
            edgeType={$scope.formBorderType}
            frameType={$scope.formFrameType}
            productType={$scope.formProduct}
            picture={$scope.pic.full}
            pictureName={$scope.pic.name}
          />
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
                  edgeType={$scope.formBorderType}
                  frameType={$scope.formFrameType}
                  frameSize={$scope.formFrameSize}
                  productType={$scope.formProduct}
                  onProductTypeChange={(product, state)=>{$scope.changeProduct(product, state) & this.forceUpdate()}}
                  onEdgeTypeChange={(edgeType, state)=>{$scope.changeBorder(edgeType, state) & this.forceUpdate()}}
                  onFrameSizeChange={(frameSize, state)=>{$scope.changeSize(frameSize, state) & this.forceUpdate()}}
                  onFrameTypeCahnge={(frameType, state)=>{$scope.changeFrame(frameType, state) & this.forceUpdate()}}
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