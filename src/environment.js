export const runningOnBrowser = typeof window !== "undefined";

export const supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;