/*!
 * Cookie.js v1.4.0
 * https://github.com/jonlabelle/cookie-js
 *
 * A tiny (1.24 KB gzipped), stand-alone JavaScript utility for
 * managing cookies in the browser.
 *
 * Copyright (c) 2012-2014 Jon LaBelle
 * Licensed under MIT (http://creativecommons.org/licenses/MIT/)
 */
(function (window, undefined) {
  "use strict";

  var encode = encodeURIComponent,
    decode = decodeURIComponent;

  /**
   * Number type check.
   *
   * @param  {mixed}
   *
   * @return {bool}
   */

  function isNumeric(val) {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  /**
   * Merge two objects.
   *
   * @param  {object} objOne
   * @param  {object} objTwo
   *
   * @return {object}
   */

  function merge(objOne, objTwo) {
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
   * Iterates over an object properties.
   *
   * @param  {object}   obj
   * @param  {function} callback
   */

  function objectEach(obj, callback) {
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
     * @param  {string} name
     * @param  {string} value
     * @param  {bool}   encodeValue
     * @param  {object} options
     *
     * @return {string} the formatted cookie string.
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
        }
        else if (isNumeric(expires)) {
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
     * @param  {object} hash
     *
     * @return {string}
     */
    createCookieHashString: function (hash) {
      if (typeof hash !== "object") {
        return "";
      }

      var text = [];
      objectEach(hash, function (key, value) {
        if (typeof value !== "function" && typeof value !== "undefined") {
          text.push(encode(key) + "=" + encode(String(value)));
        }
      });

      return text.join("&");
    },

    /**
     * Parses a cookie hash string into an object.
     *
     * @param  {string} text
     *
     * @return {object}
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
     * Parses a cookie into an object representation.
     *
     * @param  {string} text
     * @param  {bool}   shouldDecode
     * @oaram  {object} options
     *
     * @return {object}
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
            }
            catch (ex) {
              // ignore... encoding is wrong.
            }
          }
          else {
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
          }
          else {
            cookies[cookieName] = cookieValue;
          }
        }
      }

      return cookies;
    },

    /**
     * Determines if the cookie with the given name exists.
     *
     * @param  {string} name
     *
     * @return {bool}
     */
    exists: function (name) {
      if (typeof name !== "string" || typeof name === "") {
        return false;
      }
      var cookies = this.parseCookieString(document.cookie, true);
      return cookies.hasOwnProperty(name);
    },

    /**
     * Gets the cookie value for the given name.
     *
     * @param  {string} name
     * @param  {object} options
     *
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
      }
      else if (typeof options === "object") {
        converter = options.converter;
      }
      else {
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
     * @param  {string}   name
     * @param  {string}   subName
     * @param  {function} converter
     * @param  {object}   options
     *
     * @return {mixed}
     */
    getSub: function (name, subName, converter, options) {
      var hash = this.getSubs(name, options);

      if (hash === null) {
        return null;
      }
      if (typeof subName !== "string" || typeof subName === "") {
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
     * Gets sub-cookie as a hash object.
     *
     * @param  {string} name
     * @param  {object} options
     *
     * @return {object}
     */
    getSubs: function (name, options) {
      var cookies = this.parseCookieString(document.cookie, false, options);
      if (typeof cookies[name] === "string") {
        return this.parseCookieHash(cookies[name]);
      }
      return null;
    },

    /**
     * Removes the cookie.
     *
     * @param  {string} name
     * @param  {object} options
     *
     * @return {string} the created cookie string.
     */
    remove: function (name, options) {
      if (typeof name !== "string" || typeof name === "") {
        return "";
      }

      options = merge(options || {}, {
        expires: new Date(0)
      });

      return this.set(name, "", options);
    },

    /**
     * Removes a sub-cookie with a given name.
     *
     * @param  {string} name
     * @param  {string} subName
     * @param  {object} options
     *
     * @return {string} the created cookie string.
     */
    removeSub: function (name, subName, options) {
      if (typeof name !== "string" || typeof name === "") {
        return "";
      }
      if (typeof subName !== "string" || typeof subName === "") {
        return "";
      }

      options = options || {};

      // get all subcookies for this cookie
      var subs = this.getSubs(name);

      // delete the indicated subcookie
      if (typeof subs === "object" && subs.hasOwnProperty(subName)) {
        delete subs[subName];
        if (!options.removeIfEmpty) {
          return this.setSubs(name, subs, options); // reset the cookie
        }
        else {
          // reset the cookie if there are subcookies left, else remove
          for (var key in subs) {
            if (subs.hasOwnProperty(key) && typeof subs[key] !== "function" &&
              typeof subs[key] !== "undefined") {
              return this.setSubs(name, subs, options);
            }
          }
          return this.remove(name, options);
        }

      }
      else {
        return "";
      }
    },

    /**
     * Sets a cookie with a given name and value.
     *
     * @param {string} name
     * @param {mixed}  value
     * @param {object} options
     *
     * @return {string} the created cookie string.
     */
    set: function (name, value, options) {
      if (typeof name !== "string" || typeof name === "") {
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
     * Set a sub-cookie.
     *
     * @param {string}     name
     * @param {string}     subName
     * @param {string|int} value
     * @param {object}     options
     *
     * @return {string} the created cookie string.
     */
    setSub: function (name, subName, value, options) {
      if (typeof name !== "string" || typeof name === "") {
        return "";
      }
      if (typeof subName !== "string" || typeof subName === "") {
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
     * Set sub-cookies.
     *
     * @param {string} name
     * @param {object} value
     * @param {object} options
     *
     * @return {string} the created cookie string.
     */
    setSubs: function (name, value, options) {
      if (typeof name !== "string" || typeof name === "") {
        return "";
      }
      if (typeof value !== "object") {
        return "";
      }

      var text = this.createCookieString(name, this.createCookieHashString(
        value), false, options);
      document.cookie = text;

      return text;
    },

    /**
     * Check whether cookies are enabled by the browser.
     *
     * @return {bool}
     */
    enabled: function () {
      return navigator.cookieEnabled;
    },

    /**
     * Clears all cookies.
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

  window.Cookie = Cookie;

}(window));
