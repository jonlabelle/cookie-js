# Cookie.js #

Manage all your cookies and sub-cookies with Cookie.js. Cookie.js is a stand-alone script and does NOT require additional libraries (jQuery, YUI, etc.) to operate.

Cookie.js is a modified and decoupled version of YUI's cookie management utility. Visit the [YUI developer network](http://developer.yahoo.com/yui) for more info.

*3 KB minified!*

---------------------------------------

## Usage ##

`<script type="text/javascript" src="js/Cookie.min.js"></script>`

---------------------------------------

## Examples ##

### Creating cookies ###

#### Add a cookie with no options (default) ####

Create a cookie named *firstname* with a value of *jon*.

`Cookie.set("firstname", "jon");`

With no `Cookie` options specified, it will expire when the session ends.

#### Setting the expiration option ####

The `expires` option can be a `Date` object or a `Number`.

Set the cookie named *firstname* to expire on a specified `Date`.

`Cookie.set("firstname", "jon", {
  expires: new Date("March 18, 2040")
});`

Set the cookie named *firstname* to expire in 30-days.

`Cookie.set("firstname", "jon", {
  expires: 30
});`

#### Setting access options ####

The cookie named *firstname* is accessible for all pages under the *jonlabelle.com* domain.

`Cookie.set("firstname", "jon", {
  path: "/",
  domain: ".jonlabelle.com"
});`

#### Creating a secure cookie (https) ####

The cookie named *secure_name* is only accessible via *https*.

`Cookie.set("secure_name", "jon", {
  secure: true
});`

---------------------------------------

### Reading cookies ###

Returns `null` if the cookie does NOT exist.

`Cookie.set("firstname", "jon");`

`var value = Cookie.get("firstname");`

`if (value) {
  console.log(value); // outputs jon
}`

#### Read cookie and type ####
 
The returned cookie value will be a number if the cookie exists (it will still be null if the cookie doesn't exist). Other native functions that convert values are Boolean() and Date, or you can define your own conversion `function`.

`var value = Cookie.get("age", Number);`

`console.log(value); // outputs 34 `

Custom conversion function:

`var value = Cookie.get("code", function (stringValue) {
  return parseInt(stringValue, 16); // create a number from a hexadecimal code
});`

#### Check if cookie exists ####

`if (Cookie.exists("firstname")) {
  console.log('firstname cookie exists!');
}`

Returns `bool`, `true` if exists, `false` if the cookie does not exist.

---------------------------------------

### Deleting cookies ###

Delete the cookie named *code*.

`Cookie.remove("code");`

#### Delete the cookie named *info* on the *jonlabelle.com* domain ####

`Cookie.remove("info", {
  domain: "jonlabelle.com"
});`

#### Delete a secure cookie named *username* ####

`Cookie.remove("username", {
  secure: true
});`

---------------------------------------

### Creating sub-cookies ###
 
Set a cookie named *ident* with a sub-cookie named *firstname*, whose value is *jon*.

`Cookie.setSub("ident", "firstname", "jon");`

Set another sub-cookie on *ident*, with a name of *lastname* and a value of *labelle*.

`Cookie.setSub("ident", "lastname", "labelle");`
 
#### Set a sub-cookie domain option ####

`Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});`

#### Setting a sub-cookie as secure ####

`Cookie.setSub("ident", "firstname", "ace123", {
  secure: true
});`

#### Setting sub-cookie with Object ####

`var subCookieData = {
  firstname: "jon",
  lastname: 'labelle',
  age: 34,
  ip: ::1
};`

`Cookie.setSubs("ident", subCookieData);`

*IMPORTANT*: Calls to `setSubs()` will always completely overwrite the cookie.

---------------------------------------

### Getting sub-cookies ###

#### Get a sub-cookie ####

`var fname = Cookie.getSub("indent", "firstname");`

#### Get a sub-cookie and convert to number ####

`var nValue = Cookie.getSub("ident", "age", Number);`

#### Get all sub-cookie data ####

`var subCookieData = Cookie.getSubs("indent");`

`var subCookieDataVal = subCookieData.subname;`

---------------------------------------

### Removing sub-cookies ###

`Cookie.setSub("ident", "age", 22, {
  domain: "jonlabelle.com"
});`

`Cookie.removeSub("ident", "age", {
  domain: "jonlabelle.com"
});`

#### Remove all data in sub-cookie ####

`Cookie.remove("ident");`

---------------------------------------

### Enabled ###

Check if cookies are enabled by the browser.

`Cookie.enabled();`

Returns `bool`, `true` if cookies are enabled, `false` if they are disabled.

---------------------------------------

## Feedback ##

[Jon LaBelle](http://jonlabelle.com)