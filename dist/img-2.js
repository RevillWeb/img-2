/**
 * Created by Leon Revill on 10/12/2017.
 * Blog: blog.revillweb.com
 * Twitter: @RevillWeb
 * GitHub: github.com/RevillWeb
 */
class Img2 extends HTMLElement {

    constructor() {
        super();

        // Private class variables
        this._root = null;
        this._$img = null;
        this._$preview = null;
        this._preview = null;
        this._src = null;
        this._width = null;
        this._height = null;
        this._reset();

        // Settings
        this._renderOnPreCached = Img2.settings.RENDER_ON_PRECACHED;

        // Bound class methods
        this._precache = this._precache.bind(this);
        this._onImgLoad = this._onImgLoad.bind(this);
        this._onImgPreCached = this._onImgPreCached.bind(this);
    }

    get loaded() {
        return this._loaded;
    }

    /**
     * Reset all private values
     * @private
     */
    _reset() {
        if (this._loaded === true) this.removeAttribute("loaded");
        this._rendered = false;
        this._loading = false;
        this._loaded = false;
        this._preCaching = false;
        this._preCached = false;
    }

    connectedCallback() {

        if (window.ShadyCSS) ShadyCSS.styleElement(this);
        // Override any global settings
        this._renderOnPreCached = this.getAttribute("render-on-pre-cached") === "true";
        this._init();
    }

    _init() {

        // Check to see if we have a src, if not return and do nothing else
        this._src = this.getAttribute("src");
        // Grab the initial attribute values
        this._preview = this.getAttribute("src-preview");
        this._width = this.getAttribute("width");
        this._height = this.getAttribute("height");

        if (!this._src || !this._width || !this._height) return;

        // Set the height and width of the element so that we can figure out if it is on the screen or not
        this.style.width = `${ this._width }px`;
        this.style.height = `${ this._height }px`;

        // Figure out if this image is within view
        Img2.addIntersectListener(this, () => {
            Img2._removePreCacheListener(this._precache);
            this._render();
            this._load();
            Img2.removeIntersectListener(this);
        });

        // Listen for precache instruction
        Img2._addPreCacheListener(this._precache, this._src);
    }

    /**
     * Method which displays the image once ready to be displayed
     * @private
     */
    _load() {
        if (this._preCached === false) Img2._priorityCount += 1;
        this._$img.onload = this._onImgLoad;
        this._loading = true;
        this._$img.src = this._src;
    }

    _onImgLoad() {
        this._loading = false;
        this._loaded = true;
        if (this._$preview !== null) {
            this._root.removeChild(this._$preview);
            this._$preview = null;
        }
        this._$img.onload = null;
        if (this._preCached === false) Img2._priorityCount -= 1;
        this.setAttribute("loaded", "");
    }

    _onImgPreCached() {
        this._preCaching = false;
        this._preCached = true;
        if (this._renderOnPreCached !== false) {
            this._render();
            this._load();
        }
    }

    static get observedAttributes() {
        return ["src", "width", "height", "alt"];
    }
    attributeChangedCallback(name, oldValue, newValue) {

        // If nothing has changed then just return
        if (newValue === oldValue) return;

        switch (name) {
            case "src":
                // If the src is changed then we need to reset and start again
                this._reset();
                this._init();
                break;
            case "width":
                this._width = newValue;
                if (this._$preview !== null) this._$preview.width = this._width;
                if (this._$img !== null) this._$img.width = this._width;
                this.style.width = `${ this._width }px`;
                break;
            case "height":
                this._height = newValue;
                if (this._$preview !== null) this._$preview.height = this._height;
                if (this._$img !== null) this._$img.height = this._height;
                this.style.height = `${ this._height }px`;
                break;
            case "render-on-pre-cached":
                this._renderOnPreCached = !(newValue === "false");
                break;
            case "alt":
                this._updateAttribute("alt", newValue);
                break;
        }
    }

    /** 
     * Method used to update an individual attribute on the native image element
     * @param {string} name - The name of the attribute to update
     * @param {string} value - The new attribute value
     * @private
    */
    _updateAttribute(name, value) {
        // If the image element hasn't been rendered yet, just return.
        if (this._rendered === false) return;
        this._$img.setAttribute(name, value);
    }

