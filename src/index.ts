import * as kolor from "kolorist";
import { Suite } from "benchmark";

export interface Logger {
  start(name: string): void;
  complete(fastest: string): void;
  cycle(name: string, ops: number, delta: number, runs: number): void;
}

export function SimpleLogger(log = console.log): Logger {
  return {
    start(name: string) {
      log(kolor.underline(name + ":"));
    },
    complete(fastest: string) {
      log(`\nFastest is ${kolor.green(fastest)}\n`);
    },
    cycle(name: string, ops: number, delta: number, runs: number) {
      const opsDisplay = kolor.yellow(
        new Intl.NumberFormat("en", {
          maximumFractionDigits: 3,
          useGrouping: true,
        }).format(ops),
      );

      const deltaDisplay = delta.toFixed(2);

      log(
        `${name} ${kolor.dim("x")} ${opsDisplay} ${kolor.dim(
          "ops/sec",
        )} ±${deltaDisplay} ${kolor.dim("(" + runs + " runs sampled)")}`,
      );
    },
  };
}

export default class Benchmark {
  private hasErrored: boolean = false;

  constructor(
    public name: string = "",
    private logger: Logger = SimpleLogger(),
    private suite: Suite = new Suite(),
  ) {
    if (this.name !== "") {
      this.suite.on("start", () => {
        this.logger.start(this.name);
      });
    }

    this.suite.on("cycle", (event: any) => {
      if (this.hasErrored) {
        return;
      }

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
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line no-this-assignment
      const self = this;
      this.suite.on("complete", function (this: any) {
        if (self.hasErrored) {
          return;
        }
        const winner = this.filter("fastest").map("name");
        self.logger.complete(winner);
        resolve();
      });
      this.suite.on("error", (event: any) => {
        self.hasErrored = true;
        reject(event.target.error);
      });
      this.suite.run({ async: true });
    });
  }
}
