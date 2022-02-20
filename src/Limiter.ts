import Queue from "./Queue";
type AnyFunction = (...args: any) => any;

export enum LimiterMode {
  Clear,
  Spread
}

export class Limiter {
  private timestamps: Queue<number> = Queue.create();
  private requestQueue: Queue<(...args: any) => any> = Queue.create();

  /**
   * Setup a rate limiter for making function calls using a time-frame and the number
   * of calls you can make in that time-frame
   * @param numOfCalls Number of calls you can make in time-frame
   * @param milsInterval The time-frame in milliseconds
   */
  constructor(private numOfCalls: number, private milsInterval: number, mode: LimiterMode = LimiterMode.Clear) {}

  public async call(funcs: Array<AnyFunction>): Promise<Array<any>> {
    this.requestQueue.bulkEnqueue(funcs);
    // The results array
    const results: Array<any> = new Array();
    // Make all of the calls until the queue is done (generator is finished)
    for await (const result of this.makeCalls()) {
      results.push(result);
    }
    // Resolve a promise all, this is good for when you have multiple calls that all depend on each other
    return Promise.all(results);
  }

  public push(funcs: Array<AnyFunction> | AnyFunction): void {
    if (funcs instanceof Array) {
      this.requestQueue.bulkEnqueue(funcs);
    } else {
      this.requestQueue.enqueue(funcs);
    }
  }

  /** 
   * A generator for calling the functions given to the queue
   */
  private async *makeCalls(): any {
    while(this.requestQueue.length > 0) {
      // If can make call outright
      if (this.canMakeCall()) {
        this.timestamps.enqueue(Date.now());
        yield (this.requestQueue.dequeue()());
        continue;
      }
      // If cant make call, start an interval until time clears
      // This will not wait for functions that are promises them-selves
      yield await new Promise(resolve => {
        window.setTimeout(() => {
          this.timestamps.enqueue(Date.now());
          const res = (this.requestQueue.dequeue())();
          resolve(res);
        }, this.milsUntilNextCall());
      });
    }
  }

  /**
   * Returns wether or not you can make a call, if nothing is passed, Date.now() will be used to calculate (preferred)
   * @param timestamp a timestamp for when you want to calculate ahead of time
   * @returns whether or not you can make a call for the timestamp or the Date.now() value
   */
  public canMakeCall(timestamp?: number): boolean {
    // Deals with permissions up to the number of calls
    if (this.timestamps.length < this.numOfCalls) return true;
    // If the timestamp or time now - the mils interval is greater than the first call in the queue, you can make a call
    const time = timestamp ?? Date.now() - this.milsInterval;
    let removed = 0;
    while (this.timestamps.length > 0 && this.timestamps.peek() < time) {
      removed++;
      this.timestamps.dequeue();
    }
    // console.log("removed", removed);
    return this.timestamps.length < this.numOfCalls;
  }

  private milsUntilNextCall(timestamp?: number): number {
    // The interval - The difference between the timestamp / Date.now() and the oldest timestamp
    console.log("To wait", (this.milsInterval - ((timestamp ?? Date.now()) - this.timestamps.peek())));
    return this.milsInterval - ((timestamp ?? Date.now()) - this.timestamps.peek());
  }
}
