"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by Leon Revill on 10/12/2017.
 * Blog: blog.revillweb.com
 * Twitter: @RevillWeb
 * GitHub: github.com/RevillWeb
 */
var Img2 = function (_HTMLElement) {
    _inherits(Img2, _HTMLElement);

    function Img2() {
        _classCallCheck(this, Img2);

        // Private class variables
        var _this = _possibleConstructorReturn(this, (Img2.__proto__ || Object.getPrototypeOf(Img2)).call(this));

        _this._root = null;
        _this._$img = null;
        _this._$preview = null;
        _this._preview = null;
        _this._src = null;
        _this._width = null;
        _this._height = null;
        _this._reset();

        // Settings
        _this._renderOnPreCached = Img2.settings.RENDER_ON_PRECACHED;

        // Bound class methods
        _this._precache = _this._precache.bind(_this);
        _this._onImgLoad = _this._onImgLoad.bind(_this);
        _this._onImgPreCached = _this._onImgPreCached.bind(_this);

        return _this;
    }

    _createClass(Img2, [{
        key: "_reset",


        /**
         * Reset all private values
         * @private
         */
        value: function _reset() {
            if (this._loaded === true) this.removeAttribute("loaded");
            this._rendered = false;
            this._loading = false;
            this._loaded = false;
            this._preCaching = false;
            this._preCached = false;
        }
    }, {
        key: "connectedCallback",
        value: function connectedCallback() {

            if (window.ShadyCSS) ShadyCSS.styleElement(this);
            // Override any global settings
            this._renderOnPreCached = this.getAttribute("render-on-pre-cached") === "true";
            this._init();
        }
    }, {
        key: "_init",
        value: function _init() {
            var _this2 = this;

            // Check to see if we have a src, if not return and do nothing else
            this._src = this.getAttribute("src");
            // Grab the initial attribute values
            this._preview = this.getAttribute("src-preview");
            this._width = this.getAttribute("width");
            this._height = this.getAttribute("height");

            if (!this._src || !this._width || !this._height) return;

            // Set the height and width of the element so that we can figure out if it is on the screen or not
            this.style.width = this._width + "px";
            this.style.height = this._height + "px";

            // Figure out if this image is within view
            Img2.addIntersectListener(this, function () {
                Img2._removePreCacheListener(_this2._precache);
                _this2._render();
                _this2._load();
                Img2.removeIntersectListener(_this2);
            });

            // Listen for precache instruction
            Img2._addPreCacheListener(this._precache, this._src);
        }

        /**
         * Method which displays the image once ready to be displayed
         * @private
         */

    }, {
        key: "_load",
        value: function _load() {
            if (this._preCached === false) Img2._priorityCount += 1;
            this._$img.onload = this._onImgLoad;
            this._loading = true;
            this._$img.src = this._src;
        }
    }, {
        key: "_onImgLoad",
        value: function _onImgLoad() {
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
    }, {
        key: "_onImgPreCached",
        value: function _onImgPreCached() {
            this._preCaching = false;
            this._preCached = true;
            if (this._renderOnPreCached !== false) {
                this._render();
                this._load();
            }
        }
    }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(name, oldValue, newValue) {

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
                    this.style.width = this._width + "px";
                    break;
                case "height":
                    this._height = newValue;
                    if (this._$preview !== null) this._$preview.height = this._height;
                    if (this._$img !== null) this._$img.height = this._height;
                    this.style.height = this._height + "px";
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

    }, {
        key: "_updateAttribute",
        value: function _updateAttribute(name, value) {
            // If the image element hasn't been rendered yet, just return.
            if (this._rendered === false) return;
            this._$img.setAttribute(name, value);
        }

        /**
         * Method which renders the DOM elements and displays any preview image
         * @private
         */

    }, {
        key: "_render",
        value: function _render() {

            if (this._rendered === true) return;

            // Render the Shadow Root if not done already (src change can force this method to be called again)
            if (this._root === null) {
                // Attach the Shadow Root to the element
                this._root = this.attachShadow({ mode: "open" });
                // Create the initial template with styles
                var $template = document.createElement("template");
                $template.innerHTML = "\n                <style>\n                    :host {\n                        position: relative;\n                        overflow: hidden;\n                        display: inline-block;\n                        outline: none;\n                    }\n                    img {\n                        position: absolute;\n                    }\n                    img.img2-src {\n                        z-index: 1;\n                        opacity: 0;\n                    }\n                    img.img2-preview {\n                        z-index: 2;\n                        filter: blur(2vw);\n                        transform: scale(1.5);\n                        width: 100%;\n                        height: 100%;\n                        top: 0;\n                        left: 0;\n                    }\n                    :host([loaded]) img.img2-src {\n                        opacity: 1;\n                    }\n                </style>\n            ";
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
                var alt = this.getAttribute("alt");
                if (alt !== null) this._$img.setAttribute("alt", alt);
                // Add the image to the Shadow Root
                this._root.appendChild(this._$img);
            }

            // Flag as rendered
            this._rendered = true;
        }
    }, {
        key: "_precache",
        value: function _precache() {
            this._preCaching = true;
            Img2._preCache(this._src, this._onImgPreCached);
        }
    }, {
        key: "loaded",
        get: function get() {
            return this._loaded;
        }
    }], [{
        key: "_addPreCacheListener",
        value: function _addPreCacheListener(cb, url) {
            Img2._preCacheListeners.set(cb, url);
        }
    }, {
        key: "_removePreCacheListener",
        value: function _removePreCacheListener(cb) {
            Img2._preCacheListeners.delete(cb);
        }
    }, {
        key: "_startPreCache",
        value: function _startPreCache() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Img2._preCacheListeners.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var cb = _step.value;
                    cb();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }

        /**
         * Methods used to determine when currently visible (priority) elements have finished download to then inform other elements to pre-cache
         */

    }, {
        key: "addIntersectListener",
        value: function addIntersectListener($element, intersectCallback) {
            Img2._intersectListeners.set($element, intersectCallback);
            Img2._observer.observe($element);
        }
    }, {
        key: "removeIntersectListener",
        value: function removeIntersectListener($element) {
            if ($element) Img2._observer.unobserve($element);
        }
    }, {
        key: "_handleIntersect",
        value: function _handleIntersect(entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting === true) {
                    var cb = Img2._intersectListeners.get(entry.target);
                    if (cb !== undefined) cb(entry);
                }
            });
        }
    }, {
        key: "_preCache",
        value: function _preCache(url, cb) {

            var slot = Img2._preCacheCallbacks[url];
            if (slot === undefined) {
                Img2._preCacheCallbacks[url] = {
                    cached: false,
                    cbs: [cb]
                };
                var location = url.indexOf("http") > -1 ? url : window.location.href + url;
                Img2._worker.postMessage({ location: location, url: url });
            } else {
                if (slot.cached === true) {
                    cb();
                } else {
                    slot.cbs.push(cb);
                }
            }
        }
    }, {
        key: "observedAttributes",
        get: function get() {
            return ["src", "width", "height", "alt"];
        }
    }, {
        key: "_priorityCount",
        get: function get() {
            return Img2.__priorityCount;
        },
        set: function set(value) {
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

    }]);

    return Img2;
}(HTMLElement);

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
Img2._worker = new Worker(window.URL.createObjectURL(new Blob(["self.onmessage=" + function (e) {
    var xhr = new XMLHttpRequest();
    function onload() {
        self.postMessage(e.data.url);
    }
    xhr.responseType = "blob";
    xhr.onload = xhr.onerror = onload;
    xhr.open("GET", e.data.location, true);
    xhr.send();
}.toString() + ";"], { type: "text/javascript" })));

Img2._worker.onmessage = function (e) {
    var slot = Img2._preCacheCallbacks[e.data];
    if (slot !== undefined) {
        slot.cached = true;
        slot.cbs = slot.cbs.filter(function (cb) {
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
