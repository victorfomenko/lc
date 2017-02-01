import React, {Component} from 'react';

import api from '../services/appService';

import ParamLink from './paramLink';

export default class Gallery extends Component {
  static async getPictures(size){
    return await api.getImageList(size);
  }

  componentDidMount(){
    this.drawGallery();
  }

  collage() {
    $('.gallery').collagePlus({
      'fadeSpeed'     : 500,
      'targetHeight'  : 200,
    });
  }

  onResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(this.collage, 200);
  }

  drawGallery(){
    this.collage();

    $('.gallery').collageCaption({
      'background'      : ""
    });

    $(window).bind('resize', this.onResize);
  }

  componentWillUnmount(){
    $(window).unbind('resize', this.onResize);
    // todo destroy plugins
  }

  render(){
    const gallery = (this.props.pictures || []).map( (pic, index) => {
      return (
        <ParamLink key={pic.seourl} url='/gallery/:pictureUrl' params={{pictureUrl: pic.seourl}}>
          <a className="gallery__wrapper"
             data-caption={`<strong class='caption__content__name'>${pic.name}</strong><span class='caption__content__author'>${pic.author}</span><span class='caption__content__price'>От 220 <span class='form__price__rouble m-rubble'>i</span></span>`}>
            <i className='heart'/>
            <img src={`/static${pic.preview}`} width={pic.width} height={pic.height} alt={pic.name}/>
          </a>
        </ParamLink>
      )
    });
    return (
      <div className="gallery">
        {gallery}
      </div>
    );
  }
}