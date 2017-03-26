const _ = require('lodash');

// example https://github.com/feathersjs/feathers-authentication-oauth2/blob/master/example/app.js

module.exports = [
  function (hook) {
    const oauthProviders = hook.app.get('authentication').oauth.providers;
    _.forEach(oauthProviders, function ({ user }, providerName) {
      if (!user) {
        return;
      }

      const profile = _.get(hook, ['data', providerName, 'profile']);

      if (!profile) {
        return;
      }

      _.forEach(user, function (profileField, userField) {
        const profileValue = _.get(profile, profileField);
        // todo don't rewrite user data if exist
        if (profileValue) {
          hook.data[userField] = profileValue;
        }
      })
    });

    return Promise.resolve(hook);
  }
]
