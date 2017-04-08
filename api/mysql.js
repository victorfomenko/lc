'use strict';

const Sequelize = require('sequelize');

module.exports = function () {
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

  app.setup = function (...args) {
    return Promise.resolve(oldSetup.apply(this, args))
      .then(result => {

        // Set up data relationships
        const models = sequelize.models;
        Object.keys(models).forEach(name => {
          if ('associate' in models[name]) {
            models[name].associate(models);
          }
        });

        // Sync to the database
        const force = process.env.DROP_DB === 'true' && process.env.NODE_ENV === 'development';
        force && console.log('DROP DB! env: DROP_DB = "%s", NODE_ENV="%s"', process.env.DROP_DB, process.env.NODE_ENV);
        return sequelize.sync({ force })
          .then(() => result)
      });
  };
};
