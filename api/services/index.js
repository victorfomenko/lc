'use strict';

const users = require('./users/users.service.js');

const pictures = require('./pictures/pictures.service.js');

const orders = require('./orders/orders.service.js');

const user = require('./user/user.service.js');

module.exports = function() {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(pictures);
  app.configure(orders);
  app.configure(user);
};
