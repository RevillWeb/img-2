# Img2
Replace &lt;img /&gt; elements with &lt;img-2&gt;&lt;img-2/&gt; to automatically pre-cache images and improve page performance. Displaying even a small number of high-quality images on a web page can be difficult to do without causing jank or slowing down the initial load of the page. This is why clever developers employ techniques with JavaScript to pre-cache images and lazy load them as they become visible on the user's screen.

Img2 makes this super easy, just swap out your &lt;img /&gt; elements with &lt;img-2&gt;&lt;img-2/&gt; and let it do the work for you.

## Img2 will automatically:

1. Only render initial images which are visible to the user
2. Pre-cache all other images off the main thread with a Web Worker
3. Lazy load images as they enter the user's viewport instantly from the cache
4. Display a blurred preview image while the user waits for initial images

### To Do

1. Add polyfill support
2. Add srcset support
3. Publish to npm
4. Finish README with install instructions, example and API docs
