var IObserve = (function () {
  'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var defaultSettings = {
    elements: "[data-iobserve]",
    threshold: 0,
    thresholds: null,
    onEnter: null,
    onExit: null
  };
  var getExtendedSettings = function getExtendedSettings(customSettings) {
    return _extends({}, defaultSettings, customSettings);
  };

  /* Creates instance and notifies it through the window element */
  var createInstance = function createInstance(classObj, options) {
    var event;
    var eventString = "IObserve::Initialized";
    var instance = new classObj(options);

    try {
      // Works in modern browsers
      event = new CustomEvent(eventString, {
        detail: {
          instance: instance
        }
      });
    } catch (err) {
      // Works in Internet Explorer (all versions)
      event = document.createEvent("CustomEvent");
      event.initCustomEvent(eventString, false, false, {
        instance: instance
      });
    }

    window.dispatchEvent(event);
  };
  /* Auto initialization of one or more instances of iobserve, depending on the 
      options passed in (plain object or an array) */


  var autoInitialize = function autoInitialize(classObj, options) {
    if (!options) {
      return;
    }

    if (!options.length) {
      // Plain object
      createInstance(classObj, options);
    } else {
      // Array of objects
      for (var i = 0, optionsItem; optionsItem = options[i]; i += 1) {
        createInstance(classObj, optionsItem);
      }
    }
  };

  var runningOnBrowser = typeof window !== "undefined";
  var supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;

  var safeCallback = function safeCallback(callback, arg1, arg2, arg3) {
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

  var onEnter = function onEnter(element, entry, settings, instance) {
    safeCallback(settings.onEnter, element, entry, instance);
  };
  var onExit = function onExit(element, entry, settings, instance) {
    safeCallback(settings.onExit, element, entry, instance);
  };

  var resetObserver = function resetObserver(observer) {
    observer.disconnect();
  };

  var isIntersecting = function isIntersecting(entry) {
    return entry.isIntersecting || entry.intersectionRatio > 0;
  };

  var getObserverSettings = function getObserverSettings(settings) {
    return {
      root: document,
      rootMargin: settings.thresholds || settings.threshold + "px"
    };
  };

  var intersectionHandler = function intersectionHandler(entries, settings, instance) {
    entries.forEach(function (entry) {
      return isIntersecting(entry) ? onEnter(entry.target, entry, settings, instance) : onExit(entry.target, entry, settings, instance);
    });
  };

  var observeElements = function observeElements(observer, elements) {
    elements.forEach(function (element) {
      observer.observe(element);
    });
  };
  var updateObserver = function updateObserver(observer, elementsToObserve) {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
  };
  var setObserver = function setObserver(settings, instance) {
    if (!supportsIntersectionObserver) {
      return;
    }

    instance._observer = new IntersectionObserver(function (entries) {
      intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
  };

  var toArray = function toArray(nodeSet) {
    return Array.prototype.slice.call(nodeSet);
  };
  var queryElements = function queryElements(settings) {
    return document.querySelectorAll(settings.elements);
  };
  var getElementsToObserve = function getElementsToObserve(settings) {
    return toArray(queryElements(settings));
  };

  var IObserve = function IObserve(customSettings, elements) {
    var settings = getExtendedSettings(customSettings);
    this._settings = settings;
    this.loadingCount = 0;
    setObserver(settings, this);
    this.update(elements);
  };

  IObserve.prototype = {
    update: function update() {
      var settings = this._settings;
      var elementsToLoad = getElementsToObserve(settings);
      updateObserver(this._observer, elementsToLoad);
    },
    destroy: function destroy() {
      // Observer
      if (this._observer) {
        this._observer.disconnect();
      } // Delete all internal props


      delete this._observer;
      delete this._settings;
    }
  }; // Automatic instances creation if required (useful for async script loading)

  if (runningOnBrowser) {
    autoInitialize(IObserve, window.iobserveOptions);
  }

  return IObserve;

})();
