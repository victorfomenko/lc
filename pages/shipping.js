import React from 'react';

// services
import appService from '../services/appService';

// components
import Layout from '../components/layout';

export default class GalleryPage extends Layout {
  static async getInitialProps(obj) {
    return super.getInitialProps(obj)
  }

  content() {
    return (
      <section className="container m-padding-main">
        <div className="container">
          SHIPPING, Data for Send: {JSON.stringify(appService.dataForSent)}
        </div>
      </section>
    )
  }

}