# Changelog

## 2.0.0

- Properly format `ops/sec`
- Breaking change: Allow suites to set a title:

```js
new Benchmark("My Benchmark")
  .add("foo", () => {})
  .run();
```

## 1.0.2

- Fix errors in benchmarks getting swallowed

## 1.0.1

- Fix missing typings when compiling via ts

## 1.0.0

- initial Release
