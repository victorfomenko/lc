import React from 'react';

import Layout from '../components/layout';
import Gallery from '../components/gallery';

export default class GalleryPage extends Layout {
  static async getInitialProps(obj) {
    const [
      baseProps,
      pictures
    ] = await Promise.all([
      super.getInitialProps(obj),
      Gallery.getPictures(40)
    ]);

    return {
      ...baseProps,
      pictures
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