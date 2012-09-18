Cookie.js
=================

Manage all your cookies and sub-cookies with Cookie.js. Cookie.js is a stand-alone script and does NOT require additional libraries (jQuery, YUI, etc.) to operate.


Usage
-----

`<script type="text/javascript" src="Cookie.min.js"></script>`


Creating cookies
----------------

### Create a cookie with default options

`Cookie.set("firstname", "jon");`

Adds a cookie named *firstname* with a value of *jon*, that expires when the session ends.

### Set the expires option

`Cookie.set("firstname", "jon", {
  expires: new Date("March 18, 2040")
});`

`Cookie.set("firstname", "jon", { 
  expires: 30 // expires in 30-days
});`

The `expires` option can be a `Date` or a `Number` value.

### Set the path and domain options

`Cookie.set("firstname", "jon", {
  path: "/",
  domain: ".jonlabelle.com"
});`

### Set the secure option

`Cookie.set("secure_name", "jon", {
  secure: true
});`

Setting the `secure` option to `true` ensures the cookie is always encrypted when transmitting from client to server.


Reading cookies
---------------

`Cookie.get("firstname");`

Returns `null` if the cookie does NOT exist.

### Cookie exists

`if (Cookie.exists("firstname")) {
  console.log('firstname cookie exists!');
}`

Returns `bool`, `true` if exists, `false` if the cookie does not exist.

### Read cookie and type
 
The returned cookie value will be a number if the cookie exists (it will still be null if the cookie doesn't exist). Other native functions that convert values are Boolean() and Date, or you can define your own conversion `function`.

`var value = Cookie.get("age", Number);`

`console.log(value); // outputs 34 `

Custom conversion function:

`var value = Cookie.get("code", function (stringValue) {
  return parseInt(stringValue, 16); // create a number from a hexadecimal code
});`


Deleting cookies
----------------

### Delete the cookie named *code*.

`Cookie.remove("code");`

### Delete the cookie named *info* on the *jonlabelle.com* domain

`Cookie.remove("info", {
  domain: "jonlabelle.com"
});`

### Delete the secure cookie named *username*

`Cookie.remove("username", {
  secure: true
});`

### Delete multiple cookies at the same time

`Cookie.remove("username").remove("ident");`


Creating sub-cookies
--------------------

`Cookie.setSub("ident", "firstname", "jon");`

`Cookie.setSub("ident", "lastname", "labelle");`
 
### Setting sub-cookie options

`Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});`

`Cookie.setSub("ident", "firstname", "ace123", {
  secure: true
});`

### Setting sub-cookie options with an object

`var subCookieData = {
  firstname: "jon",
  lastname: 'labelle',
  age: 34,
  ip: ::1
};`

`Cookie.setSubs("ident", subCookieData);`

*IMPORTANT*: Calls to `setSubs()` will always completely overwrite the cookie.


Reading sub-cookies
-------------------

`var fname = Cookie.getSub("indent", "firstname");`

### Get a sub-cookie and convert to number

`var nValue = Cookie.getSub("ident", "age", Number);`

### Get all sub-cookie data

`var subCookieData = Cookie.getSubs("indent");`

`var subCookieDataVal = subCookieData.subname;`


Deleting sub-cookies
--------------------

`Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});`

`Cookie.removeSub("ident", "age", {
  domain: "jonlabelle.com"
});`

### Remove all data in sub-cookie

`Cookie.remove("ident");`


Cookie support
--------------

### Check if cookies are enabled by the browser.

`Cookie.enabled();`

Returns `bool`, `true` if cookies are enabled, `false` if they are disabled.


Feedback
--------

[Jon LaBelle](http://jonlabelle.com)