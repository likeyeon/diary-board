const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    ["/members", "/posts", "/reissue", "/comments", "/hearts"],
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL,
      changeOrigin: true,
    })
  );
};
