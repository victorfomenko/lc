import React from 'react';

// services
import $http from '../../services/$http'

// components
import Layout from '../../components/layout';
import UserAbout from '../../components/user/UserAbout';
import UserAccountLayout from '../../components/user/UserAccountLayout';
import Gallery from '../../components/gallery';

export default class Account extends Layout {
  static async getInitialProps(obj) {
    const props = await super.getInitialProps(obj);

    if(obj.req && !props.session.user) {
      obj.res.writeHead(302, { Location: '/' })
      return 
    }
    else if(!props.session.user) {
      document.location.pathname = '/'
      return
    }

    const user = await $http.post('/ajax/getArtistInfo.php', props.session.user.url);

    return {...props, user};    
  }

  constructor(props) {
    super(props);
  }

  content() {
    const { about, avatar, name, website, pictures } = this.props.user

    return (
      <UserAccountLayout path={this.props.path}>
        <UserAbout
          about={about}
          avatar={avatar}
          name={name}
          website={website}
          url={this.props.session.user.url}
        />
        <section className="m-padding-main">
          <div className="gallery-section">
            <Gallery pictures={pictures}/>        
          </div>
        </section>
      </UserAccountLayout>
    )
  }
}

