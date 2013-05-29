/*!
 * CreateAPI.js
 * Copyright(c) 2013 John Henry
 * MIT Licensed
 */

/**
 * CreateAPI:
 *
 * Library for Creating APIs within your application that connect to APIs on the web.
 * Can be used in both client-side (Browser) and server-side (Node) applications.
 *
 * Examples:
 *      Please see https://github.com/johnhenry/random-org-api for a usage example
 *   
 */
(function (exports, global) {
    /* 
     * request_from_browser
     *
     * Access API request through browser
     *
     * @param {string} url
     * //Object passed to determine api functions
     * @param {function(data)} callback 
     * //Function to be preformed upon success retrival of data
     * @param {function(error)} failure
     * //Function to be called upon error
     * @param {Array} transformResponse
     * //Function or array of functions to be preformed on result before returned
     * @return {function}
     * 
     * @api private
     */
    var request_from_browser = function (url, callback, failure, transformResponse) {
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                data = http.responseText;
                if (http.status < 400) {
                    if (typeof callback === 'function') {
                        callback.call(this, transform_result(data, transformResponse), data, http);
                    }
                } else {
                    if (typeof failure === 'function') {
                        failure.call(this, http.status, data, http);
                    }
                }
            }
        };
        http.open("GET", url, true);
        http.send();
    };
    /* 
     * request_from_node
     *
     * Access API request through node
     *
     * @param {string} url
     * //Object passed to determine api functions
     * @param {function(data)} callback 
     * //Function to be preformed upon success retrival of data
     * @param {function(error)} failure
     * //Function to be called upon error
     * @param {Array} transformResponse
     * //Function or array of functions to be preformed on result before returned
     * @return {function}
     * 
     * @api private
     */
    var request_from_node = function (url, callback, failure, transformResponse) {
        http.get(url, function (result) {
            var data = "";
            result.on('data', function (chunk) {
                data += chunk;
            }).on('end', function (end_data) {
                if (typeof callback === 'function') {
                    callback.call(this, transform_result(data.toString(), transformResponse), end_data, http);
                }
            }).on('error', function (e) {
                if (typeof failure === 'function') {
                    failure.call(this, e, data.toString(), http);
                }
            });
        });
    };

    /* 
     * request
     *
     * Used to make requests as determined by enviornment.
     * (browser or node)
     */   
    var request = global.XMLHttpRequest ? request_from_browser : request_from_node, http = global.XMLHttpRequest ? new global.XMLHttpRequest() : require("http");

    /* 
     * transform_result
     *
     * Access API request through node
     *
     * @param {*} raw
     * //Unprocessed result of the API call
     * @param {transformations} callback 
     * //List of transformations to be preformed on the result of the api call.
     * @return {*}
     * 
     * @api private
     */ 
    var transform_result = function (raw, transformations) {
        transformations = transformations || [];
        for (var i = 0; i<transformations.length;i++){
            raw = (typeof transformations[i] === 'function') ? transformations[i](raw) : raw;
        }
        return raw;
    }


    /* 
     * Get
     *
     * Creates a HTTP GET based API
     *
     * @param {object} api
     * //Object passed to determine api functions
     * @param {function} errorFunc
     * //function called if error is thrown
     * @return {function(parameters,callback,failure)}
     * 
     * @api public
     */    
    var Get = exports.Get = function(api, errorFunc){
        api = api || {};
        api.url = api.url || "/";
        api.transformResponse = api.transformResponse || [];
        if(typeof api.transformResponse === 'function') api.transformResponse = [api.transformResponse];//Allows a single function for transformResponse as well as an array
        api.dataDefault = api.dataDefault || {};
        api.dataRequired = api.dataRequired || {};
        return function(parameters,callback,failure){
            var parameters = parameters || {};
            for(var key in api.dataDefault) parameters[key] = parameters[key] || api.dataDefault[key];
            for(var key in api.dataRequired) parameters[key] = api.dataRequired[key];
            try{
                var url = [];
                for(var key in parameters) url.push(key+"="+parameters[key]);
                url = api.url + "/?" +url.join("&");
                request(url,callback,failure,api.transformResponse);
            }catch(e){
                if(typeof errorFunc === 'function') errorFunc(e);
            }
            return parameters;
        }
    }

    /* 
     * Create
     *
     * Creates an object populated with HTTP GET APIs
     *
     * @param {object} apiObj
     * //Object passed to determine APIs
     * @param {object} obj
     * //Object to be populated with APIs
     * @param {function} errorFuncByName
     * //function that creates error function based on api names
     * @return {object} object populated by api
     * 
     * @api public
     */ 
    var Create = exports.Create = function(apiObj, obj, errorFuncByName){
        obj = obj || {};
        for(var key in apiObj) 
            obj[key] = Get(apiObj[key],typeof errorFuncByName === "function" ? errorFuncByName(key) : undefined);
        return obj;
    }
})(typeof exports === 'undefined' ? this['CreateAPI']={}: exports, typeof global === 'undefined' ? window : global);