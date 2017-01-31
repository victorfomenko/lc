// original: https://github.com/zeit/next.js/blob/2.0.0-beta.20/examples/custom-server-express/server.js

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    // custom routing
    server.get('/gallery/:picture', (req, res) => {
      return app.render(req, res, '/gallery', Object.assign({}, req.params, req.query));
    });

    if (dev) {
      const httpProxy = require('http-proxy');
      const proxy = httpProxy.createProxyServer({
        secure: false,
        xfwd: false,
        changeOrigin: true,
        hostRewrite: true,
        autoRewrite: true,
        protocolRewrite: true,
        cookieDomainRewrite: '*'
      });
      const apiHost = process.env.DEV_API_HOST || 'https://lovecanvas.ru';
      server.use('/ajax/', (req, res)=> {
        proxy.web(req, res, {target: apiHost + '/ajax/'});
      });
      server.use('/static/data/', (req, res)=> {
        proxy.web(req, res, {target: apiHost + '/data/'});
      });
    }

    // default routing
    server.get('*', (req, res) => {
      return handle(req, res)
    });

    // start server
    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log('> Ready on http://localhost:' + port)
    });
  });