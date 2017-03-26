'use strict';

// Initializes the `orders` service on path `/orders`
const createService = require('feathers-sequelize');
const createModel = require('../../models/order.model');
const hooks = require('./orders.hooks');
const filters = require('./orders.filters');

module.exports = function() {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'orders',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/orders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('orders');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
