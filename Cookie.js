/*!
 * Cookie.js, v1.5.0
 *
 * A tiny (1.24 KB gzipped), stand-alone JavaScript utility for
 * managing cookies in the browser.
 *
 * https://github.com/jonlabelle/cookie-js
 *
 * Copyright (c) 2012-2018 Jon LaBelle
 * Licensed under MIT (http://creativecommons.org/licenses/MIT/)
 */
(function(global, factory) {
    "use strict";
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else {
        typeof define === "function" && define.amd
            ? define(factory)
            : (global.Cookie = factory());
    }
})(this, function() {
    "use strict";

    var encode = encodeURIComponent,
        decode = decodeURIComponent;

    /**
     * Determines if the value's type is a number.
     *
     * @param  {Any}
     *
     * @return {Boolean}
     */
    function isNumeric(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }

    /**
     * Merges two objects.
     *
     * @param  {Object} objOne
     * @param  {Object} objTwo
     *
     * @return {Object}
     */
    function mergeObjects(objOne, objTwo) {
        if (objOne instanceof Array) {
            return objOne.concat(objTwo);
        }

        var merged = {},
            property;

        for (property in objOne) {
            if (objOne.hasOwnProperty(property)) {
                merged[property] = objOne[property];
            }
        }

        for (property in objTwo) {
            if (objTwo.hasOwnProperty(property)) {
                merged[property] = objTwo[property];
            }
        }

        return merged;
    }

    /**
     * Iterates over an object's properties and applies a callback
     * function.
     *
     * @param  {Object}   obj The object to iterate over.
     * @param  {function} callback The callback function to
     */
    function objectForEach(obj, callback) {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                callback(property, obj[property]);
            }
        }
    }

    var Cookie = {

        /**
         * Creates a cookie string that can be assigned into document.cookie.
         *
         * @param  {String}  name The name of the cookie.
         * @param  {String}  value The value of the cookie.
         * @param  {Boolean} encodeValue True to encode the value, false to
         *     leave as-is.
         * @param  {Object}  options (Optional) Options for the cookie.
         *
         * @return {String} The formatted cookie string.
         */
        createCookieString: function (name, value, encodeValue, options) {
            options = options || {};

            var text = encode(name) + "=" + (encodeValue ? encode(value) : value),
                expires = options.expires,
                path = options.path || "/",
                domain = options.domain;

            if (typeof options === "object") {
                // expire date
                if (expires instanceof Date) {
                    text += "; expires=" + expires.toUTCString();
                } else if (isNumeric(expires)) {
                    // expire days (int)
                    var when = new Date();
                    when.setDate(when.getDate() + expires);
                    text += "; expires=" + when.toUTCString();
                }

                // path
                if (typeof path === "string" && path !== "") {
                    text += "; path=" + path;
                }

                // domain
                if (typeof domain === "string" && domain !== "") {
                    text += "; domain=" + domain;
                }

                // secure
                if (options.secure === true) {
                    text += "; secure";
                }
            }

            return text;
        },

        /**
         * Creates a string from a hash/object.
         *
         * @param  {Object} hash An object of key-value pairs to create a string
         *     for.
         *
         * @return {String} A string suitable for use as a cookie value.
         */
        createCookieHashString: function (hash) {
            if (typeof hash !== "object") {
                return "";
            }

            var text = [];

            objectForEach(hash, function (key, value) {
                if (typeof value !== "function" && typeof value !== "undefined") {
                    text.push(encode(key) + "=" + encode(String(value)));
                }
            });

            return text.join("&");
        },

        /**
         * Parses a cookie hash string into an object.
         *
         * @param {String} text The cookie hash string to parse (format:
         *     n1=v1&n2=v2).
         *
         * @return {Object} An object containing entries for each cookie value.
         */
        parseCookieHash: function (text) {
            var hashParts = text.split("&"),
                hashPart = null,
                hash = {};

            if (text.length) {
                for (var i = 0, len = hashParts.length; i < len; i++) {
                    hashPart = hashParts[i].split("=");
                    hash[decode(hashPart[0])] = decode(hashPart[1]);
                }
            }

            return hash;
        },

        /**
         * Parses a cookie string into an object representing all accessible
         * cookies.
         *
         * @param {String} text The cookie string to parse.
         * @param {Boolean} shouldDecode (Optional) Indicates if the cookie
         *     values should be decoded or not. Default is true.
         * @param {Object} options (Optional) Contains settings for loading the
         *     cookie.
         *
         * @return {Object}
         */
        parseCookieString: function (text, shouldDecode, options) {
            var cookies = {};

            if (typeof text === "string" && text.length > 0) {
                var decodeValue = (shouldDecode === false ? function (s) {
                        return s;
                    } : decode),
                    cookieParts = text.split(/;\s/g),
                    cookieName = null,
                    cookieValue = null,
                    cookieNameValue = null;

                for (var i = 0, len = cookieParts.length; i < len; i++) {
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    if (cookieNameValue instanceof Array) {
                        try {
                            cookieName = decode(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(
                                cookieNameValue[1].length + 1));
                        } catch (ex) {
                            // ignore... encoding is wrong.
                        }
                    } else {
                        // means the cookie does not have an "=", so treat it as a
                        // boolean flag
                        cookieName = decode(cookieParts[i]);
                        cookieValue = "";
                    }
                    // don't overwrite an already loaded cookie if set by option
                    if (typeof options !== "undefined" && options.reverseCookieLoading) {
                        if (typeof cookies[cookieName] === "undefined") {
                            cookies[cookieName] = cookieValue;
                        }
                    } else {
                        cookies[cookieName] = cookieValue;
                    }
                }
            }

            return cookies;
        },

        /**
         * Determines if the cookie with the given name exists. This is useful
         * for Boolean cookies (those that do not follow the name=value
         * convention).
         *
         * @param {String} name The name of the cookie to check.
         *
         * @return {Boolean} True if the cookie exists, false if not.
         */
        exists: function (name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }

            var cookies = this.parseCookieString(document.cookie, true);

            return cookies.hasOwnProperty(name);
        },

        /**
         * Returns the cookie value for the given name.
         *
         * @param {String} name The name of the cookie to retrieve.
         * @param {Function|Object} options (Optional) An object containing one
         *      or more cookie options: raw (true/false), reverseCookieLoading
         *      (true/false) and converter (a function). The converter function
         *      is run on the value before returning it. The function is not
         *      used if the cookie doesn't exist. The function can be passed
         *      instead of the options object for backwards compatibility. When
         *      raw is set to true, the cookie value is not URI decoded.
         *
         * @return {Any} If no converter is specified, returns a string or null
         *      if the cookie doesn't exist. If the converter is specified,
         *      returns the value returned from the converter or null if the
         *      cookie doesn't exist.
         */
        get: function (name, options) {
            var cookies,
                cookie,
                converter;

            // if options is a function, then it's the converter
            if (typeof options === "function") {
                converter = options;
                options = {};
            } else if (typeof options === "object") {
                converter = options.converter;
            } else {
                options = {};
            }

            cookies = this.parseCookieString(document.cookie, !options.raw, options);
            cookie = cookies[name];

            // should return null, not undefined if the cookie doesn't exist
            if (typeof cookie === "undefined") {
                return null;
            }

            if (typeof converter === "function") {
                return converter(cookie);
            }

            return cookie;
        },

        /**
         * Returns the value of a sub-cookie.
         *
         * @param {String} name The name of the cookie to retrieve.
         * @param {String} subName The name of the sub-cookie to retrieve.
         * @param {Function} converter (Optional) A function to run on the value
         *      before returning it. The function is not used if the cookie
         *      doesn't exist.
         * @param {Object} options (Optional) Containing one or more settings
         *     for cookie parsing.
         *
         * @return {Any} If the cookie doesn't exist, null is returned. If the
         *      sub-cookie doesn't exist, null if also returned. If no converter
         *      is specified and the sub-cookie exists, a string is returned. If
         *      a converter is specified and the sub-cookie exists, the value
         *      returned from the converter is returned.
         *
         * @return {Any}
         */
        getSub: function (name, subName, converter, options) {
            var hash = this.getSubs(name, options);

            if (hash === null) {
                return null;
            }

            if (typeof subName !== "string" || subName === "") {
                return null;
            }

            if (typeof hash[subName] === "undefined") {
                return null;
            }

            if (typeof converter === "function") {
                return converter(hash[subName]);
            }

            return hash[subName];
        },

        /**
         * Returns an object containing name-value pairs stored in the cookie
         * with the given name.
         *
         * @param {String} name The name of the cookie to retrieve.
         * @param {Object} options (Optional) Containing one or more settings
         *     for cookie parsing.
         * @return {Object} An object of name-value pairs if the cookie with the
         *      given name exists, null if it does not.
         *
         * @return {Object}
         */
        getSubs: function (name, options) {
            var cookies = this.parseCookieString(document.cookie, false, options);

            if (typeof cookies[name] === "string") {
                return this.parseCookieHash(cookies[name]);
            }

            return null;
        },

        /**
         * Removes a cookie from the machine by setting its expiration date to
         * sometime in the past.
         *
         * @param {String} name The name of the cookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), and secure
         *      (true/false). The expires option will be overwritten by the
         *      method.
         *
         * @return {String} The created cookie string.
         *
         * @return {String} the created cookie string.
         */
        remove: function (name, options) {
            if (typeof name !== "string" || name === "") {
                return "";
            }

            options = mergeObjects(options || {}, {
                expires: new Date(0)
            });

            return this.set(name, "", options);
        },

        /**
         * Removes a sub cookie with a given name.
         *
         * @param {String} name The name of the cookie in which the sub-cookie
         *     exists.
         * @param {String} subName The name of the sub-cookie to remove.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a
         *      Date object), removeIfEmpty (true/false), and secure
         *      (true/false). This must be the same settings as the original
         *      sub-cookie.
         *
         * @return {String} The created cookie string.
         *
         * @return {String} the created cookie string.
         */
        removeSub: function (name, subName, options) {
            if (typeof name !== "string" || name === "") {
                return "";
            }

            if (typeof subName !== "string" || subName === "") {
                return "";
            }

            options = options || {};

            // get all sub-cookies for this cookie
            var subs = this.getSubs(name);

            // delete the indicated sub-cookie
            if (typeof subs === "object" && subs.hasOwnProperty(subName)) {
                delete subs[subName];
                if (!options.removeIfEmpty) {
                    return this.setSubs(name, subs, options); // reset the cookie
                } else {
                    // reset the cookie if there are sub-cookies left, else remove
                    for (var key in subs) {
                        if (subs.hasOwnProperty(key) && typeof subs[key] !== "function" &&
                            typeof subs[key] !== "undefined") {
                            return this.setSubs(name, subs, options);
                        }
                    }
                    return this.remove(name, options);
                }
            } else {
                return "";
            }
        },

        /**
         * Sets a cookie with a given name and value.
         *
         * @param {String} name The name of the cookie to set.
         * @param {Any} value The value to set for the cookie.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a
         *      Date object), secure (true/false), and raw (true/false). Setting
         *      raw to true indicates that the cookie should not be URI encoded
         *      before being set.
         *
         * @return {String} The created cookie string.
         */
        set: function (name, value, options) {
            if (typeof name !== "string" || name === "") {
                return null;
            }

            if (typeof value === "undefined") {
                return null;
            }

            options = options || {};

            var text = this.createCookieString(name, value, !options.raw, options);
            document.cookie = text;

            return text;
        },

        /**
         * Sets a sub cookie with a given name to a particular value.
         *
         * @param {String} name The name of the cookie to set.
         * @param {String} subName The name of the sub-cookie to set.
         * @param {Any} value The value to set.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a
         *      Date object), and secure (true/false).
         *
         * @return {String} The created cookie string.
         */
        setSub: function (name, subName, value, options) {
            if (typeof name !== "string" || name === "") {
                return "";
            }

            if (typeof subName !== "string" || subName === "") {
                return "";
            }

            if (typeof value === "undefined") {
                return "";
            }

            var hash = this.getSubs(name);
            if (!hash) {
                hash = {};
            }

            hash[subName] = value;

            return this.setSubs(name, hash, options);
        },

        /**
         * Sets a cookie with a given name to contain a hash of name-value
         * pairs.
         *
         * @param {String} name The name of the cookie to set.
         * @param {Object} value An object containing name-value pairs.
         * @param {Object} options (Optional) An object containing one or more
         *      cookie options: path (a string), domain (a string), expires (a
         *      Date object), and secure (true/false).
         *
         * @return {String} The created cookie string.
         */
        setSubs: function (name, value, options) {
            if (typeof name !== "string" || name === "") {
                return "";
            }

            if (typeof value !== "object") {
                return "";
            }

            var text = this.createCookieString(
                name,
                this.createCookieHashString(value),
                false,
                options
            );

            document.cookie = text;

            return text;
        },

        /**
         * Checks whether or not Cookies on the client browser.
         *
         * @return {Boolean} True if Cookies are enabled, otherwise False.
         */
        enabled: function() {
            if (navigator.cookieEnabled) {
                return true;
            }

            var key = "_",
                val = "_",
                cookieEnabled = false;

            this.set(key, val);
            if (this.get(key) === val) {
                cookieEnabled = true;
                this.remove(key);
            }

            return cookieEnabled;
        },

        /**
         * Clears all browser cookies.
         *
         * @return {Void}
         */
        clear: function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var position = cookie.indexOf("=");
                var name = position > -1 ? cookie.substr(0, position) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    };

    return Cookie;
});
