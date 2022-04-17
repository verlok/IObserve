import { safeCallback } from "./callback";

export const onEnter = (element, entry, settings, instance) => {
    safeCallback(settings.onEnter, element, entry, instance);
};

export const onExit = (element, entry, settings, instance) => {
    safeCallback(settings.onExit, element, entry, instance);
};
