import { assert as t } from "chai";
import Benchmark from "../index";

const noop = () => {
  /* noop */
};

describe("Benchmark", () => {
  it("should return Promise", async () => {
    await new Benchmark("My Benchmark")
      .add("foo", noop)
      .add("bar", noop)
      .run();
  });

  it("should catch error", async () => {
    try {
      await new Benchmark()
        .add("foo", () => {
          throw new Error("foo");
        })
        .run();
      t.fail();
    } catch (err) {
      /* noop */
    }
  });
});
