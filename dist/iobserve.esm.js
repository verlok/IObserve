const defaultSettings = {
    elements: "[data-iobserve]",
    threshold: 0,
    thresholds: null,
    onEnter: null,
    onExit: null
};

const getExtendedSettings = (customSettings) => {
    return Object.assign({}, defaultSettings, customSettings);
};

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
    let event;
    const eventString = "IObserve::Initialized";
    const instance = new classObj(options);
    try {
        // Works in modern browsers
        event = new CustomEvent(eventString, { detail: { instance } });
    } catch (err) {
        // Works in Internet Explorer (all versions)
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventString, false, false, { instance });
    }
    window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of iobserve, depending on the 
    options passed in (plain object or an array) */
const autoInitialize = (classObj, options) => {
    if (!options) {
        return;
    }
    if (!options.length) {
        // Plain object
        createInstance(classObj, options);
    } else {
        // Array of objects
        for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
            createInstance(classObj, optionsItem);
        }
    }
};

const runningOnBrowser = typeof window !== "undefined";

const supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

const safeCallback = (callback, arg1, arg2, arg3) => {
	if (!callback) {
		return;
	}

	if (arg3 !== undefined) {
		callback(arg1, arg2, arg3);
		return;
	}
	if (arg2 !== undefined) {
		callback(arg1, arg2);
		return;
	}
	callback(arg1);
};

const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.onEnter, element, entry, instance);
};

const onExit = (element, entry, settings, instance) => {
    safeCallback(settings.onExit, element, entry, instance);
};

const resetObserver = (observer) => {
    observer.disconnect();
};

const isIntersecting = (entry) => entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = (settings) => ({
    root: document,
    rootMargin: settings.thresholds || settings.threshold + "px"
});

const intersectionHandler = (entries, settings, instance) => {
    entries.forEach((entry) =>
        isIntersecting(entry)
            ? onEnter(entry.target, entry, settings, instance)
            : onExit(entry.target, entry, settings, instance)
    );
};

const observeElements = (observer, elements) => {
    elements.forEach((element) => {
        observer.observe(element);
    });
};

const updateObserver = (observer, elementsToObserve) => {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
};

const setObserver = (settings, instance) => {
    if (!supportsIntersectionObserver) {
        return;
    }
    instance._observer = new IntersectionObserver((entries) => {
        intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
};

const toArray = (nodeSet) => Array.prototype.slice.call(nodeSet);

const queryElements = (settings) => document.querySelectorAll(settings.elements);

const getElementsToObserve = (settings) => toArray(queryElements(settings));

const IObserve = function (customSettings, elements) {
    const settings = getExtendedSettings(customSettings);
    this._settings = settings;
    this.loadingCount = 0;
    setObserver(settings, this);
    this.update(elements);
};

IObserve.prototype = {
    update: function () {
        const settings = this._settings;
        const elementsToLoad = getElementsToObserve(settings);

        updateObserver(this._observer, elementsToLoad);
    },

    destroy: function () {
        // Observer
        if (this._observer) {
            this._observer.disconnect();
        }
        // Delete all internal props
        delete this._observer;
        delete this._settings;
    },
};

// Automatic instances creation if required (useful for async script loading)
if (runningOnBrowser) {
    autoInitialize(IObserve, window.iobserveOptions);
}

export { IObserve as default };
