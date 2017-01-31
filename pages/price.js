import React from 'react';

import Layout from '../components/layout';

import appService from '../services/appService';

export default class Price extends Layout {
  _getInitialState() {
    var dataForSent = appService.dataForSent;
    var formListOptions = appService.optionsList;
    var borderType = '';
    var arrCoastsAndSizes = [];

    let $scope = {};

    //Default states
    $scope.formProduct =        dataForSent.formProduct;
    $scope.formBorderType =     dataForSent.formBorderType;
    $scope.formFrameType =      dataForSent.formFrameType;
    $scope.productStates =      appService.productStates;

    $scope.sizeOptions =        formListOptions.sizes;
    $scope.borderOptions =      formListOptions.canvas.borders;
    $scope.frameOptions =      formListOptions.canvas.frame;

    $scope.width = formListOptions.sizes[0].value;
    $scope.height = formListOptions.sizes[0].value;
    $scope.tableArr = [];


    $scope.calcPrice = ()=> {
      this.inited && ($scope = this.state);

      switch ($scope.formProduct){
        default:
        case 'CP':
          borderType = $scope.formFrameType;
          break;
        case 'FP':
          borderType = $scope.formBorderType;
          break;
      }
      $scope.price = appService.calcPrice($scope.width, $scope.height, $scope.formProduct, borderType);

      // $scope.applay()
      this.inited && this.setState($scope);
    };

    $scope.changeProduct = (product)=> {
      this.inited && ($scope = this.state);

      var productType = product.id;
      $scope.productStates.forEach(function(item){
        item.isActive = false
      });
      product.isActive = true;
      $scope.disableEdge = false;

      if(productType === "PO"){
        $scope.formFrameType = dataForSent.formFrameType = null;
        $scope.formBorderType = dataForSent.formBorderType = null;
        $scope.borderOptions = formListOptions.print.borders;
        $scope.frameOptions = formListOptions.print.frame;
      }
      else if(productType === "CP"){
        $scope.formFrameType = dataForSent.formFrameType =  "150";
        $scope.formBorderType = dataForSent.formBorderType =  "BB";
        $scope.borderOptions = formListOptions.canvas.borders;
        $scope.frameOptions = formListOptions.canvas.frame;
      }
      else if(productType === "FP") {
        $scope.formFrameType = dataForSent.formFrameType = "BF";
        $scope.formBorderType = dataForSent.formBorderType = "630MA";
        $scope.borderOptions = formListOptions.inframe.borders;
        $scope.frameOptions = formListOptions.inframe.frame;
      }
      $scope.formProduct = productType;
      $scope.calcPrice();
    };

    $scope.tableArr = getCoastArrForTable();
    function getCoastArrForTable () {
      var sizes = formListOptions.sizesH;
      var productStates = appService.productStates;
      sizes.forEach(function(item){
        var size = item.value.split('|'),
          width = size[0]*1,
          height = size[1]*1,
          POCoast = appService.calcPrice(width, height, productStates[0].id),
          canvas150Coast = appService.calcPrice(width, height, productStates[1].id, appService.optionsList.canvas.frame[0].value),
          canvas300Coast = appService.calcPrice(width, height, productStates[1].id, appService.optionsList.canvas.frame[1].value),
          frame630MACoast = appService.calcPrice(width, height, productStates[2].id, appService.optionsList.inframe.borders[0].value),
          frameNOMACoast = appService.calcPrice(width, height, productStates[2].id, appService.optionsList.inframe.borders[1].value);


        var arrItem = {
          sizeName: width + ' x ' + height,
          printCoast: POCoast,
          canvas150Coast: canvas150Coast,
          canvas300Coast: canvas300Coast,
          frameNOMACoast: frameNOMACoast,
          frame630MACoast: frame630MACoast
        };
        arrCoastsAndSizes.push(arrItem);
      });
      return arrCoastsAndSizes
    }
    $scope.calcPrice();

    this.inited = true;
    return $scope;
  }

  state = this._getInitialState();

