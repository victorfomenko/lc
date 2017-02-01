import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import ParamLink from '../../components/paramLink';

// Here we apply the actual CollagePlus plugin
function collage() {
  $('.gallery').collagePlus({
    'fadeSpeed': 1000,
    'targetHeight': 250,
    'allowPartialLastRow': true
  });
}

function caption() {
  $('.gallery').collageCaption();
}

export default class User extends Layout {
  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);

    const {query} = obj;
    const {userUrl} = query || {};
    const user = await this.getUser(userUrl);

    if (user) {
      props.head.title = user.name;
    }

    return {...props, user, userUrl};
  }

  static async getUser(userUrl) {
    return $http.post('/ajax/getArtistInfo.php', userUrl)
      .then(data => {
        if (!data.about) {
          data.about = 'Автор ничего не написал о себе ;('
        }
        if (!data.avatar) {
          data.avatar = 'noavatar.jpg';
        }

        return data;
      });
  }

  componentDidMount() {
    this.gallery();
  }

  gallery() {
    // This is just for the case that the browser window is resized
    var resizeTimer = null;
    $(window).bind('resize', function () {
      // hide all the images until we resize them
      $('.gallery .Image_Wrapper').css("opacity", 0);
      // set a timer to re-apply the plugin
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(collage, 200);
    });

    collage();
    caption();

    // todo destroy plugins
  }

  content() {
    const {user, session, userUrl} = this.props;
    const artist = user || {};
    const {pictures} = artist;
    const isOwner = artist.id === (session.user && session.user.id);

    return (
      <div>
        <section className="container m-padding-default artist">
          <div className="row">
            <div className="col-xs-6 col-sm-2 col-md-3 col-lg-2 m-text_center">
              <img className="artist__avatar user-avatar" src={"/static/data/avatars/" + artist.avatar}
                   alt={artist.name}
                   title={artist.name}/>
              {
                (isOwner || (session.user && session.user.role === 'admin')) && (
                  <ParamLink url='/user/:userUrl/profile/edit' params={{userUrl}}>
                    <a className="btn btn-info btn-sm">Редактировать</a>
                  </ParamLink>
                )
              }
            </div>
            <div className="col-xs-6 col-sm-10 col-md-9 col-lg-10">
              <h1 className="artist__header">{artist.name}</h1>
              <span className="artist__about">{artist.about}</span>
              {
                artist.website && (
                  <div className="artist__link">
                    <a target="_blank" href={artist.website}>{artist.website}</a>
                  </div>
                )
              }
            </div>
          </div>
        </section>

        <section className="container m-padding-main">
          <div className="container">
            <div className="gallery-section">
              <div className="gallery">
                {
                  (pictures || []).map(pic => (
                    <ParamLink key={pic.seourl} url='/gallery/:pictureId' params={{pictureId: pic.seourl}}>
                      <a className="gallery__wrapper"
                         data-caption={`<strong className='caption__content__name'>${pic.name}</strong><span className='caption__content__author'>${pic.author}</span>`}>
                        <img src={'/static' + pic.preview} width={pic.width} height={pic.height} alt={pic.name}/>
                      </a>
                    </ParamLink>
                  ))
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}