const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'webpack'
];

module.exports = [
  // CommonJS and ES Module builds
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main.replace(/\.js$/, '.cjs'),
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: pkg.module.replace(/\.js$/, '.mjs'),
        format: 'es',
        sourcemap: true
      }
    ],
    external,
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      resolve(),
      commonjs(),
      json()
    ]
  },
  // UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'WebpackSealAnalyzer',
      file: pkg.unpkg,
      format: 'umd',
      sourcemap: true,
      globals: {
        webpack: 'webpack'
      }
    },
    external,
    plugins: [
      typescript({ tsconfig: './tsconfig.json' }),
      resolve(),
      commonjs(),
      json(),
      terser()
    ]
  }
];
