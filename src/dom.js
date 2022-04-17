export const toArray = (nodeSet) => Array.prototype.slice.call(nodeSet);

export const queryElements = (settings) => document.querySelectorAll(settings.elements);

export const getElementsToObserve = (settings) => toArray(queryElements(settings));
