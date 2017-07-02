import * as chalk from "chalk";
import { Suite } from "benchmark";

export interface Logger {
  complete(fastest: string): void;
  cycle(name: string, ops: number, delta: number, runs: number): void;
}

export function SimpleLogger(log = console.log): Logger {
  return {
    complete(fastest: string) {
      log(`\nFastest is ${chalk.green(fastest)}\n`);
    },
    cycle(name: string, ops: number, delta: number, runs: number) {
      const opsDisplay = chalk.yellow(new Intl.NumberFormat().format(ops));
      const deltaDisplay = delta.toFixed(2);
      const gray = chalk.gray;

      log(
        `${name} ${gray("x")} ${opsDisplay} ${gray(
          "ops/sec",
        )} ±${deltaDisplay} ${gray("(" + runs + " runs sampled)")}`,
      );
    },
  };
}

export default class Benchmark {
  constructor(
    private logger: Logger = SimpleLogger(),
    private suite: Suite = new Suite(),
  ) {
    this.suite.on("cycle", (event: any) => {
      const bench = event.target;
      this.logger.cycle(
        bench.name,
        bench.hz,
        bench.stats.rme,
        bench.stats.sample.length,
      );
    });
  }

  add(name: string, fn: () => any) {
    this.suite.add(name, fn);
    return this;
  }

  run(): Promise<void> {
    return new Promise(resolve => {
      const self = this;
      this.suite.on("complete", function(this: any) {
        const winner = this.filter("fastest").map("name");
        self.logger.complete(winner);
        resolve();
      });
      this.suite.run({ async: true });
    });
  }
}
