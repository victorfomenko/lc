import React, { Component } from 'react';

import { productTypes } from '../helpers/productTypes'
import appService from '../services/appService';

class ProductTypeSelector extends Component {
	constructor(props) {
		super(props);
		this.onProductTypeChange = this.onProductTypeChange.bind(this)
		this.onFrameSizeChange = this.onFrameSizeChange.bind(this)
		this.onFrameTypeCahnge = this.onFrameTypeCahnge.bind(this)
		this.onEdgeTypeChange = this.onEdgeTypeChange.bind(this)
		this.state = this.prepareState(props)
	}

	prepareState(props){
		const noteText = 		'(фото обрежется по краям)';
		const showNoteText = 	false;
  		let frameSize = 		appService.optionsList.sizesV[1].value;
  		let sizeOptions = 		appService.optionsList.sizesV;

  		if(props.imageProportion > 1 ) {
    		frameSize = 		appService.optionsList.sizesH[1].value;
	    	sizeOptions = 		appService.optionsList.sizesH;
  		}

  		const { 
  			frameType,
  			edgeType, 
  			productType, 
  			borderOptions, 
  			frameOptions, 
  			price 
  		} = this.getProductState(props.productType, props.frameSize, props.frameType, props.edgeType);

  		return {
  			productType,
  			noteText,
  			frameType,
  			edgeType,
  			frameSize,
  			sizeOptions,
  			frameOptions,
  			borderOptions,
  			price
  		}
	}

	getProductState(productType, frameSize, frameType=null, edgeType=null){
		let borderOptions = [];
		let frameOptions = [];
		if (productType === 'PO') {
	      borderOptions = appService.optionsList.print.borders;
	      frameOptions = appService.optionsList.print.frame;
	    }
	    else if (productType === 'CP') {
	      frameType = frameType || '150';
	      edgeType = edgeType || 'BB';
	      borderOptions = appService.optionsList.canvas.borders;
	      frameOptions = appService.optionsList.canvas.frame;
	    }
	    else if (productType === 'FP') {
	      frameType = frameType || 'BF';
	      edgeType = edgeType || '630MA';
	      borderOptions = appService.optionsList.inframe.borders;
	      frameOptions = appService.optionsList.inframe.frame;
	    }
	    const [ width, height ] = frameSize.split('|');
		const price = appService.calcPrice(width, height, productType, frameType)

		return {
			frameType,
	    	edgeType,
	    	productType,
	    	borderOptions,
	    	frameOptions,
	    	price
	    }
	}

	onProductTypeChange(product) {
		const state = this.getProductState(product.id, this.state.frameSize)

	    this.setState(state, () => {
    		if(this.props.onProductTypeChange) {this.props.onProductTypeChange(product, this.state)}
	    })
		
	}

	onFrameSizeChange(e){
		const frameSize = e.target.value;
		const [ width, height ] = frameSize.split('|');
		let price = appService.calcPrice(width, height, this.state.productType, this.state.frameType)
		if(this.state.productType == 'FP'){
			price = appService.calcPrice(width, height, this.state.productType, this.state.edgeType)
		}
		

		this.setState({ frameSize, price }, ()=>{
			if(this.props.onFrameSizeChange) {this.props.onFrameSizeChange(frameSize, this.state)}
		})
	}

	onFrameTypeCahnge(e){
		const frameType = e.target.value;
		const [ width, height ] = this.state.frameSize.split('|');
		let price = appService.calcPrice(width, height, this.state.productType, frameType)
		if(this.state.productType == 'FP'){
			price = appService.calcPrice(width, height, this.state.productType, this.state.edgeType)
		}
		this.setState({ frameType, price }, () => {
			if(this.props.onFrameTypeCahnge) {this.props.onFrameTypeCahnge(frameType, this.state)}
		})
		
		
	}

	onEdgeTypeChange(e){
		const edgeType = e.target.value;
		const [ width, height ] = this.state.frameSize.split('|');
		const price = appService.calcPrice(width, height, this.state.productType, edgeType)

		this.setState({ edgeType, price }, ()=>{
			if(this.props.onEdgeTypeChange) {this.props.onEdgeTypeChange(edgeType, this.state)}	
		})
		
	}

