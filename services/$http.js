require('es6-promise').polyfill();
require('isomorphic-fetch');

const apiHost = process.env.API_HOST || ''; // by default host from request

export default {
  host: '',

  post: function (url, data, sid) {
    const host = apiHost || this.host;

    return fetch(host + url, {
      method: 'POST',
      body: typeof data === 'number' ? String(data) : data,
      credentials: 'include',
      headers: {
        "Cookie": 'PHPSESSID=' + sid
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
  }
};