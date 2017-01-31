import React, {Component} from 'react';
import Link from 'next/link';

export default class Gallery extends Component {

  render(){
    const gallery = (this.props.pictures || []).map( (pic, index) => {
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