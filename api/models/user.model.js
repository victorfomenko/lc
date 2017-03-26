'use strict';

const _ = require('lodash');

// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const userScheme = {
    name: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    role: {
      type: Sequelize.ENUM,
      values: ['admin']
    },
    avatar: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING(300),
    },
    about: {
      type: Sequelize.TEXT,
    },
  }

  const auth = app.get('authentication');
  const oauthProviders = auth.oauth.providers;

  // define providers links in db
  _.forEach(oauthProviders, function (config, providerName) {
    userScheme[providerName + 'Id'] = {
      type: config.dbType === 'int' ? Sequelize.INTEGER : Sequelize.STRING
    }

    // type TEXT because in mysql no JSON format
    userScheme[providerName] = {
      type: Sequelize.TEXT,
      set(value) {
        if (_.isObject(value)) {
          this.setDataValue(key, JSON.stringify(value));
        }
      }
    };
  });

  Object.keys(oauthProviders).forEach(function (key) {
    // type TEXT because in mysql no JSON format
    userScheme[key] = {
      type: Sequelize.TEXT,
      set(value) {
        if (_.isObject(value)) {
          this.setDataValue(key, JSON.stringify(value));
        }
      }
    };
  });

  return sequelizeClient.define('user', userScheme, {
    paranoid: true,
    classMethods: {
      associate(models) { // eslint-disable-line no-unused-vars
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
        this.hasMany(models.picture);
        this.hasMany(models.order);
      }
    }
  });
};
