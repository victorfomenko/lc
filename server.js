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
    let apiHost = process.env.API_HOST || 'https://lovecanvas.ru';

    const proxy = httpProxy.createProxyServer({
      secure: false,
      xfwd: false,
      changeOrigin: true,
      hostRewrite: true,
      autoRewrite: true,
      protocolRewrite: true,
      cookieDomainRewrite: '*'
    });
    proxy.on('proxyReq', function(proxyReq, req, res, options) {
      if(req.method=="POST"&&req.body){
        proxyReq.write(req.body);
        proxyReq.end();
      }
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

    if(dev) {
      apiHost = process.env.DEV_API_HOST || 'https://lovecanvas.ru';
      server.use('/static/data/', (req, res)=> {
        proxy.web(req, res, {target: apiHost + '/data/'});
      });
    }

    server.use('/ajax/', (req, res)=> {
      var headers = {};
      if(req.method=="POST"&&req.body){
        var data = JSON.stringify(req.body);
        req.body = data;
        headers = { 
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      }
      proxy.web(req, res, {target: apiHost + '/ajax/'});
    });

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