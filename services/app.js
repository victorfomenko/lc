import _ from 'lodash';
import feathers from 'feathers/client';
import rest from 'feathers-rest/client';

require('es6-promise').polyfill();
require('isomorphic-fetch');

const apiHost = process.env.API_HOST || ''; // by default host from request

const app = feathers()
  .configure(rest(apiHost + '/api').fetch(function fetchWC(url, params, ...args) {
    return fetch(url, {
      ...params,
      credentials: 'include',
    }, ...args);
  }));

const serviceFn = app.service;
app.service = function (name, ...args) {
  const service = serviceFn.call(this, name, ...args);
  const methods = 'find,get,create,update,patch,remove'.split(',');

  methods.forEach(methodName => {
    const method = service[methodName];
    service[methodName] = function (...args) {
      const params = _.last(args);
      const sid = params && params.sid;
      if (sid) {
        _.set(params, 'headers.Cookie', 'sid=' + sid);
      }
      return method.call(service, ...args);
    }
  });

  return service;
}

// how use services you can read here https://docs.feathersjs.com/rest/readme.html#query-route-and-middleware-parameters
// and here https://docs.feathersjs.com/services/readme.html#service-methods
// and here https://docs.feathersjs.com/clients/rest.html

export default app;