let request = require('request');
//require('request-debug')(request);
let merge = require('merge');
let debug = require('debug')('UnmsRequest');

let defaultOptions = {
    'username': 'ubnt',
    'password': 'ubnt',
    'loggedIn': false,
    'baseUrl': 'https://127.0.0.1:443',
    'debug': false,
    'debugNet': false,
    'sessionTimeout': 1800000,
    'headers': {
        'Content-type': 'application/json',
        'Referer': '/login'
    },
    'gzip': true
};

function UnmsRequest(options) {
    if (!(this instanceof UnmsRequest)) return new UnmsRequest(options);
    merge(this, defaultOptions, options);
    if (this.debug) debug.enabled = true;
    if (typeof this.request === 'undefined') {
        this.request = request.defaults({ jar: true });
        if (this.debugNet) {
            this.request.debug = true;
            require('request-debug')(this.request);
        }
    }
    this.__q = {
        login: []
    };
    debug('UnmsAPI-request Initialized with options %o', options);
}

/**
 * Enable or disable debugging
 * @param {boolean} enabled Enable or Disable debugging
 * @return {undefined}
 */
UnmsRequest.prototype.debugging = function(enabled) {
    this.debug = enabled;
    debug.enabled = this.debug ? true : false;
    debug('Debug is', this.debug ? 'enabled' : 'disabled');
};

UnmsRequest.prototype._request = function(url = '', jsonParams = undefined, headers = {}, method = undefined, baseUrl = undefined) {
    if (typeof method === 'undefined') {
        if (typeof jsonParams === 'undefined') method = 'GET';
        else method = 'POST';
    }
    let localHeaders = merge(true, {
        'x-auth-token': this.xAuth || undefined
    }, this.headers, headers);

    return new Promise((resolve, reject) => {
        this.request({
                url: (baseUrl || this.baseUrl) + url,
                method: method,
                headers: localHeaders,
                rejectUnauthorized: false,
                json: jsonParams
            },
            (err, resp, body) => {
                if (err) return reject(err, resp);
                if (resp.statusCode < 200 || resp.statusCode > 299) return reject(body, resp);
                return resolve(resp);
            });
    });
};

UnmsRequest.prototype.login = function(username, password, sessionTimeout) {
    return new Promise((resolve, reject) => {
        if (this.loggedIn) { // Silent ignore if we are already in
            return resolve({
                meta: { rc: 'ok' }
            });
        }
        this.__q.login.push({ resolve: resolve, reject: reject });
        debug('Trying to log in with username: %s and password: %s', username || this.username, password || this.password);
        if (this.__q.login.length > 1) {
            debug('Waiting login to be completed...');
            return;
        }
        this._request('/v2.1/user/login', {
            username: username || this.username,
            password: password || this.password,
            sessionTimeout: sessionTimeout || this.sessionTimeout
        }).then((resp) => {
            let data = resp.body;
            if (typeof data === 'object' && data.id) {
                debug('Successfuly logged in', data);
                this.loggedIn = true;
                this.xAuth = resp.headers['x-auth-token'];
                this.__q.login.forEach(n => n.resolve(data));
                this.__q.login = [];
            } else {
                debug('Error with the authentication', data);
                this.__q.login.forEach(n => n.reject(data || 'Authentication error'));
                this.__q.login = [];
                this.loggedIn = false;
            }
        }).catch(e => {
            this.__q.login.forEach(n => n.reject('Authentication error ' + e));
            this.__q.login = [];
            this.loggedIn = false;
        });
    });
};

UnmsRequest.prototype.logout = function() {
    return new Promise((resolve, reject) => {
        this._request('/v2.1/user/logout')
            .then((data) => {
                this.loggedIn = false;
                resolve(data);
            })
            .catch(reject);
    });
};

UnmsRequest.prototype.req = function(url = '/', jsonParams = undefined, headers = {}, method = undefined, baseUrl = undefined) {
    if (typeof method === 'undefined') {
        if (typeof jsonParams === 'undefined') method = 'GET';
        else method = 'POST';
    }
    return new Promise((resolve, reject) => {
        let procFunc = (resp) => {
            let data = resp.body;
            if (typeof data === 'string' && ( data.charAt(0) === '{' || data.charAt(0) === '[')) data = JSON.parse(data);
            if (typeof data === 'object'
                //&& typeof data.meta === 'object'
                //&& data.meta.rc === 'ok'
                ) return resolve(data, resp);
            reject(data, resp);
        };
        this.login()
            .then(() => {
                this._request(url, jsonParams, headers, method, baseUrl)
                    .then(procFunc)
                    .catch((error, resp) => {
                        if ((resp && resp.statusCode == 401) || (typeof error == 'string' && error.match('api.err.LoginRequired'))) { // TODO: to be checked
                            // We have problem with the Login for some reason
                            debug('We have to reauthenticate again', error, resp);
                            this.loggedIn = false; // Reset the login and repeat once more
                            this.login()
                                .then(() => this._request(url, jsonParams, headers, method, baseUrl))
                                .then(procFunc)
                                .catch(reject);
                        } else reject(error, resp);
                    });
            })
            .catch(reject);
    });
};

module.exports = UnmsRequest;
