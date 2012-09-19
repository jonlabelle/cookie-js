Cookie.js
=================

Manage all your cookies and sub-cookies with Cookie.js. Cookie.js is a stand-alone script and does NOT require additional libraries (jQuery, YUI, etc.) to operate.

Usage
-----

Add [Cookie.min.js](https://raw.github.com/jonlabelle/cookie-js/master/Cookie.min.js) to your HTML document.

```html
<script type="text/javascript" src="Cookie.min.js"></script>
```

Cookie.set()
------------

Create a cookie using the default options

```javascript
Cookie.set("firstname", "jon");
```

You can also set multiple cookies at once (chaining)

```javascript
Cookie.set("firstname", "jon").set("id", "1234");
```

#### Set the *expires* option

```javascript
Cookie.set("firstname", "jon", {
  expires: new Date("March 18, 2040")
});
```

```javascript
Cookie.set("firstname", "jon", {
  expires: 30 // expires in 30-days
});
```

The `expires` option can be a `Date` or a `Number` value type. If the `expires` option is NOT set, it will be a *session* cookie (expiring when the session ends).

#### Set the *path* and *domain* options

```javascript
Cookie.set("firstname", "jon", {
  path: "/",
  domain: ".jonlabelle.com"
});
```

#### Set the *secure* option

```javascript
Cookie.set("secure_name", "jon", {
  secure: true
});
```

Setting the `secure` option to `true` ensures the cookie is always encrypted when transmitting from client to server.

Cookie.get()
------------

```javascript
Cookie.get("firstname");
```

Returns `null` if the cookie does NOT exist.

#### Cookie exists

```javascript
if (Cookie.exists("firstname")) {
  console.log('firstname cookie exists!');
}
```

Returns `bool`, `true` if exists, `false` if the cookie does not exist.

#### Read cookie and type

The returned cookie value will be a number if the cookie exists (it will still be null if the cookie doesn't exist). Other native functions that convert values are `Boolean` and `Date`, or you can define your own conversion `function`.

```javascript
Cookie.set("age", 34);

var value = Cookie.get("age", Number);

if (typeof (value) === "number") {
  console.log(value); // outputs 34
}
```

Using a custom conversion function:

```javascript
var value = Cookie.get("code", function (stringValue) {
  return parseInt(stringValue, 16); // create a number from a hexadecimal code
});
```

Cookie.remove()
---------------

Delete the cookie named *code*

```javascript
Cookie.remove("code");
```

Delete the cookie named *info* on the *jonlabelle.com* domain

```javascript
Cookie.remove("info", {
  domain: "jonlabelle.com"
});
```

Delete a *secure* cookie

```javascript
Cookie.remove("username", {
  secure: true
});
```

Delete multiple cookies at the same time

```javascript
Cookie.remove("username").remove("ident");
```

Cookie.setSub()
---------------

```javascript
Cookie.setSub("ident", "firstname", "jon");
```

```javascript
Cookie.setSub("ident", "lastname", "labelle");
```

#### Set sub-cookie options

```javascript
Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});
```

```javascript
Cookie.setSub("ident", "firstname", "ace123", {
  secure: true
});
```

#### Set sub-cookie values with an *object*

```javascript
var subCookieData = {
  firstname: "jon",
  lastname: 'labelle',
  age: 34,
  ip: ::1
};
```

```javascript
Cookie.setSubs("ident", subCookieData);
```

NOTE: Calls to `Cookie.setSubs()` will always completely overwrite the cookie.

Cookie.getSubs()
----------------

```javascript
Cookie.getSub("indent", "firstname");
```

Get a sub-cookie value and convert it to `Number` value type.

```javascript
Cookie.getSub("ident", "age", Number);
```

Get sub-cookie data as object

```javascript
var obj = Cookie.getSubs("indent");

if (typeof (obj) === "object") {
  console.log(obj);
}
```

Cookie.removeSub()
------------------

```javascript
// set it...
Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});

// remove it
Cookie.removeSub("ident", "age", {
  domain: "jonlabelle.com"
});
```

Remove all data in sub-cookie

```javascript
Cookie.remove("ident");
```

Cookie.enabled()
----------------

Check if cookies are enabled by the browser.

```javascript
Cookie.enabled();
```

Returns `bool`, `true` if cookies are enabled, `false` if they are disabled.

Feedback
--------

Jon LaBelle
<contact@jonlabelle.com>