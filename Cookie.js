/*
 * Cookie.js v1.3
 *
 * Manage all your cookies and sub-cookies with Cookie.js. Cookies.js is a
 * stand-alone script and does NOT require additional libraries (jQuery, YUI,
 * etc.) to operate.
 *
 * Copyright (c) 2013, Jon LaBelle
 * http://jonlabelle.com
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 *
 * Date: Tue Apr 09 04:44:13 2013 -0500
 */
(function (global, factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(factory);
  }
  else {
    global.Cookie = factory();
  }

})(this, function () {

  'use strict';

  var encode = encodeURIComponent,
      decode = decodeURIComponent;

  /**
   * Is Array
   *
   * @param  {mixed} obj Object to test.
   * @return {bool}
   */
  function isArray(obj) {
    return (typeof obj.length === "undefined") ? false : true;
  }

  /**
   * Is Number check.
   *
   * @param  {mixed}  val The value to check.
   * @return {bool}
   */
  function isNumeric (val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  /**
   * Merges two objects.
   *
   * @param  {obj} original
   * @param  {obj} newObject
   * @return {obj} The combined merged objects.
   */
  function merge (original, newObject) {

    for (var key in newObject) {
      if (newObject.hasOwnProperty(key)) {
        var newPropertyValue = newObject[key];
        var originalPropertyValue = original[key];
      }

      original[key] = (originalPropertyValue && typeof newPropertyValue === "object" && typeof originalPropertyValue === "object") ? merge(originalPropertyValue, newPropertyValue) : newPropertyValue;
    }

    return original;
  }

  /**
   * Iterate over an object.
   *
   * @param  {obj}      obj      The object to iterate.
   * @param  {Function} callback The callback function.
   */
  function each (obj, callback) {

    for (var k in obj) {
      if (obj.hasOwnProperty(k)) {
        callback(k, obj[k]);
      }
    }

  }

  var Cookie = {

    /**
     * Creates the cookie string.
     *
     * @param  {string} name
     * @param  {string} value
     * @param  {string} encodeValue Whether or not to encode the cookie values.
     * @param  {obj}    options
     * @return {string}
     */
    createCookieString: function (name, value, encodeValue, options) {

      options = options || {};

      var text    = encode(name) + "=" + (encodeValue ? encode(value) : value),
          expires = options.expires,
          path    = options.path || "/",
          domain  = options.domain;

      // EXPIRATION AS DATE (if not set, cookie expires on session end)
      if (expires instanceof Date) {
        text += "; expires=" + expires.toUTCString();

      } else if (isNumeric(expires)) {

        // EXPIRATION AS DAYS (int)
        var days = expires;
        var t = expires = new Date();

        t.setDate(t.getDate() + days);

        text += "; expires=" + expires.toUTCString();
      }

      // PATH
      text += "; path=" + path;

      // DOMAIN
      if (domain) {
        text += "; domain=" + domain;
      }

      // SECURE
      if (options.secure === true) {
        text += "; secure";
      }

      return text;
    },

    /**
     * Creates a string from a hash/object.
     *
     * @param  {obj} hash
     * @return {string}
     */
    createCookieHashString: function (hash) {

      if (hash === null || typeof hash !== "object") {
        return "";
      }

      var text = [];

      each(hash, function (key, value) {
        if (typeof value !== "function" && typeof value !== "undefined") {
          text.push(encode(key) + "=" + encode(String(value)));
        }
      });

      return text.join("&");
    },

    /**
     * Parses a string into a hash object.
     *
     * @access @internal
     * @param  {string} text
     * @return {obj}
     */
    parseCookieHash: function (text) {

      var hashParts = text.split("&"),
          hashPart  = null,
          hash      = {};

      if (text.length) {
        for (var i = 0, len = hashParts.length; i < len; i++) {
          hashPart = hashParts[i].split("=");
          hash[decode(hashPart[0])] = decode(hashPart[1]);
        }
      }

      return hash;
    },

    /**
     * Parses a cookie into an object representation.
     *
     * @param  {string} text
     * @param  {bool}   shouldDecode Whether or not to decode the cookie values.
     * @return {obj}
     */
    parseCookieString: function (text, shouldDecode) {

      var cookies = {};

      if (typeof text === "string" && text.length > 0) {

        var decodeValue = (shouldDecode === false ? function (s) {
          return s;
        } : decode),
          cookieParts     = text.split(/;\s/g),
          cookieName      = null,
          cookieValue     = null,
          cookieNameValue = null;

        for (var i = 0, len = cookieParts.length; i < len; i++) {

          // check for normally-formatted cookie (name-value)
          cookieNameValue = cookieParts[i].match(/([^=]+)=/i);

          if (isArray(cookieNameValue)) {

            try {

              cookieName  = decode(cookieNameValue[1]);
              cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));

            } catch (ex) {
              // ignore cookie, the encoding is wrong.
            }

          } else {
            // means the cookie does not have an "=", so treat it as a
            // boolean flag
            cookieName = decode(cookieParts[i]);
            cookieValue = "";
          }

          cookies[cookieName] = cookieValue;
        }
      }

      return cookies;
    },

    /**
     * Checks whether the cookie exists.
     *
     * @param  {string} name
     * @return {bool}
     */
    exists: function (name) {
      var cookies = this.parseCookieString(document.cookie, true);
      return cookies.hasOwnProperty(name);
    },

    /**
     * Get cookie.
     *
     * @param  {string} name
     * @param  {obj} options
     * @return {mixed}
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

      cookies = this.parseCookieString(document.cookie, !options.raw);
      cookie = cookies[name];

      // should return null, not undefined if the cookie doesn't exist
      if (cookie === null || typeof cookie === "undefined") {
        return null;
      }

      if (typeof converter === "function") {
        return converter(cookie);
      }

      return cookie;
    },

    /**
     * Get sub-cookie.
     *
     * @param  {string}   name
     * @param  {string}   subName
     * @param  {function} converter
     * @return {string}
     */
    getSub: function (name, subName, converter) {
      var hash = this.getSubs(name);

      if (hash === null) {
        return null;
      }

      if (typeof subName === "undefined" || subName === null) {
        return null;
      }

      if (hash[subName] === null || typeof hash[subName] === "undefined") {
        return null;
      }

      if (typeof converter === "function") {
        return converter(hash[subName]);
      }

      return hash[subName];
    },

    /**
     * Gets sub-cookie as a hash object.
     *
     * @param  {string} name
     * @return {obj}
     */
    getSubs: function (name) {

      var cookies = this.parseCookieString(document.cookie, false);

      if (typeof cookies[name] === "string") {
        return this.parseCookieHash(cookies[name]);
      }

      return null;
    },

    /**
     * Removes the cookie.
     *
     * @param  {string} name
     * @param  {obj} options
     * @return {string}
     */
    remove: function (name, options) {

      // set options
      options = merge(options || {}, {
        expires: new Date(0)
      });

      // set cookie
      this.set(name, "", options);

      return this;
    },

    /**
     * Remove a sub-cookie.
     *
     * @param  {string} name
     * @param  {string} subName
     * @param  {obj} options
     * @return {string}
     */
    removeSub: function (name, subName, options) {
      if (typeof name === "undefined" || name === null) {
        return "";
      }

      if (typeof subName === "undefined" || subName === null) {
        return "";
      }

      options = options || {};

      // get all subcookies for this cookie
      var subs = this.getSubs(name);

      // delete the indicated subcookie
      if (typeof subs === "object" && subs.hasOwnProperty(subName)) {
        delete subs[subName];

        if (!options.removeIfEmpty) {

          // reset the cookie
          return this.setSubs(name, subs, options);

        } else {

          // reset the cookie if there are subcookies left, else remove
          for (var key in subs) {
            if (subs.hasOwnProperty(key) && typeof subs[key] !== "function" && typeof subs[key] !== "undefined") {
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
     * Set a cookie.
     *
     * @param {string} name
     * @param {string|int} value
     * @param {obj} options
     */
    set: function (name, value, options) {
      if (typeof value === "undefined") {
        value = "";
      }

      options = options || {};

      var text = this.createCookieString(name, value, !options.raw, options);
      document.cookie = text;

      return this;
    },

    /**
     * Set a sub-cookie.
     *
     * @param {string} name
     * @param {string} subName
     * @param {string|int} value
     * @param {obj} options
     */
    setSub: function (name, subName, value, options) {

      if (typeof name === "undefined" || typeof subName === "undefined") {
        return "";
      }

      if (typeof value === "undefined") {
        //error("Cookie.setSub(): Subcookie value cannot be undefined.");
        value = "";
      }

      var hash = this.getSubs(name);

      if (hash === null || typeof hash !== "object") {
        hash = {};
      }

      hash[subName] = value;


      return this.setSubs(name, hash, options);
    },

    /**
     * Sets a sub-cookies.
     *
     * @param {string} name
     * @param {obj} value
     * @param {obj} options
     */
    setSubs: function (name, value, options) {

      if (name === null || typeof name === "undefined") {
        return "";
      }

      if (value === null || typeof value === "undefined" || typeof value !== "object") {
        return "";
      }

      var text = this.createCookieString(name, this.createCookieHashString(value), false, options);
      document.cookie = text;

      return text;
    },

    /**
     * Checks whether cookies are enabled by the browser.
     *
     * @return {bool}
     */
    enabled: function () {

      var key = "jUQFUy5j3vHnA14R",
          val = "cookieMonster";

      var cookieEnabled = (navigator.cookieEnabled) ? true : false;

      if (typeof navigator.cookieEnabled === "undefined" && !cookieEnabled) {
        this.set(key, val);
        cookieEnabled = this.exists(key);
      }

      if (cookieEnabled) {
        this.remove(key);
      }

      return cookieEnabled;
    }

  };

  return Cookie;

});
