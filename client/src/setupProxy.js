const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {

  app.use(createProxyMiddleware('/peerjs', {
    target: 'http://localhost:8000',
    changeOrigin: true,
    ws: true, 
    logLevel: "info"
  }));

  app.use(createProxyMiddleware('/ws', {
    target: 'http://localhost:8001',
    changeOrigin: true,
    ws: true, 
    logLevel: "info"
  }));
};