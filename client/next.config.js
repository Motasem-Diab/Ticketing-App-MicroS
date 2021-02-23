module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300;     // 300 milli second
        return config;
    }
};