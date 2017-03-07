import React, { Component } from 'react';

import { productTypes } from '../helpers/productTypes'
import appService from '../services/appService';

class ProductPreview extends Component {
	constructor(props) {
		super(props);
		const productClass = this.getProductClassName(props.productType, props.frameType, props.edgeType);
		
		this.state = {
			productClass,
			frameSize: 0,
			mateSize: 0,
			width: 0,
			height: 0
		}
	}

	componentWillReceiveProps(nextProps) {
		const productClass = this.getProductClassName(nextProps.productType, nextProps.frameType, nextProps.edgeType);
		const { mateSize, frameSize } = this.getBordersSizes(nextProps.frameHeight, nextProps.frameWidth, nextProps.productType, nextProps.edgeType);
		const { width, height } = this.getImageData(nextProps.frameHeight, nextProps.frameWidth);
		this.updateEdgeType(nextProps.edgeType, nextProps.picture)

		this.setState({
			productClass,
			frameSize,
			mateSize,
			height,
			width,
		});
	}

	componentDidMount() {
		const { mateSize, frameSize } = this.getBordersSizes(this.props.frameHeight, this.props.frameWidth, this.props.productType, this.props.edgeType);
		const { width, height } = this.getImageData(this.props.frameHeight, this.props.frameWidth);
		this.updateEdgeType(this.props.edgeType, this.props.picture)

		this.setState({
			width,
			height,
			mateSize,
			frameSize,
		});
	}

	updateEdgeType(edgeType, picture) {
		$('.product__before').css({'background-image': 'none'});
		$('.product__after').css({'background-image': 'none'});
		if (edgeType === 'LB') {
			const picUrl = `url('${picture}')`;
			$('.product__before').css({'background-image': picUrl});
			$('.product__after').css({'background-image': picUrl});
		}
	}

	getProductClassName(productType, frameType, edgeType){
		const productModefierPrefix = 'product--';
		let productTypeClass = 	`${productModefierPrefix}${productType}`;
		let edgeTypeClass = 	`${productModefierPrefix}${edgeType}`;
		let frameTypeClass = 	`${productModefierPrefix}${frameType}`;

		return [productTypeClass, edgeTypeClass, frameTypeClass].join(' ');
	}

	getImageData (frameHeight, frameWidth) {
		const maxImageHeight = window.innerHeight - document.querySelector('.header').offsetHeight - 130;
		const maxImageWidth = document.querySelector('.product-wrapper').offsetWidth;
		const proportions = frameHeight / frameWidth;

		let mainImageWidth = maxImageWidth;
		let mainImageHeight = mainImageWidth * proportions;

		if(mainImageHeight > maxImageHeight) {
		  mainImageHeight = maxImageHeight;
		  mainImageWidth = mainImageHeight / proportions;
		}

		return {
		  'height': mainImageHeight,
		  'width': mainImageWidth
		}
	}

	getBordersSizes(frameHeight, frameWidth, productType, edgeType) {
		const { height } = this.getImageData(frameHeight, frameWidth);

		const mateBorderSize = edgeType === '630MA' ? 6 : 0;
		const borderSize = productType === 'FP' ? 2.2 : 0;
		const mateSize = height * mateBorderSize / frameHeight;
		const frameSize = height * borderSize / frameHeight;

		return { mateSize, frameSize }
	}

	render(){
		const { height, width, mateSize, frameSize, productClass } = this.state;
		const { picture, pictureName } = this.props;
		return (
			<div className="col-xs-12 col-sm-7 col-lg-8 m-text_center product-wrapper">
				<div className={"product product--loaded " + productClass} id="productImage" style={{'height': height + 'px', 'width': width + 'px'}}>
				  <div className="product__before"></div>
				  <div className="product__frame" style={{'padding': frameSize + 'px'}}>
				    <div className="product__split product__split--top"></div>
				    <div className="product__split product__split--bottom"></div>
				    <div className="product__mate" style={{'padding': mateSize + 'px'}}>
				      <div className="product__shadow">
				        <div className="product__image" id="image-container" style={{'height': '100%', 'width': '100%', 'backgroundImage': `url(${picture})`}}>
				          <img className="product__image__img" id="mainPicture" src={picture} alt={pictureName} style={{'height': '100%', 'width': '100%'}} />
				        </div>
				      </div>
				    </div>
				  </div>
				  <div className="product__after"></div>
				</div>
			</div>
		)
	}
}

ProductPreview.propTypes = {
  frameWidth: React.PropTypes.number.isRequired,
  frameHeight: React.PropTypes.number.isRequired,
  edgeType: React.PropTypes.string,
  frameType: React.PropTypes.string,
  productType: React.PropTypes.string.isRequired,
  picture: React.PropTypes.string.isRequired,
  pictureName: React.PropTypes.string
};

export default ProductPreview