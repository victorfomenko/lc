const port = process.env.PORT || 3000;
const serverPort = process.env.SERVER_PORT || port;

module.exports = {
  host: 'localhost',
  port: port,
  serverPort: serverPort,
  mysql: process.env.DB_CONNECTION_STRING,
  paginate: {
    default: 50,
    max: 100
  },
  authentication: {
    secret: 'my secret :)',
    strategies: [
      'jwt'
    ],
    service: 'users',
    cookie: {
      enabled: true,
      maxAge: 604800000,
      httpOnly: true,
      name: 'sid'
    },
    oauth: {
      providers: {
        instagram: {
          clientID: 'd1a0134821e24b61b9166c58adcc9102',
          clientSecret: '5591b6bdf37b415f80cfc88956424934',
          scope: [
            'basic'
          ],
          successRedirect: '/',
          user: {
            url: 'username',
            name: 'displayName',
            avatar: '_json.data.profile_picture'
          }
        },
        vkontakte: {
          clientID: '5934858',
          clientSecret: 'YfooAMkttuwrw1oi56hr',
          scope: [
            'email'
          ],
          successRedirect: '/',
          user: {
            url: 'username',
            name: 'displayName',
            avatar: 'photos[0].value'
          },
          dbType: 'int'
        }
      }
    }
  }
}
