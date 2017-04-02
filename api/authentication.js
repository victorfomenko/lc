'use strict';

const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const feathersErrors = require('feathers-errors');

const oauth2 = require('feathers-authentication-oauth2');

const providerStrategies = {
  google: require('passport-google-oauth20'),
  facebook: require('passport-facebook'),
  instagram: require('passport-instagram'),
  vkontakte: require('passport-vkontakte').Strategy,
};

module.exports = function () {
  const app = this;
  const config = app.get('authentication');
  const providers = config.oauth.providers;

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt({
    jwtFromRequest: req => {
      return req.cookies[config.cookie.name]
    },
    Verifier: class CustomVerifier extends jwt.Verifier {
      verify(req, payload, done) {
        super.verify(req, payload, function (err, user) {
          if (!err && (!user || !user.id)) {
            return done(new feathersErrors.NotAuthenticated(`user "${payload.userId}" not found`));
          }

          done(err, user);
        })
      }
    }
  }));

  // optionally authenticate before use oauth strategies, but it not correct work
  // app.use('/auth', function (req, res, next) {
  //   app.authenticate('jwt')(req)
  //     .then(result => {
  //       if (result.success) {
  //         // from original code: https://github.com/feathersjs/feathers-authentication/blob/v1.1.1/src/express/authenticate.js#L28
  //         Object.assign(req, result.data);
  //         Object.assign(req.feathers, result.data);
  //       }
  //       next();
  //     })
  //     .catch(next);
  // });

  Object.keys(providers).forEach(providerName => {
    if (providerStrategies[providerName]) {
      app.configure(oauth2(Object.assign({
        name: providerName,
        Strategy: providerStrategies[providerName]
      }, providers[providerName])));
    }
  });

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
