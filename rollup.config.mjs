import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from 'rollup-plugin-javascript-obfuscator';
const { javascriptObfuscator } = pkg;

const isProduction = process.env.NODE_ENV === 'production';
const shouldMinify = process.env.ROLLUP_MINIFY === 'true';
const shouldObfuscate = process.env.OBFUSCATE === 'true';

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './dist',
  }),
];

if (shouldMinify) {
  plugins.push(terser());
}

if (shouldObfuscate) {
  plugins.push(
    javascriptObfuscator({
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      debugProtectionInterval: 0,
      disableConsoleOutput: false,
      identifierNamesGenerator: 'hexadecimal',
      log: false,
      numbersToExpressions: false,
      renameGlobals: false,
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: false,
      stringArrayCallsTransformThreshold: 0.75,
      stringArrayEncoding: [],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: 'variable',
      stringArrayThreshold: 0.75,
      transformObjectKeys: false,
      unicodeEscapeSequence: false,
    }),
  );
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: !isProduction,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: !isProduction,
      },
    ],
    plugins,
    external: [],
  },
];
