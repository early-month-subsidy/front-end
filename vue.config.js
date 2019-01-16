module.exports = {
    baseUrl: '/',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://172.18.215.188:5000',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            },
            '/ms': {
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            }
        },
        disableHostCheck: true
    }
};
