/*
 * Cookie.js v1.1
 * 
 * Manage all your cookies and sub-cookies with Cookie.js. Cookies.js is a
 * stand-alone script and does NOT require additional libraries (jQuery, YUI, 
 * etc.) to operate.
 * 
 * Cookie.js is a modified and decoupled version of YUI's cookie management 
 * utility. Visit the YUI developer network for more info. 
 * -- http://developer.yahoo.com/yui.
 * 
 * Copyright (c) 2012, Jon LaBelle
 * http://jonlabelle.com
 *
 * Licensed under the MIT license:
 * http://creativecommons.org/licenses/MIT/
 *
 * Date: Mon Sep 17 20:27:14 2012 -0500
 */
(function (window, undefined) {

  var encode = encodeURIComponent,
    decode = decodeURIComponent;

  Cookie = {

    _forEach: function (obj, callback) {
      for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
          callback(k, obj[k]);
        }
      }
    },

    _isArray: Array.isArray || function (obj) {
      return (typeof (obj.length) === "undefined") ? false : true;
    },

    _isNumeric: function (obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    _merge: function (original, newObject) {
      for (var key in newObject) {
        if (newObject.hasOwnProperty(key)) {
          var newPropertyValue = newObject[key];
          var originalPropertyValue = original[key];
        }
        original[key] = (originalPropertyValue && typeof newPropertyValue === 'object' && typeof originalPropertyValue === 'object') ? this._merge(originalPropertyValue, newPropertyValue) : newPropertyValue;
      }
      return original;
    },

    _createCookieString: function (name, value, encodeValue, options) {

      options = options || {};

      var text = encode(name) + "=" + (encodeValue ? encode(value) : value),
        expires = options.expires,
        path = options.path || "/",
        domain = options.domain || "";

      // EXPIRATION DATE
      if (expires instanceof Date) {
        text += "; expires=" + expires.toUTCString();

      } else if (this._isNumeric(expires)) {

        // EXPIRATION IN DAYS
        var days = expires;
        var t = expires = new Date();

        t.setDate(t.getDate() + days);
        text += "; expires=" + expires.toUTCString();

      } else {
        text += "; expires=" + '';
      }

      // PATH
      text += "; path=" + path;

      // DOMAIN
      text += "; domain=" + domain;

      // SECURE
      if (options.secure === true) {
        text += "; secure";
      }

      return text;
    },

    _createCookieHashString: function (hash) {

      if (!hash) {
        return "";
      }

      if (typeof hash !== "object") {
        return "";
      }

      var text = [];


      this._forEach(hash, function (key, value) {
        if (typeof value !== "function" && typeof value !== "undefined") {
          text.push(encode(key) + "=" + encode(String(value)));
        }
      });

      return text.join("&");
    },

    _parseCookieHash: function (text) {

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

    _parseCookieString: function (text, shouldDecode) {

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

          // check for normally-formatted cookie (name-value)
          cookieNameValue = cookieParts[i].match(/([^=]+)=/i);

          if (this._isArray(cookieNameValue)) {

            try {
              cookieName = decode(cookieNameValue[1]);
              cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));

            } catch (ex) {
              // intentionally ignore the cookie - the encoding is wrong
            }

          } else {
            // means the cookie does not have an "=", so treat it as a boolean flag
            cookieName = decode(cookieParts[i]);
            cookieValue = "";
          }

          cookies[cookieName] = cookieValue;
        }

      }

      return cookies;
    },

    exists: function (name) {
      if (!name) {
        return false;
      }

      var cookies = this._parseCookieString(document.cookie, true);
      return cookies.hasOwnProperty(name);
    },

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

      cookies = this._parseCookieString(document.cookie, !options.raw);
      cookie = cookies[name];

      // should return null, not undefined if the cookie doesn't exist
      if (!cookie || typeof cookie === "undefined") {
        return null;
      }

      if (typeof converter === "function") {
        return converter(cookie);
      }

      return cookie;
    },

    getSub: function (name, subName, converter) {
      var hash = this.getSubs(name);

      if (!hash && hash === null) {
        return null;
      }

      if (!subName) {
        return null;
      }

      if (!hash[subName] || typeof hash[subName] === "undefined") {
        return null;
      }

      if (typeof converter === "function") {
        return converter(hash[subName]);
      }

      return hash[subName];
    },

    getSubs: function (name) {
      if (!name) {
        return null;
      }

      var cookies = this._parseCookieString(document.cookie, false);

      if (typeof cookies[name] === "string") {
        return this._parseCookieHash(cookies[name]);
      }

      return null;
    },

    remove: function (name, options) {

      // set options
      options = this._merge(options || {}, {
        expires: new Date(0)
      });

      // set cookie
      return this.set(name, "", options);
    },

    removeSub: function (name, subName, options) {
      if (!name || !subName) {
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
            if (subs.hasOwnProperty(key) && !typeof subs[key] === "function" && !typeof subs[key] === "undefined") {

              return this.setSubs(name, subs, options);
            }
          }
          return this.remove(name, options);
        }

      } else {
        return "";
      }
    },

    set: function (name, value, options) {
      if (typeof value === "undefined") {
        value = "";
      }

      options = options || {};

      var text = this._createCookieString(name, value, !options.raw, options);
      document.cookie = text;

      return text;
    },

    setSub: function (name, subName, value, options) {
      if (!name || !subName) {
        return "";
      }

      if (typeof value === "undefined") {
        //error("Cookie.setSub(): Subcookie value cannot be undefined.");
        value = "";
      }

      var hash = this.getSubs(name);

      if (!hash || typeof hash !== "object") {
        hash = {};
      }

      if (subName && value) {
        hash[subName] = value;
      }

      return this.setSubs(name, hash, options);
    },

    setSubs: function (name, value, options) {
      if (!name) {
        return "";
      }

      if (!value || typeof value !== "object") {
        value = "";
      }

      var text = this._createCookieString(name, this._createCookieHashString(value), false, options);
      document.cookie = text;

      return text;
    },

    enabled: function () {
      // quick way to check if cookies are enabled.

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

  }; // end of Cookie, and it's global.

}(window));