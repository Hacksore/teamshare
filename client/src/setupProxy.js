const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  const socketProxy = createProxyMiddleware('/ws', {
    target: 'http://localhost:8000',
    changeOrigin: true,
    ws: true, 
    logLevel: 'debug',
  });

  app.use(socketProxy);
};