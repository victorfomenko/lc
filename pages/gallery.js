import React from 'react';

import Layout from '../components/layout';
import Gallery from '../components/gallery';

export default class GalleryPage extends Layout {
  static async getInitialProps(obj) {
    return {
      ...await super.getInitialProps(obj),
      pictures: await Gallery.getPictures(40)
    }
  }

  content() {
    const {pictures} = this.props;

    return (
      <section className="container m-padding-main">
        <div className="container">
          <div className="gallery-section">
            <Gallery pictures={pictures}/>
          </div>
        </div>
      </section>
    )
  }

}