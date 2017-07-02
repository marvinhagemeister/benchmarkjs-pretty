# Benchmarkjs pretty

This library is a tiny wrapper around the popular [benchmarkjs](https://github.com/bestiejs/benchmark.js)
but with a nicer api. It's always a bit cumbersome to specify the `cycle` and
`complete` functions in each project where benchmarking is done.

## Installation

```bash
# npm
npm install --save-dev benchmarkjs-pretty

# yarn
yarn add --dev benchmarkjs-pretty
```

## Usage

```js
import Benchmark from "benchmarkjs-pretty";

new Benchmark()
  .add("foo", myFunction)
  .add("bar", myOtherFunction)
  .run() // Returns promise
```

## License

MIT, see [LICENSE](LICENSE.md).