  content() {
    const $scope = this.state;

    return (
      <div className="price-bg price-bg--show">
        <section className="container m-padding-default">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-lg-5">
              <h1 className="h1 big">Цены</h1>
              <h4 className="m-text_big">Эта страница создана специально для того, чтобы вы могли легко посчитать
                стоимость картины. Выберете параметры вручную и узнайте цену, или найдите цены стандартных размеров в
                таблице ниже.</h4>
            </div>
          </div>
        </section>
        <section className="container price-calc">
          <h2>Калькулятор цен</h2>
          <div className="box">
            <div className="row">
              <div className="col-xs-12 col-sm-8 col-lg-8">
                <div className="row">
                  {$scope.productStates.map(product=> (
                    <div className="col-xs-4" key={product.id}>
                      <input id={`product-${product.id}`} type="radio" name="product_code" className="radio radio--image"
                             onChange={e=> this.setState({formProduct: e.target.value})} value={product.id} onClick={e=> $scope.changeProduct(product)}
                             checked={$scope.formProduct === product.id}/>
                      <label htmlFor={`product-${product.id}`}>
                        <small>{product.name}</small>
                        <img src={`/static/img/products/product-${product.id}.jpg`} alt="Тип продукта"/>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="row price-calc__params">
                  <div className="col-xs-4">
                    <label className="m-text_small" htmlFor="imgWidth">Ширина</label>
                    <div className="select">
                      <select id="imgWidth" name="size" required value={$scope.width}
                              onChange={e=> this.setState({width: e.target.value}, $scope.calcPrice)}>
                        {$scope.sizeOptions.map(o=> (
                          <option value={o.value} key={o.value}>{o.name}</option>
                        ))}
                      </select>
                      <span className="select__width-separator">&nbsp;x&nbsp;</span>
                    </div>

                  </div>
                  <div className="col-xs-4">
                    <label className="m-text_small" htmlFor="imgHeight">Высота</label>
                    <div className="select">
                      <select id="imgHeight" name="size" required value={$scope.height}
                              onChange={e=> this.setState({height: e.target.value}, $scope.calcPrice)}>
                        {$scope.sizeOptions.map(o=> (
                          <option value={o.value} key={o.value}>{o.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-xs-4">
                    {
                      $scope.formProduct === 'CP' && (
                        <div>
                          <label className="m-text_small" htmlFor="imgFrame">Подрамник</label>
                          <div className="select">
                            <select id="imgFrame" name="frame" required value={$scope.formFrameType || ''}
                                    onChange={e=> this.setState({formFrameType: e.target.value}, $scope.calcPrice)}>
                              {$scope.frameOptions.map(o=> (
                                <option value={o.value} key={o.value}>{o.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )
                    }
                    {
                      $scope.formProduct === 'FP' && (
                        <div>
                          <label className="m-text_small" htmlFor="imgFrame">Края</label>
                          <div className="select">
                            <select id="imgEdge" name="edge" required value={$scope.formBorderType || ''}
                                    onChange={e=> this.setState({formBorderType: e.target.value}, $scope.calcPrice)}>
                                    disabled={$scope.disableEdge}>
                              {$scope.borderOptions.map(o=> (
                                <option value={o.value} key={o.value}>{o.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-lg-4">
                <div className="price-calc__summary m-text_center">
                  <span>Размеры: {$scope.width} см x {$scope.height} см</span> <br/>
                  <span className="price-calc__summary__coast">{$scope.price}<span
                    className="form__price__rouble m-rubble">i</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container m-padding-main">
          <h2>Таблица стандартных размеров</h2>
          <table className="table table-striped table--price">
            <thead>
            <tr className="table--no-border">
              <th className="w20">размеры <br/> в см</th>
              <th className="w20">печать</th>
              <th className="w20">холст, <br/> подрамник 1,5см</th>
              <th className="w20">холст, <br/> подрамник 3см</th>
              <th className="w20">в раме</th>
              <th className="w20">в раме, <br/> матовые края</th>
            </tr>
            </thead>
            <tbody>
            {
              $scope.tableArr.map((row, i)=> (
                <tr key={i}>
                  <td>{row.sizeName}</td>
                  <td>{row.printCoast} <span className="form__price__rouble m-rubble">i</span></td>
                  <td>{row.canvas150Coast} <span className="form__price__rouble m-rubble">i</span></td>
                  <td>{row.canvas300Coast} <span className="form__price__rouble m-rubble">i</span></td>
                  <td>{row.frameNOMACoast} <span className="form__price__rouble m-rubble">i</span></td>
                  <td>{row.frame630MACoast} <span className="form__price__rouble m-rubble">i</span></td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}