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
    if (!(this instanceof UnmsAPI)) return new UnmsAPI(options);
    merge(this, defaultOptions, options);
    this.debugging(this.debug);
    if (typeof this.net === 'undefined') {
        this.net = new UnmsRequest(merge(true, defaultOptions, options));
    }
    debug('UnmsAPI Initialized with options %o', options);
}

/**
 * Enable or disable the debug of the module
 * @param {boolean} enable Enable or disable the debugging
 * @returns {undefined}
 */
UnmsAPI.prototype.debugging = function(enabled) {
    this.debug = enabled;
    debug.enabled = this.debug ? true : false;
    debug('Debug is', this.debug ? 'enabled' : 'disabled');
};

/**
 * Generic network operation, executing UNMS command under /v2.1/<command>/sites/... rest api
 * @param {string} url The right part of the URL (/api/s/{site}/ is automatically added)
 * @param {object} jsonParams optional. Default undefined. If it is defined and it is object, those will be the JSON POST attributes sent to the URL and the the default method is changed from GET to POST
 * @param {object} headers optional. Default {}. HTTP headers that we require to be sent in the request
 * @param {object} method optional. Default undefined. The HTTP request method. If undefined, then it is automatic. If no jsonParams specified, it will be GET. If jsonParams are specified it will be POST
 * @param {string} site optional. The {site} atribute of the request. If not specified, it is taken from the UnifiAPI init options, where if it is not specified, it is "default"
 * @return {Promise}
 * @example unifi.netsite('/cmd/stamgr', { cmd: 'authorize-guest', mac: '00:01:02:03:04:05', minutes: 60 }, {}, 'POST', 'default')
 *     .then(data => console.log('Success', data))
 *     .catch(error => console.log('Error', error));
 */
UnmsAPI.prototype.netsite = function(url = '', jsonParams = undefined, headers = {}, method = undefined, site = undefined) {
    //site = site || this.site;
    if (typeof method === 'undefined') {
        if (typeof jsonParams === 'undefined') method = 'GET';
        else method = 'POST';
    }
    let myurl = url;
    if (typeof site !== 'undefined') {
        myurl += '/sites/' + site || this.site;
    }
    return this.net.req('/v2.1/' + url + site, jsonParams, headers, method)
};

/**
 * @description Explicit login to the controller. It is not necessary, as every other method calls implicid login (with the default username and password) before execution
 * @param {string} username The username
 * @param {string} password The password
 * @return {Promise} success or failure
 * @example unifi.login(username, password)
 *     .then(data => console.log('success', data))
 *     .catch(err => console.log('Error', err))
 */
UnmsAPI.prototype.login = function(username, password) {
    return this.net.login(username, password);
};

/**
 * Logout of the controller
 * @example unms.logout()
 *     .then(() => console.log('Success'))
 *     .catch(err => console.log('Error', err))
 */
UnmsAPI.prototype.logout = function() {
    return this.net.logout();
};

/**
 * List sites
 * @return {Promise} Promise
 * @example unifi.list_sites()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.list_sites = function() {
    return this.net.req('/v2.1/sites');
};

/**
 * List devices
 * @return {Promise} Promise
 * @example unifi.list_devices()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.list_devices = function() {
    return this.net.req('/v2.1/devices');
};

/**
 * List logs
 * @param count how many to return per page. default is 100000
 * @param which page to return (default 1)
 * @return {Promise} Promise
 * @example unifi.list_logs()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.list_logs = function(count = 100000, page = 1) {
    return this.net.req('/v2.1/logs?count='+count+'&page='+page);
};

/**
 * List outages
 * @param count how many to return per page. default is 100000
 * @param which page to return (default 1)
 * @return {Promise} Promise
 * @example unifi.list_outages()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.list_outages = function(count = 100000, page = 1) {
    return this.net.req('/v2.1/outages?count='+count+'&page='+page);
};

/**
 * List settings
 * @return {Promise} Promise
 * @example unifi.list_outages()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.list_settings = function() {
    return this.net.req('/v2.1/nms/settings');
};

/**
 * Do keepalive
 * @return {Promise} Promise
 * @example unifi.list_outages()
 *     .then(done => console.log('Success',done))
 *     .catch(err => console.log('Error',err))
 */
UnmsAPI.prototype.keepalive = function() {
    return this.net.req('/v2.1/nms/keep-alive');
};


module.exports = UnmsAPI;
