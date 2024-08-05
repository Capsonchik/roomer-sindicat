// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Прокси для домена 1
  app.use(
    '/proxy_cors_login',
    createProxyMiddleware({
      target: 'https://192.168.9.239/',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy_cors_login': '', // Убираем /proxy_cors из пути
      },
    })
  );

  // Прокси для домена 2
  app.use(
    '/proxy_cors_main',
    createProxyMiddleware({
      target: 'https://21ce-212-45-6-6.ngrok-free.app',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy_cors_main': '', // Убираем /proxy_example из пути
      },
    })
  );
};