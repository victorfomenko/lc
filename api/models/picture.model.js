'use strict';

// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');

  return sequelizeClient.define('picture', {
    name: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING(300),
    },
    file: {
      type: Sequelize.STRING,
    },
    width: {
      type: Sequelize.INTEGER,
    },
    height: {
      type: Sequelize.INTEGER,
    },
    rate: {
      type: Sequelize.FLOAT,
    },
    fee: {
      type: Sequelize.INTEGER,
    },
  }, {
    paranoid: true,
    classMethods: {
      associate (models) { // eslint-disable-line no-unused-vars
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
        this.belongsTo(models.user);
      }
    }
  });
};
