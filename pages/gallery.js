import React from 'react';

import Layout from '../components/layout';
import Gallery from '../components/gallery';

export default class GalleryPage extends Layout {

  content(){
    return(
      <section className="container m-padding-main">
        <div className="container">
          <div className="gallery-section">
            <Gallery size={40}/>
          </div>
        </div>
      </section>
    )
  }

}