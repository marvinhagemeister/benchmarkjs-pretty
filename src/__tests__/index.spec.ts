import { assert as t } from "chai";
import Benchmark from "../index";

const noop = () => {
  /* noop */
};

describe("Benchmark", () => {
  it("should return Promise", () => {
    return new Benchmark().add("foo", noop).add("bar", noop).run();
  });
});