    /**
     * Method which renders the DOM elements and displays any preview image
     * @private
     */
    _render() {

        if (this._rendered === true) return;

        // Render the Shadow Root if not done already (src change can force this method to be called again)
        if (this._root === null) {
            // Attach the Shadow Root to the element
            this._root = this.attachShadow({ mode: "open" });
            // Create the initial template with styles
            let $template = document.createElement("template");
            $template.innerHTML = `
                <style>
                    :host {
                        position: relative;
                        overflow: hidden;
                        display: inline-block;
                        outline: none;
                    }
                    img {
                        position: absolute;
                    }
                    img.img2-src {
                        z-index: 1;
                        opacity: 0;
                    }
                    img.img2-preview {
                        z-index: 2;
                        filter: blur(2vw);
                        transform: scale(1.5);
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                    }
                    :host([loaded]) img.img2-src {
                        opacity: 1;
                    }
                </style>
            `;
            if (window.ShadyCSS) ShadyCSS.prepareTemplate($template, "img-2");
            this._root.appendChild(document.importNode($template.content, true));
        }

        // If a preview image has been specified
        if (this._$preview === null && this._preview !== null && this._loaded === false) {
            // Create the element
            this._$preview = document.createElement("img");
            this._$preview.classList.add("img2-preview");
            this._$preview.src = this._preview;
            // Add the specified width and height
            this._$preview.width = this._width;
            this._$preview.height = this._height;
            // Add it to the Shadow Root
            this._root.appendChild(this._$preview);
        }

        // Render the img element if not done already
        if (this._$img === null) {
            // Create the actual image element to be used to display the image
            this._$img = document.createElement("img");
            this._$img.classList.add("img2-src");
            // add the specified width and height to the image element
            this._$img.width = this._width;
            this._$img.height = this._height;
            const alt = this.getAttribute("alt");
            if (alt !== null) this._$img.setAttribute("alt", alt);
            // Add the image to the Shadow Root
            this._root.appendChild(this._$img);
        }

        // Flag as rendered
        this._rendered = true;
    }

    _precache() {
        this._preCaching = true;
        Img2._preCache(this._src, this._onImgPreCached);
    }

    static _addPreCacheListener(cb, url) {
        Img2._preCacheListeners.set(cb, url);
    }

    static _removePreCacheListener(cb) {
        Img2._preCacheListeners.delete(cb);
    }

    static _startPreCache() {
        for (let cb of Img2._preCacheListeners.keys()) cb();
    }

    /**
     * Methods used to determine when currently visible (priority) elements have finished download to then inform other elements to pre-cache
     */

    static get _priorityCount() {
        return Img2.__priorityCount;
    }
    static set _priorityCount(value) {
        Img2.__priorityCount = value;
        if (Img2.__priorityCount < 1) {
            // Inform components that they can start to pre-cache their images
            // Debounce in case the user scrolls because then there will be more priority images
            if (Img2._startPreCacheDebounce !== null) {
                clearTimeout(Img2._startPreCacheDebounce);
                Img2._startPreCacheDebounce = null;
            }
            Img2._startPreCacheDebounce = setTimeout(function () {
                if (Img2.__priorityCount < 1) Img2._startPreCache();
            }, 500);
        }
    }

    /**
     * Methods used to determine when this element is in the visible viewport
     */


    static addIntersectListener($element, intersectCallback) {
        Img2._intersectListeners.set($element, intersectCallback);
        Img2._observer.observe($element);
    }

    static removeIntersectListener($element) {
        if ($element) Img2._observer.unobserve($element);
    }

    static _handleIntersect(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting === true) {
                const cb = Img2._intersectListeners.get(entry.target);
                if (cb !== undefined) cb(entry);
            }
        });
    }

    static _preCache(url, cb) {

        let slot = Img2._preCacheCallbacks[url];
        if (slot === undefined) {
            Img2._preCacheCallbacks[url] = {
                cached: false,
                cbs: [cb]
            };
            const location = url.indexOf("http") > -1 ? url : window.location.href + url;
            Img2._worker.postMessage({ location: location, url: url });
        } else {
            if (slot.cached === true) {
                cb();
            } else {
                slot.cbs.push(cb);
            }
        }
    }
}

/**
 * Methods used to pre-cache images using a WebWorker
 */

Img2._preCacheListeners = new Map();
Img2.__priorityCount = 0;
Img2._startPreCacheDebounce = null;
Img2._intersectListeners = new Map();
Img2._observer = new IntersectionObserver(Img2._handleIntersect, {
    root: null,
    rootMargin: "0px",
    threshold: 0
});
Img2._preCacheCallbacks = {};
Img2._worker = new Worker(window.URL.createObjectURL(new Blob([`self.onmessage=${ function (e) {
    const xhr = new XMLHttpRequest();
    function onload() {
        self.postMessage(e.data.url);
    }
    xhr.responseType = "blob";
    xhr.onload = xhr.onerror = onload;
    xhr.open("GET", e.data.location, true);
    xhr.send();
}.toString() };`], { type: "text/javascript" })));

Img2._worker.onmessage = function (e) {
    const slot = Img2._preCacheCallbacks[e.data];
    if (slot !== undefined) {
        slot.cached = true;
        slot.cbs = slot.cbs.filter(cb => {
            // Call the callback
            cb();
            // Remove the callback
            return false;
        });
    }
};

/** Img2 Settings **/
Img2.settings = {
    "RENDER_ON_PRECACHED": false // Set this to false to save memory but can cause jank during scrolling
};

window.customElements.define("img-2", Img2);
