IObserve is a lightweight script that allows you to easily use browsers' `IntersectionObserver` API

[![iobserve (latest)](https://img.shields.io/npm/v/iobserve/latest.svg)](https://www.npmjs.com/package/iobserve)
[![iobserve (downloads)](https://img.shields.io/npm/dy/iobserve.svg)](https://www.npmjs.com/package/iobserve)
[![](https://data.jsdelivr.com/v1/package/npm/iobserve/badge)](https://www.jsdelivr.com/package/npm/iobserve)

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Getting started

In order to use IObserve, you shall markup your observed elements like this

```html
<div class="iobserve">...</div>
```

Then, in your javascript code:

```js
const onEnter: (el) => {
  console.log(el, "entered the viewport");
  // do something with it
}

const iobserveInstance = new IObserve({
  // Your custom settings go here
  onEnter: onEnter
});
```

## Install from npm

To install IObserve locally with `npm`:

```
npm install iobserve
```

## Inclusion from a CDN

To include IObserve from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/iobserve@0.0.1/dist/iobserve.min.js"></script>
```

To be sure that the DOM for your lazy content is ready when you instantiate IObserve, **place the script tag right before the closing `</body>` tag**. 

If more DOM elements are added at a later stage, you'll need to call `iobserveInstance.update();` to make IObserve check for new elements in the DOM.

```js
iobserveInstance.update();
```

### Using an `async` script

If you prefer, it's possible to include IObserve's script using `async` script and initialize it as soon as it's loaded.

To do so, **you must define the options before including the script**. You can pass:

- `{}` an object to get a single instance of IObserve
- `[{}, {}]` an array of objects to get multiple instances of IObserve, each one with different options.

```html
<script>
  // Set the options globally
  // to make IObserve self-initialize
  window.iobserveOptions = {
    // Your custom settings go here
  };
</script>
```

Then include the script.

```html
<script async src="https://cdn.jsdelivr.net/npm/iobserve@0.0.1/dist/iobserve.min.js"></script>
```

**Possibly place the script tag right before the closing `</body>` tag**. If you can't do that, IObserve could be executed before the browser has loaded all the DOM, and you'll need to call its `update()` method to make it check the DOM again.

### Using an `async` script + getting the instance reference

Same as above, but you must put the `addEventListener` code shown below before including the `async` script.

```html
<script>
  // Set the options globally
  // to make IObserve self-initialize
  window.iobserveOptions = {
    // Your custom settings go here
  };
  // Listen to the initialization event
  // and get the instance of IObserve
  window.addEventListener(
    "IObserve::Initialized",
    function (event) {
      window.iobserveInstance = event.detail.instance;
    },
    false
  );
</script>
```

Then include the script.

```html
<script async src="https://cdn.jsdelivr.net/npm/iobserve@0.0.1/dist/iobserve.min.js"></script>
```

Now you'll be able to call its methods, like:

```js
iobserveInstance.update();
```

## Bundles

You can find and use different bundles.

| Filename               | Module Type                                                   | Advantages                                                                                                                                 |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `iobserve.min.js`      | UMD <small>(Universal Module Definition)</small>              | Works pretty much everywhere, even in common-js contexts                                                                                   |
| `iobserve.iife.min.js` | IIFE <small>(Immediately Invoked Function Expression)</small> | Works as in-page `<script src="...">`, ~0.5kb smaller than UMD version                                                                     |
| `iobserve.amd.min.js`  | AMD <small>(Asynchronous Module Definition)</small>           | Works with _RequireJS_ module loader, ~0.5kb smaller than UMD version                                                                      |
| `iobserve.esm.js`      | ES Module                                                     | Exports `IObserve` so you can import it in your project both using `<script type="module" src="...">` and a bundler like WebPack or Rollup |

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## 🔌 API

### Constructor arguments

The `new IObserve()` instruction you execute on your page can take two parameters:

| Parameter | What to pass                                    | Required | Default value | Type         |
| --------- | ----------------------------------------------- | -------- | ------------- | ------------ |
| Options   | The option object for this instance of IObserve | No       | `{}`          | Plain Object |

The most common usage of IObserve constructor is to pass only the options object (see "options" in the next section). For example:

```js
var aIObserve = new IObserve({
  /* options here */
});
```

### Options

For every instance of _IObserve_ you can pass in some options, to alter its default behaviour.
Here's the list of the options.

| Name               | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Default value  | Example value                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | -------------------------------------- |
| `elements`         | The CSS selector of the elements to load lazily.                                                                                                                                                                                                                                                                                                                                                                                                             | `".iobserve"` | `".somethingElse"`                     |
| `threshold`        | A number of pixels representing the outer distance off the scrolling area from which to start loading the elements.                                                                                                                                                                                                                                                                                                                                          | `0`            | `500`                                  |
| `thresholds`       | Similar to `threshold`, but accepting multiple values and both `px` and `%` units. It maps directly to the `rootMargin` property of IntersectionObserver ([read more](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin)), so it must be a string with a syntax similar to the CSS `margin` property. You can use it when you need to have different thresholds for the scrolling area. It overrides `threshold` when passed. | `null`         | `"500px 10%"`                          |
| `onEnter`          | A callback function which is called whenever an element enters the viewport. Arguments: DOM element, intersection observer entry, iobserve instance.                                                                                                                                                                                                                                                                                                         | `null`         | `(el)=>{console.log("Entered", el)}`   |
| `onExit`           | A callback function which is called whenever an element exits the viewport. Arguments: DOM element, intersection observer entry, iobserve instance.                                                                                                                                                                                                                                                                                                          | `null`         | `(el)=>{console.log("Exited", el)}`    |

### Methods

**Instance methods**

You can call the following methods on any instance of IObserve.

| Method name    | Effect                                                                                                                                                           | Use case                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `update()`     | Make IObserve to re-check the DOM for `elements` elements in the page.                                                                       | Update IObserve after you added or removed DOM elements to the page.              |
| `destroy()`    | Destroys the instance, unsetting instance variables and removing listeners.                                                                                      | Free up some memory. Especially useful for Single Page Applications.              |

---

**Love this project? 😍 [Buy me a coffee!](https://ko-fi.com/verlok)**

---

## Tested on real browsers

Legacy browsers support is from IE 9 up. This script is tested in every browser before every release using [BrowserStack](http://browserstack.com/) live, thanks to the BrowserStack Open Source initiative.

<a href="http://browserstack.com/"><img alt="BrowserStack Logo" src="./img/browserstack-logo-600x315.png"  width="300" height="158"/></a>
