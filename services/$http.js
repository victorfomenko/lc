require('es6-promise').polyfill();
require('isomorphic-fetch');

const host = process.env.HOST || 'http://lc.lan' || 'https://lovecanvas.ru';

export default {
  post: function (url, data, sid) {
    return fetch(host + url, {
      method: 'POST',
      body: data,
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