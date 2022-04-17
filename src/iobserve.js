import { getExtendedSettings } from "./defaults";
import { autoInitialize } from "./autoInitialize";
import { load } from "./load";
import { setObserver, updateObserver } from "./intersectionObserver";
import { isBot, runningOnBrowser, supportsIntersectionObserver } from "./environment";
import { shouldUseNative, loadAllNative } from "./native";
import { setOnlineCheck } from "./online";
import { getElementsToLoad, queryElements } from "./dom";
import { resetStatus } from "./data";
import { setToLoadCount } from "./counters";
import { unobserve } from "./unobserve";
import { restore } from "./restore";
import { deleteOriginalAttrs } from "./originalAttributes";

const IObserve = function (customSettings, elements) {
    const settings = getExtendedSettings(customSettings);
    this._settings = settings;
    this.loadingCount = 0;
    setObserver(settings, this);
    setOnlineCheck(settings, this);
    this.update(elements);
};

IObserve.prototype = {
    update: function (givenNodeset) {
        const settings = this._settings;
        const elementsToLoad = getElementsToLoad(givenNodeset, settings);
        setToLoadCount(this, elementsToLoad.length);

        if (isBot || !supportsIntersectionObserver) {
            this.loadAll(elementsToLoad);
            return;
        }
        if (shouldUseNative(settings)) {
            loadAllNative(elementsToLoad, settings, this);
            return;
        }

        updateObserver(this._observer, elementsToLoad);
    },

    destroy: function () {
        // Observer
        if (this._observer) {
            this._observer.disconnect();
        }
        // Clean custom attributes on elements
        queryElements(this._settings).forEach((element) => {
            deleteOriginalAttrs(element);
        });
        // Delete all internal props
        delete this._observer;
        delete this._settings;
        delete this.loadingCount;
        delete this.toLoadCount;
    },

    loadAll: function (elements) {
        const settings = this._settings;
        const elementsToLoad = getElementsToLoad(elements, settings);
        elementsToLoad.forEach((element) => {
            unobserve(element, this);
            load(element, settings, this);
        });
    },

    restoreAll: function() {
        const settings = this._settings;
        queryElements(settings).forEach((element) => {
            restore(element, settings);
        });
    }
};

IObserve.load = (element, customSettings) => {
    const settings = getExtendedSettings(customSettings);
    load(element, settings);
};

IObserve.resetStatus = (element) => {
    resetStatus(element);
};

// Automatic instances creation if required (useful for async script loading)
if (runningOnBrowser) {
    autoInitialize(IObserve, window.iobserveOptions);
}

export default IObserve;
