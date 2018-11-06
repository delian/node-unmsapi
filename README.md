# node-unmsapi
Ubiquiti UNMS API ported to Node.JS

## Major features

** Under development

## Installation
To install run:

    npm install node-unmsapi --save

## Usage

All the API are Promises

### Direct access to UNMS Controller
If you have a direct access to Ubiquiti UNMS Controller, you could use the following API:

    let unms = require('node-unmsapi');
    let r = unms({
        baseUrl: 'https://127.0.0.1:443', // The URL of the Unifi Controller
        username: 'ubnt',
        password: 'ubnt',
        // debug: true, // More debug of the API (uses the debug module)
        // debugNet: true // Debug of the network requests (uses request module)
    });
    r.stat_sessions()
        .then((data) => {
            console.log('Stat sessions', data);
            return r.stat_allusers();
        })
        .then((data) => {
            console.log('AP data', data);
        })
        .catch((err) => {
            console.log('Error', err);
        })

# Rebuild Readme.md
If you want to modify the README.md file for any reason (added jsdoc comment somewhere or have done change to README.hbs) please run

    npm run readme

# API

<a name="UnmsAPI"></a>

## UnmsAPI(options) ⇒
The main class and the initialization of the UNMS Access

**Kind**: global function  
**Returns**: this  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | the options during initialization |
| options.baseUrl | <code>string</code> | the URL where the Unifi controller is. Default https://127.0.0.1:443 |
| options.username | <code>string</code> | default username |
| options.password | <code>string</code> | default password |
| options.site | <code>string</code> | default site. Default is "default" |
| options.debug | <code>boolean</code> | if the debug log is enabled |
| options.debugNet | <code>boolean</code> | if the debug of the request module is enabled |

**Example**  
```js
let UnmsAPI = require('node-unmsapi');
let unifi = UnmsAPI({
   baseUrl: 'https://127.0.0.1:443', // The URL of the Unifi Controller
   username: 'ubnt',
   password: 'ubnt',
   // debug: true, // More debug of the API (uses the debug module)
   // debugNet: true // Debug of the network requests (uses request module)
});
```

* [UnmsAPI(options)](#UnmsAPI) ⇒
    * [.debugging(enable)](#UnmsAPI+debugging) ⇒ <code>undefined</code>
    * [.netsite(url, jsonParams, headers, method, site)](#UnmsAPI+netsite) ⇒ <code>Promise</code>
    * [.login(username, password)](#UnmsAPI+login) ⇒ <code>Promise</code>
    * [.logout()](#UnmsAPI+logout)
    * [.list_sites()](#UnmsAPI+list_sites) ⇒ <code>Promise</code>
    * [.list_devices()](#UnmsAPI+list_devices) ⇒ <code>Promise</code>
    * [.list_logs(count, which)](#UnmsAPI+list_logs) ⇒ <code>Promise</code>
    * [.list_outages(count, which)](#UnmsAPI+list_outages) ⇒ <code>Promise</code>
    * [.list_settings()](#UnmsAPI+list_settings) ⇒ <code>Promise</code>
    * [.keepalive()](#UnmsAPI+keepalive) ⇒ <code>Promise</code>

<a name="UnmsAPI+debugging"></a>

### unmsAPI.debugging(enable) ⇒ <code>undefined</code>
Enable or disable the debug of the module

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>boolean</code> | Enable or disable the debugging |

<a name="UnmsAPI+netsite"></a>

### unmsAPI.netsite(url, jsonParams, headers, method, site) ⇒ <code>Promise</code>
Generic network operation, executing UNMS command under /v2.1/<command>/sites/... rest api

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The right part of the URL (/api/s/{site}/ is automatically added) |
| jsonParams | <code>object</code> | optional. Default undefined. If it is defined and it is object, those will be the JSON POST attributes sent to the URL and the the default method is changed from GET to POST |
| headers | <code>object</code> | optional. Default {}. HTTP headers that we require to be sent in the request |
| method | <code>object</code> | optional. Default undefined. The HTTP request method. If undefined, then it is automatic. If no jsonParams specified, it will be GET. If jsonParams are specified it will be POST |
| site | <code>string</code> | optional. The {site} atribute of the request. If not specified, it is taken from the UnifiAPI init options, where if it is not specified, it is "default" |

**Example**  
```js
unifi.netsite('/cmd/stamgr', { cmd: 'authorize-guest', mac: '00:01:02:03:04:05', minutes: 60 }, {}, 'POST', 'default')
    .then(data => console.log('Success', data))
    .catch(error => console.log('Error', error));
```
<a name="UnmsAPI+login"></a>

### unmsAPI.login(username, password) ⇒ <code>Promise</code>
Explicit login to the controller. It is not necessary, as every other method calls implicid login (with the default username and password) before execution

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - success or failure  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | The username |
| password | <code>string</code> | The password |

**Example**  
```js
unifi.login(username, password)
    .then(data => console.log('success', data))
    .catch(err => console.log('Error', err))
```
<a name="UnmsAPI+logout"></a>

### unmsAPI.logout()
Logout of the controller

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Example**  
```js
unms.logout()
    .then(() => console.log('Success'))
    .catch(err => console.log('Error', err))
```
<a name="UnmsAPI+list_sites"></a>

### unmsAPI.list\_sites() ⇒ <code>Promise</code>
List sites

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  
**Example**  
```js
unifi.list_sites()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
<a name="UnmsAPI+list_devices"></a>

### unmsAPI.list\_devices() ⇒ <code>Promise</code>
List devices

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  
**Example**  
```js
unifi.list_devices()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
<a name="UnmsAPI+list_logs"></a>

### unmsAPI.list\_logs(count, which) ⇒ <code>Promise</code>
List logs

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  

| Param | Description |
| --- | --- |
| count | how many to return per page. default is 100000 |
| which | page to return (default 1) |

**Example**  
```js
unifi.list_logs()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
<a name="UnmsAPI+list_outages"></a>

### unmsAPI.list\_outages(count, which) ⇒ <code>Promise</code>
List outages

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  

| Param | Description |
| --- | --- |
| count | how many to return per page. default is 100000 |
| which | page to return (default 1) |

**Example**  
```js
unifi.list_outages()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
<a name="UnmsAPI+list_settings"></a>

### unmsAPI.list\_settings() ⇒ <code>Promise</code>
List settings

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  
**Example**  
```js
unifi.list_outages()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
<a name="UnmsAPI+keepalive"></a>

### unmsAPI.keepalive() ⇒ <code>Promise</code>
Do keepalive

**Kind**: instance method of [<code>UnmsAPI</code>](#UnmsAPI)  
**Returns**: <code>Promise</code> - Promise  
**Example**  
```js
unifi.list_outages()
    .then(done => console.log('Success',done))
    .catch(err => console.log('Error',err))
```
