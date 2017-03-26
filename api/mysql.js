'use strict';

const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;
  const connection = app.get('mysql');
  const sequelize = new Sequelize(connection, {
    dialect: connection.split(':')[0],
    logging: false,
    define: {
      freezeTableName: false
    }
  });
  const oldSetup = app.setup;

  app.set('sequelizeClient', sequelize);

  app.setup = function(...args) {
    const result = oldSetup.apply(this, args);

    // Set up data relationships
    const models = sequelize.models;
    Object.keys(models).forEach(name => {
      if ('associate' in models[name]) {
        models[name].associate(models);
      }
    });

    // Sync to the database
    sequelize.sync({force: true});

    return result;
  };
};
