import Queue from "../Queue";
import LimiterFinishedError from '../Errors/LimiterFinishedError';
import { AnyFunction } from '../Types';

/**
 * This class will limit the number of calls you make by calculating the number of calls made in the time-frame provided
 * The point of this class is to make as many calls as possible, clearing the queue as fast as the user is allowed to
 * This is good when you have batches of calls you need to make and you do not want to spread them out
 * For example if you have an api that accepts 60 calls per minute and you have 60 calls to make, there is no need to wait 1 second between
 * each call, you can just exhaust your limits all at once
 */
export class TimeLimiter {
  private timestamps: Queue<number> = Queue.create();
  private requestQueue: Queue<AnyFunction<any, any>> = Queue.create();
  private results: Array<any> = new Array();
  private finished: boolean = false;
  private makingCalls: boolean = false;
  private queueDoneCallback: () => void;
  private timeTook: number = 0;

  /**
   * Setup a rate limiter for making function calls using a time-frame and the number
   * of calls you can make in that time-frame
   * @param numOfCalls Number of calls you can make in time-frame
   * @param milsInterval The time-frame in milliseconds
   */
  constructor(private numOfCalls: number, private milsInterval: number) {}

  /**
   * Create a limiter call and return a promise, the promise will resolve when the queue is done
   * @param funcs An array of functions to pass into the request queue
   * @returns A promise resolving the results of the limiter
   */
  public async make(funcs: Array<AnyFunction<any, any>>): Promise<any> {
    this.requestQueue.bulkEnqueue(funcs);
    // Make all of the calls until the queue is done (generator is finished)
    this.timeTook = Date.now();
    // Return a promise that will resolve when the Limiter is marked as finished and the queue is depleted
    return new Promise(resolve => {
      this.onQueueDone(() => { // Register a callback for when the queue is done
        if (this.isFinished) { // Only resolve if the limiter is marked as
          this.timeTook = Date.now() - this.timeTook;
          resolve({
            milliseconds: this.timeTook,
            results: this.results
          });
        }
      });
      // Begin running through the queue
      this.runThroughQueue();
    });
    // Resolve a promise all, this is good for when you have multiple calls that all depend on each other
  }

  /**
   * Push a function or an array of functions into the call queue of the limiter
   * @param funcs An array of functions or a single function
   */
  public push(...funcs: Array<AnyFunction<any, any>>): void {
    if (this.isFinished) throw new LimiterFinishedError("Cant push more functions to a limiter that is set to finished.");
    this.requestQueue.bulkEnqueue(funcs);
    !this.makingCalls && this.runThroughQueue();
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
    // While the queue is not empty and the first timestamp in the queue is smaller than the time function
    while (!this.timestamps.isEmpty() && this.timestamps.peek() < time) {
      this.timestamps.dequeue();
    }
    return this.timestamps.length < this.numOfCalls;
  }

  /**
   * Mark the Limiter as finished, when the queue is done the results will be resolved
   */
  public finish() {
    this.finished = true;
    if (this.requestQueue.isEmpty && !this.makingCalls) this.queueDoneCallback();
  }

  /**
   * Whether or not the limiter is done accepting calls
   */
  public get isFinished(): boolean {
    return this.finished;
  }

  /**
   * Register a callback for when the is queue done
   * @param call a callback function that fires when the queue is done
   */
  private onQueueDone(call: () => void) {
    this.queueDoneCallback = call;
  }

  /**
   * Call the makeCalls generator and mark the limiter's making calls parameter
   */
  private async runThroughQueue() {
    this.makingCalls = true; // Before calling the generator, make the Limiter as making calls
    for await (const result of this.makeCalls()) {
      this.results.push(result);
    }
    // Reset the making calls parameter
    this.makingCalls = false;
    this.queueDoneCallback(); // Call the queue done callback
  }

  /** 
   * A generator for calling the functions given to the queue
   */
  private async *makeCalls(): any {
    while(!this.requestQueue.isEmpty()) {
      // If can make call outright
      //if (this.requestQueue.length > 0) {
        if (this.canMakeCall()) {
          this.timestamps.enqueue(Date.now());
          yield (this.requestQueue.dequeue()());
          continue;
        }
        // If cant make call, start an interval until time clears
        // This will not wait for functions that are promises them-selves
        yield await new Promise(resolve => {
          setTimeout(() => {
            this.timestamps.enqueue(Date.now());
            const func = this.requestQueue.dequeue();
            const res = func();
            resolve(res);
          }, this.milsUntilNextCall());
        });
    }
  }

  /**
   * Returns the number of milliseconds to wait until you can make another call from the request queue
   * @param timestamp a timestamp to use for comparison, if not passed, Date.now() is used
   * @returns the milliseconds until the next call can be made
   */
  private milsUntilNextCall(timestamp?: number): number {
    // The interval - The difference between the timestamp / Date.now() and the oldest timestamp
    timestamp = timestamp ?? Date.now();
    return this.milsInterval - (timestamp - this.timestamps.peek());
  }
}
