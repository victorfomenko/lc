// original: https://github.com/zeit/next.js/blob/2.0.0-beta.20/examples/custom-server-express/server.js

const express = require('express');
const next = require('next');
const httpProxy = require('http-proxy');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();
    
    const proxy = httpProxy.createProxyServer({
      secure: false,
      xfwd: false,
      changeOrigin: true,
      hostRewrite: true,
      autoRewrite: true,
      protocolRewrite: true,
      cookieDomainRewrite: '*'
    });
    
    // custom routing
    server.get('/gallery/:pictureUrl', (req, res) => {
      return app.render(req, res, '/product', Object.assign({}, req.params, req.query));
    });

    server.get('/user', (req, res) => {
      res.redirect('/');
    });

    server.get('/user/:userUrl', (req, res) => {
      return app.render(req, res, '/user', Object.assign({}, req.params, req.query));
    });

    server.get('/canvas', (req, res) => {
      res.redirect('/');
    });

    if (!dev) {
      const apiHost = process.env.API_HOST || 'http://127.0.0.1:3001';
      server.use('/ajax/', (req, res)=> {
        proxy.web(req, res, {target: apiHost + '/ajax/'});
      });
    }
    else {
      const devApiHost = process.env.DEV_API_HOST || 'https://lovecanvas.ru';
      server.use('/ajax/', (req, res)=> {
        proxy.web(req, res, {target: devApiHost + '/ajax/'});
      });
      server.use('/static/data/', (req, res)=> {
        proxy.web(req, res, {target: devApiHost + '/data/'});
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