const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
  const socketProxy = createProxyMiddleware('/peerjs', {
    target: 'http://localhost:8000',
    changeOrigin: true,
    ws: true, 
    logLevel: "info"
  });

  app.use(socketProxy);
};