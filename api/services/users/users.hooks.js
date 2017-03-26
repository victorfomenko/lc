'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const oauthHooks = require('./oauth');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [].concat(oauthHooks),
    update: [authenticate('jwt')].concat(oauthHooks),
    patch: [authenticate('jwt')].concat(oauthHooks),
    remove: [authenticate('jwt')]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
