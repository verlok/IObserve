import { getExtendedSettings } from "./defaults";
import { autoInitialize } from "./autoInitialize";
import { setObserver, updateObserver } from "./intersectionObserver";
import { runningOnBrowser } from "./environment";
import { getElementsToObserve as getElementsToObserve } from "./dom";

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

export default IObserve;
