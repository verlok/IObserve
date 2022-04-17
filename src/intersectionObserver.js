import { supportsIntersectionObserver } from "./environment";
import { onEnter, onExit } from "./intersectionHandlers";
import { resetObserver } from "./unobserve";

export const isIntersecting = (entry) => entry.isIntersecting || entry.intersectionRatio > 0;

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

export const observeElements = (observer, elements) => {
    elements.forEach((element) => {
        observer.observe(element);
    });
};

export const updateObserver = (observer, elementsToObserve) => {
    resetObserver(observer);
    observeElements(observer, elementsToObserve);
};

export const setObserver = (settings, instance) => {
    if (!supportsIntersectionObserver) {
        return;
    }
    instance._observer = new IntersectionObserver((entries) => {
        intersectionHandler(entries, settings, instance);
    }, getObserverSettings(settings));
};
