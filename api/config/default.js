module.exports = {
    dbConfig: {
        port: 4000,
        name: 'uber-app-db',
        protokol: 'mongodb',
        host: '127.0.0.1',
    },
    serverConfig: {
        port: 5000,
        protokol: 'http',
        host: '127.0.0.1',
    },
    secret: 'somesecret',
};
