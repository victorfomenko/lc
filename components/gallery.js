import React, {Component} from 'react';

import api from '../services/appService';
import app from '../services/app';

import ParamLink from './paramLink';

export default class Gallery extends Component {
  static async getPictures(limit){
    return await app.service('pictures').find({query: {
      $limit: limit, 
      $sort: {rate: -1},
      $select: ['url', 'name', 'preview.file', 'preview.width', 'preview.height', 'user.name'],
    }}).then(r=> r.data);
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

  onResize = ()=> {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(this.collage, 200);
  };

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
        <ParamLink key={pic.url} url='/product as gallery/:pictureUrl' params={{pictureUrl: pic.url}}>
          <a className="gallery__wrapper"
             data-caption={`<strong class='caption__content__name'>${pic.name}</strong><span class='caption__content__author'>${pic.user && pic.user.name || ''}</span><span class='caption__content__price'>От 220 <span class='form__price__rouble m-rubble'>i</span></span>`}>
            <i className='heart'/>
            <img src={`/static/uploads/${pic.preview.file}`} width={pic.preview.width} height={pic.preview.height} alt={pic.name}/>
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