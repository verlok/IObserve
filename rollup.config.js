import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const terserOptions = {
    compress: {
        passes: 2
    }
};

module.exports = [
    {
        input: "src/iobserve.js",
        output: [
            {
                file: "dist/iobserve.amd.js",
                format: "amd"
            },
            {
                file: "dist/iobserve.amd.min.js",
                format: "amd",
                plugins: [terser(terserOptions)]
            },

            {
                file: "dist/iobserve.iife.js",
                name: "IObserve",
                format: "iife"
            },
            {
                file: "dist/iobserve.iife.min.js",
                name: "IObserve",
                format: "iife",
                plugins: [terser(terserOptions)]
            },
            {
                file: "dist/iobserve.js",
                name: "IObserve",
                format: "umd"
            },
            {
                file: "dist/iobserve.min.js",
                name: "IObserve",
                format: "umd",
                plugins: [terser(terserOptions)]
            }
        ],
        plugins: [
            resolve(),
            babel({
                babelHelpers: "bundled",
                exclude: "node_modules/**"
            })
        ]
    },
    {
        input: "src/iobserve.js",
        output: [
            {
                file: "dist/iobserve.esm.js",
                format: "esm"
            },
            {
                file: "dist/iobserve.esm.min.js",
                format: "esm",
                plugins: [terser(terserOptions)]
            }
        ]
    }
];
