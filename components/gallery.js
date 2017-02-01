import React, {Component} from 'react';
import Link from 'next/link';

import api from '../services/appService';

export default class Gallery extends Component {

  constructor() {
    super();
    this.state = {
      pictures: []
    }
  }

  async getInitialProps(){
    const pictures = await api.getImageList(this.props.size);
    this.setState( ()=>{
      return { pictures }
    });
  }

  componentDidMount(){
    this.getInitialProps();
  }

  componentDidUpdate(){
    this.drawGallery();
  }

  drawGallery(){
    let collage = () => {
      $('.gallery').collagePlus({
        'fadeSpeed'     : 500,
        'targetHeight'  : 200,
      });
    };

    let caption = () => {
      $('.gallery').collageCaption({
        'background'      : ""
      });
    };


    collage();
    caption();


    let resizeTimer = null;
    $(window).bind('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(collage, 200);
    });
  }

  componentWillUnmount(){
    $(window).unbind('resize')
  }

  render(){
    const gallery = (this.state.pictures || []).map( (pic, index) => {
      return (
        <Link key={index} href='/gallery' as={`/gallery/${pic.seourl}`}>
          <a className="gallery__wrapper"
             data-caption={`<strong class='caption__content__name'>${pic.name}</strong><span class='caption__content__author'>${pic.author}</span><span class='caption__content__price'>От 220 <span class='form__price__rouble m-rubble'>i</span></span>`}>
            <i className='heart'/>
            <img src={`/static${pic.preview}`} width={pic.width} height={pic.height} alt={pic.name}/>
          </a>
        </Link>
      )
    });
    return (
      <div className="gallery">
        {gallery}
      </div>
    );
  }
}