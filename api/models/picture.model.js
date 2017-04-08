'use strict';

const _ = require('lodash');

// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

const associations = {
  preview: 'image',
  full: 'image',
  user: 'user',
};

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');

  const Image = sequelizeClient.define('image', {
    file: Sequelize.STRING,
    width: Sequelize.INTEGER,
    height: Sequelize.INTEGER,
  });

  const Picture = sequelizeClient.define('picture', {
    name: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING(300),
      unique: true,
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
        associate(models) { // eslint-disable-line no-unused-vars
          // Define associations here
          // See http://docs.sequelizejs.com/en/latest/docs/associations/

          _.forEach(associations, (modelName, fieldName) => {
            this.belongsTo(models[modelName], { as: fieldName })
          });
        }
      },
    }
  );

  return Picture;
};

module.exports.hooks = {
  addRelations(hook) {
    const include = [];

    _.forEach(associations, function (modelName, fieldName) {
      let isInclude = false;
      let attributes = null; // all attributes

      if (hook.data) {
        // its create hook
        if (hook.data[fieldName]) {
          isInclude = true;
        }
      } else {
        const select = hook.params.query.$select;

        if (!select) {
          isInclude = true;
        } else {
          attributes = _.remove(select, function (column) {
            return column === fieldName || String(column).indexOf(fieldName + '.') === 0;
          });

          if (attributes.length) {
            isInclude = true;

            if (attributes.indexOf(fieldName) > -1) {
              attributes = null;
            } else {
              // remove fieldName.attributeName from atribute
              attributes = attributes.map(a => String(a).slice(fieldName.length + 1))
            }
          }
        }
      }

      if (isInclude) {
        include.push({
          model: hook.app.get('sequelizeClient').models[modelName],
          as: fieldName,
          attributes
        });
      }
    })

    hook.params.sequelize = {
      include
    };
  }
};
