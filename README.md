# Img2
Replace `<img />` elements with `<img-2></img-2>` to automatically pre-cache images and improve page performance. Displaying even a small number of high-quality images on a web page can be difficult to do without causing jank or slowing down the initial load of the page. This is why clever developers employ techniques with JavaScript to pre-cache images and lazy load them as they become visible on the user's screen.

Img2 makes this super easy, just swap out your `<img />` elements with `<img-2></img-2>` and let it do the work for you.

## Img2 will automatically:

1. Only render initial images which are visible to the user
2. Pre-cache all other images off the main thread with a Web Worker
3. Lazy load images as they enter the user's viewport instantly from the cache
4. Display a blurred preview image while the user waits for initial images

___

[Live Demo](https://revillweb.github.io/img-2)

___

## Install 

`npm install --save img-2`

## Usage

You can include Img2 into your project in various ways:

### As a ES6 Module

`import "Img2"`

### Via `<script>` as ES6

`<script src="dist/img-2.js"></script>`

### Via `<script>` as ES5

`<script src="dist/img-2.es5.js"></script>`

Then you simply use the `<img-2></img-2>` element in place of an `<img />` element.

```
    <body>
        <h1>Cat Photos</h1>
        <img-2 src="https://notreal.com/cat_1920x1080.jpg" width="400" height="267" src-preview="https://notreal.com/cat_10x10.jpg" alt="An amazing picture of a cat"></img-2>
    </body>
```

### Attributes

There are currently five attributes available on Img2, three of which are required.

#### src

The full-size source image to be pre-cached and lazy loaded.

#### width & height

Both of these are required to figure out the position of the image on screen to then determine if the image should be loaded right away or lazily loaded.

#### src-preview

A really small representation of the full-size image (e.g. 10px by 10px). This image will be displayed as a blurred preview while the full-size image is downloading if the image hasn't already been pre-cached.

#### alt

The alt text for the image, just maps on to the `alt` attribute of the `<img />` element used in the component.

## Supported platforms & 

| Platform Support   | Chrome | Chrome for Android | Firefox | Safari | iOS Safari | Edge | IE 11 |
| ------------------ |:------:|:------:|:------:|:------:|:------:|:----:|:-----:|
| Supported          |✓|✓|✓|✓|✓|✓|✓|✓|
| Polyfill(s) Required |-|-|✓|✓|✓|✓|✓|✓|

Img-2 uses the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when an image is in the users visible viewport. For Safari and IE 11 you'll need to load the Intersection Observer polyfill.

```
<script src="https://polyfill.io/v2/polyfill.min.js?features=IntersectionObserver"></script>
```

Img-2 uses Custom Elements and Shadow DOM so for FireFox, Edge and IE11 you'll need to use the webcomponents-loader from [webcomponentsjs](https://github.com/webcomponents/webcomponentsjs).

```
<script src="bower_components/webcomponentsjs/webcomponents-loader.js"></script>
```

If you need to support IE11 which doesn't support ES6 you'll want to conditionally load `img-2.es5.js`.

```
var supportsES6 = function() {
    try {
        new Function("(a = 0) => a");
        return true;
    }
    catch (err) {
        return false;
    }
}();
var $script = document.createElement("script");
$script.setAttribute("defer", "");
$script.src = (supportsES6 === true) ? "dist/img-2.js" : "dist/img-2.es5.js";
document.head.appendChild($script);
```

Take a look at `index.html` in the root of this repo for further examples.

### Contributing

Any contributions are welcome, feel free to submit a pull request for review.

### To Do

1. Add srcset support
2. Consider A11y
