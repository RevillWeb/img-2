# Img2
Replace `<img />` elements with `<img-2></img-2>` to automatically pre-cache images and improve page performance. Displaying even a small number of high-quality images on a web page can be difficult to do without causing jank or slowing down the initial load of the page. This is why clever developers employ techniques with JavaScript to pre-cache images and lazy load them as they become visible on the user's screen.

Img2 makes this super easy, just swap out your &lt;img /&gt; elements with &lt;img-2&gt;&lt;img-2/&gt; and let it do the work for you.

## Img2 will automatically:

1. Only render initial images which are visible to the user
2. Pre-cache all other images off the main thread with a Web Worker
3. Lazy load images as they enter the user's viewport instantly from the cache
4. Display a blurred preview image while the user waits for initial images

___

[Live Demo](https://revillweb.github.io/img-2/)

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
        <img-2 src="https://notreal.com/cat_1920x1080.jpf" width="400" height="267" src-preview="https://notreal.com/cat_10x10.jpg" alt="An amazing picture of a cat"></img-2>
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

## Supported platforms

To Do: Add supported platforms.

## Limitations

To Do: Add limitations, IntersectionObserver requirement, etc.

### To Do

1. Fix flickering in Firefox
2. Add srcset support
3. Consider A11y
