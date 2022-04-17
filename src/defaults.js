const defaultSettings = {
    elements: "[data-iobserve]",
    threshold: 0,
    thresholds: null,
    onEnter: null,
    onExit: null
};

export const getExtendedSettings = (customSettings) => {
    return Object.assign({}, defaultSettings, customSettings);
};
