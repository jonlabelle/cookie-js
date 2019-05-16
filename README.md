Cookie.js
=========

A tiny (1.24 KB gzipped), stand-alone JavaScript utility for managing cookies in the browser.

## Usage

Add [Cookie.min.js](https://raw.githubusercontent.com/jonlabelle/cookie-js/master/Cookie.min.js) to your HTML document.

```html
<script src="Cookie.min.js"></script>
```

## API

### Cookie.set()

Create a cookie (with no options):

```javascript
Cookie.set('name', 'jon');
```

> NOTE: If the `option.expires` value is not set, the cookie `Expires / Max-Age` is set to *Session*.

Create a cookie with an expiration date:

```javascript
Cookie.set('name', 'jon', {
  expires: new Date('March 18, 2040')
});
```

Create a cookie that expires in 3 days:

```javascript
Cookie.set('name', 'jon', {
  expires: 3
});
```

Create a cookie that can only be accessed by a specific `path` and `domain`:

```javascript
Cookie.set('name', 'jon', {
  path: '/', // all pages
  domain: 'jonlabelle.com' // any subdomain of jonlabelle.com (including www)
});
```

Create a secure cookie:

```javascript
Cookie.set('name', 'jon', {
  secure: true
});
```

> NOTE: Setting the `secure` option to `true` ensures the cookie is always encrypted when transmitting from client to server.

### Cookie.get()

Get a cookie accessible by the current page: 

```javascript
Cookie.get('name');
```

> NOTE: Returns `null` if the cookie does NOT exist.

### Cookie.exists()

Check if a cookie exists:

```javascript
if (Cookie.exists('name')) {
  // do cool stuff here
}
```

> Returns `bool`, `true` if the cookie exists, and `false` if it does not.

### Cookie Value Types

Retrieve a cookie and convert the value to `Number`:

```javascript
Cookie.set('age', 34);

var val = Cookie.get('age', Number);

if (typeof val === 'number') {
  console.log(val); // 34
}
```

Other native functions that convert values are `Boolean` and `Date`, or you can define your own conversion `Function`.

For example, to create a number from a hexadecimal code:

```javascript
var value = Cookie.get('code', function (stringValue) {
  return parseInt(stringValue, 16);
});
```

### Cookie.remove()

Delete a cookie:

```javascript
Cookie.remove('name');
```

Delete a cookie specifying the `domain`:

```javascript
Cookie.remove('info', {
  domain: 'jonlabelle.com'
});
```

### Cookie.setSub()

Sub-cookies allow multiple values to be stored in a single cookie. A sub-cookie looks similar to a URL and takes the following form:

  cookiename=name1=value1&name2=value2&name3=value3

Create a sub-cookie named `person`:

```javascript
Cookie.setSub('person', 'name', 'jon');
Cookie.setSub('person', 'email', 'contact@jonlabelle.com');
Cookie.setSub('person', 'today', (new Date()).toString());
```

Create a sub-cookie with options:

```javascript
Cookie.setSub('person', 'age', 75, { domain: 'jonlabelle.com', secure: true });
```

Create a sub-cookie from an `Object`:

```javascript
var obj = {
  name: 'jon',
  email: 'labelle'
};

Cookie.setSubs('person', obj);
```

> NOTE: Calls to `Cookie.setSubs()` will completely overwrite the cookie.

### Cookie.getSub()

Get a sub-cookie:

```javascript
Cookie.getSub('person', 'name');
```

Get a sub-cookie and convert the value to a `Number`:

```javascript
Cookie.getSub('person', 'age', Number);
```

### Cookie.getSubs()

Get a sub-cookie as a hash `Object`:

```javascript
var obj = Cookie.getSubs('person');

if (typeof obj === 'object') {
  console.log(obj); // => Object { name: 'jon', email: '...'}
}
```

### Cookie.removeSub()

Remove a sub-cookie:

```javascript
Cookie.removeSub('person', 'name');
```

### Cookie.enabled()

Check if cookies are enabled by the browser:

```javascript
Cookie.enabled();
```

> Returns `bool`, `true` if cookies are enabled, and `false` if they are not.

### Cookie.clear()

Clears *all* cookies from the browser:

```javascript
Cookie.clear();
```

## Author

- [Jon LaBelle](mailto:contact@jonlabelle.com)

## License

[MIT License](LICENSE.txt)
