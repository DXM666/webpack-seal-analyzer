const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');
const cleanup = require('rollup-plugin-cleanup');

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    'webpack',
];

module.exports = [
    // CommonJS and ES Module builds
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: false,
                exports: 'auto',
                interop: 'auto',
            },
            {
                file: pkg.module,
                format: 'es',
                sourcemap: false,
            },
        ],
        external,
        plugins: [
            typescript({ 
                tsconfig: './tsconfig.json',
                sourceMap: false,
            }), 
            resolve(), 
            commonjs(), 
            json(),
            cleanup(),
        ],
    },
    // UMD build
    {
        input: 'src/index.ts',
        output: {
            name: 'WebpackSealAnalyzer',
            file: pkg.unpkg,
            format: 'umd',
            sourcemap: false,
            globals: {
                webpack: 'webpack',
            },
        },
        external,
        plugins: [
            typescript({ 
                tsconfig: './tsconfig.json',
                sourceMap: false,
            }),
            resolve(),
            commonjs(),
            json(),
            cleanup(),
        ],
    },
];
