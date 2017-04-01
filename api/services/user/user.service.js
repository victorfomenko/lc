'use strict';

// Initializes the `user` service on path `/user`
const createService = require('./user.class.js');
const hooks = require('./user.hooks');
const filters = require('./user.filters');

module.exports = function() {
  const app = this;

  const options = {
    name: 'user',
    paginate: false,
  };

  // Initialize our service with any options it requires
  app.use('/user', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('user');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
