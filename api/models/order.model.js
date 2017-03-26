'use strict';

// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function(app) {
  const sequelizeClient = app.get('sequelizeClient');
  
  return sequelizeClient.define('order', {
    // customer
    customerName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    customerEmail: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    customerPhone: {
      type: Sequelize.STRING,
      allowNull: false
    },

    // shipping
    shippingCity: {
      type: Sequelize.STRING,
    },
    shippingAddress: {
      type: Sequelize.STRING,
    },
    shippingPostalCode: {
      type: Sequelize.STRING,
    },

    // product
    productType: {
      type: Sequelize.STRING,
    },
    product: {
      type: Sequelize.TEXT,
      set(value) {
        if (_.isObject(value)) {
          this.setDataValue(key, JSON.stringify(value));
        }
      }
    },
    
    cost: {
      type: Sequelize.INTEGER
    },

    imageFile: {
      type: Sequelize.STRING,
    },

  }, {
    classMethods: {
      associate (models) { // eslint-disable-line no-unused-vars
        // Define associations here
        // See http://docs.sequelizejs.com/en/latest/docs/associations/
        this.belongsTo(models.picture);
        this.belongsTo(models.user);
      }
    }
  });
};
