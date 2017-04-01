import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import ParamLink from '../../components/paramLink';
import Gallery from '../../components/gallery';
import UserAbout from '../../components/user/UserAbout';

export default class User extends Layout {

  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);

    const {query} = obj;
    const {userUrl} = query || {};
    const user = await $http.post('/ajax/getArtistInfo.php', userUrl)

    if (user) {
      props.head.title = user.name;
    }

    return {...props, user, userUrl};
  }

  content() {
    const { user, session, userUrl } = this.props;
    const artist = user || {};
    const { pictures } = artist;
    const isOwner = artist.id === (session.user && session.user.id);
    const showEditButton = isOwner || (session.user && session.user.role === 'admin');

    return (
      <div>
        <section className="container m-padding-default artist">
          <UserAbout
            about={artist.about}
            avatar={artist.avatar}
            name={artist.name}
            website={artist.website}
            url={userUrl}
            showEditButton={showEditButton}
          />
        </section>
        <section className="container m-padding-main">
          <div className="container">
            <div className="gallery-section">
              <Gallery pictures={pictures}/>
            </div>
          </div>
        </section>
      </div>
    );
  }
}