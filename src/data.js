const dataPrefix = "data-";

export const getData = (element, attribute) => {
    return element.getAttribute(dataPrefix + attribute);
};

export const setData = (element, attribute, value) => {
    var attrName = dataPrefix + attribute;
    if (value === null) {
        element.removeAttribute(attrName);
        return;
    }
    element.setAttribute(attrName, value);
};