import React from 'react';

import Layout from '../components/layout';
import Gallery from '../components/gallery';

export default class GalleryPage extends Layout {
  static async getInitialProps(obj) {
    const {pictureUrl} = obj.query || {};

    return {
      ...await super.getInitialProps(obj),
      pictureUrl
      // picture: await getPicture
    }
  }

  content() {
    const {pictureUrl} = this.props;

    return (
      <section className="container m-padding-main">
        <div className="container">
          {pictureUrl}
        </div>
      </section>
    )
  }

}