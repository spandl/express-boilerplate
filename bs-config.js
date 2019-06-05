
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    ui: {
        port: 3002,
    },
    files: ['views', 'api'],
    watchEvents: [
        'change',
    ],
    watch: true,
    ignore: [],
    open: false,
    single: false,
    watchOptions: {
        ignoreInitial: false,
    },
    server: false,
    proxy: 'localhost:3000',
    port: 3001,
    logLevel: 'info',
    logPrefix: 'Browsersync',
    logConnections: true,
    logFileChanges: true,
    logSnippet: true,
    cors: true,
    xip: false,
    reloadOnRestart: true,
    notify: true,
    reloadDelay: 500,
    reloadDebounce: 500,
    reloadThrottle: 0,
    plugins: [],
    injectChanges: false,
    startPath: null,
    minify: true,
    host: null,
    localOnly: false,
    codeSync: true,
    timestamps: true,
    clientEvents: [
        'scroll',
        'scroll:element',
        'input:text',
        'input:toggles',
        'form:submit',
        'form:reset',
        'click',
    ],
    socket: {
        socketIoOptions: {
            log: false,
        },
        socketIoClientConfig: {
            reconnectionAttempts: 50,
        },
        path: '/browser-sync/socket.io',
        clientPath: '/browser-sync',
        namespace: '/browser-sync',
        clients: {
            heartbeatTimeout: 5000,
        },
    },
};
