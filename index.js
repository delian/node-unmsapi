let debug = require('debug')('UnmsAPI');
let merge = require('merge');
let UnmsRequest = require('./lib/unms-request');

let defaultOptions = {
    'username': 'ubnt',
    'password': 'ubnt',
    'baseUrl': 'https://127.0.0.1:443',
    'debug': false,
    'debugNet': false,
    'gzip': true,
    'site': 'default'
};

/**
 * The main class and the initialization of the UNMS Access
 * @param {object} options the options during initialization
 * @param {string} options.baseUrl the URL where the Unifi controller is. Default https://127.0.0.1:443
 * @param {string} options.username default username
 * @param {string} options.password default password
 * @param {string} options.site default site. Default is "default"
 * @param {boolean} options.debug if the debug log is enabled
 * @param {boolean} options.debugNet if the debug of the request module is enabled
 * @returns this
 * @example let UnmsAPI = require('node-unmsapi');
 * let unifi = UnmsAPI({
 *    baseUrl: 'https://127.0.0.1:443', // The URL of the Unifi Controller
 *    username: 'ubnt',
 *    password: 'ubnt',
 *    // debug: true, // More debug of the API (uses the debug module)
 *    // debugNet: true // Debug of the network requests (uses request module)
 * });
 */
function UnmsAPI(options) {
    if (!(this instanceof UnifiAPI)) return new UnifiAPI(options);
    merge(this, defaultOptions, options);
    this.debugging(this.debug);
    if (typeof this.net === 'undefined') {
        this.net = new UnifiRequest(merge(true, defaultOptions, options));
    }
    debug('UnmsAPI Initialized with options %o', options);
}



module.exports = UnmsAPI;
