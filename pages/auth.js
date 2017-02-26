import React from 'react';

import Layout from '../components/layout';
import Gallery from '../components/gallery';

export default class GalleryPage extends Layout {
  static async getInitialProps(obj) {
    return super.getInitialProps(obj)
  }

  content() {
    return (
      <center>
        <span className="header__flex__item__email"><a href="javascript:void(0)" data-toggle="modal" data-target="#modal-login">вход в личный кабинет</a></span>
      </center>
    );   
  }

}