	changeProportionsNoteText (imageProportion, frameSize) {
		let showNoteText = true;
		const [width, height] = frameSize.split('|');
		const frameProportion = this.calcProportion({ width, height });
		const relation = this.getFrameImageRelation(imageProportion, frameProportion);

		if (relation === 0) { showNoteText = false }

		this.setState({ showNoteText })
	}

	calcProportion({ width, height }) {
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

	getFrameImageRelation(imageProportion, frameProportion) {
	    let result = 1;
	    if(frameProportion<imageProportion) result = -1;
	    if ( Math.round(frameProportion*100)/100 === Math.round(imageProportion*100)/100) result = 0;
	    return result
  	}

	render(){
		const { 
			frameType,
			frameSize,
			sizeOptions,
			edgeType,
			productType,
			noteText,
			showNoteText,
			price,
			borderOptions,
			frameOptions,
		} = this.state;
    	return (
    		<div>
				<div className='form__samples row'>
			      {
			        productTypes.map(product=> (
			          <div className='col-xs-4' key={product.id}>
			            <input id={'product-' + product.id} type='radio' name='product_code' className='radio radio--image'
			                   onChange={e=>{this.onProductTypeChange(product)}}
			                   value={product.id}
			                   checked={productType === product.id}/>
			            <label htmlFor={'product-' + product.id}>
			              <small>{product.name}</small>
			              <img src={'/static/img/products/product-' + product.id + '.jpg'} alt='Тип продукта'/>
			            </label>
			          </div>
			        ))
			      }
			    </div>
			    <div className='form__row'>
			      <a href='#' className='btn btn-block btn-helper' data-toggle='modal' data-target='#samples'>Посмотреть
			        примеры</a>
			    </div>
			    <div className='form__row form__row--size'>
			      <label htmlFor='imgSizing'>Размер&nbsp; {
			        showNoteText && (productType !== 'PO') && (
			          <span className='form__row__note m-text_info'>{noteText}</span>
			        )
			      }</label>
			      <div className='select'>
			        <select id='imgSizing' 
			        		name='size' required
			        		value={frameSize}
			                onChange={this.onFrameSizeChange}>
			          {sizeOptions.map(o=> (
			            <option key={o.value} value={o.value}>{o.name}</option>
			          ))}
			        </select>
			      </div>
			    </div>
			    { 	productType !== 'PO' ? 
			    	<div>
						<div className='form__row form__row--frame'>
					      <label htmlFor='imgFrame'>Рамка</label>
					      <div className='select'>
					        <select id='imgFrame' 
					        		name='frame'
					        		required 
					        		value={frameType}
				                	onChange={this.onFrameTypeCahnge}>
					          {frameOptions.map(o=> (
					            <option key={o.value} value={o.value}>{o.name}</option>
					          ))}
					        </select>
					      </div>
					    </div>
					    <div className='form__row form__row--border'>
					      <label htmlFor='imgEdge'>Края</label>
					      <div className='select'>
					        <select id='imgEdge' 
					        		name='edge' 
					        		required
					        		value={edgeType}
					                onChange={this.onEdgeTypeChange}>
					          {borderOptions.map(o=> (
					            <option key={o.value} value={o.value}>{o.name}</option>
					          ))}
					        </select>
					      </div>
					    </div>
				    </div>
				    : null 
				}
			    <div className='form__price'>{price}<span className='form__price__rouble m-rubble'>i</span></div>
		    </div>
    	)
	}
}


ProductTypeSelector.propTypes = {
  onProductTypeChange: React.PropTypes.func,
  onFrameSizeChange: React.PropTypes.func,
  onEdgeTypeChange: React.PropTypes.func,
  onFrameTypeCahnge: React.PropTypes.func,
  imageProportion: React.PropTypes.number.isRequired,
  productType: React.PropTypes.string,
  frameType: React.PropTypes.string,
  frameSize: React.PropTypes.string,
  edgeType: React.PropTypes.string,
};

export default ProductTypeSelector
