import ManagedLimiterModeError from "../Errors/ManagedLimiterModeError";
import Queue from "../Queue";
import { AnyFunction } from '../Types';

/**
 * A call limiter controlled by the user of the class
 */
export class ManagedLimiter<FuncsT> {

  /**
   * Holds the queue of calls the user is preparing
   */
  private callQueue: Queue<AnyFunction<any, FuncsT | Promise<FuncsT>>> = Queue.create();

  /**
   * The entry point for the synchronous ManagedLimiter, all functions will be executed and their value will be returned
   * @param funcs An array of functions
   * @returns A ManagedLimiter
   */
  public static makeSync<FuncsT>(funcs: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>> = []): ManagedLimiter<FuncsT> {
    return new ManagedLimiter(funcs, false);
  }

  /**
   * The entry point for the asynchronous ManagedLimiter, all promises will be returned as a promise
   * @param promises An array of promises to pre-populate the queue with
   * @returns A ManagedLimiter
   */
  public static makeAsync<FuncsT>(promises: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>> = []): ManagedLimiter<FuncsT> {
    return new ManagedLimiter(promises, true);
  }

  /**
   * Create a new instance of the class and return it to the user
   * @param funcs What to pre-populate the queue with
   * @param async Whether or not the class is asynchronous
   */
  protected constructor(funcs: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>, private async?: boolean) {
    this.callQueue.bulkEnqueue(funcs);
  }

  /**
   * Calls the next function in the queue and returns its value
   * @returns The value of the function from the queue, with the return type as indicated by the user
   */
  public next(): FuncsT {
    if (this.async) throw new ManagedLimiterModeError('Cant call next on a asynchronous limiter, use asyncNext() instead.');
    if (this.isEmpty()) return;
    return (this.callQueue.dequeue() as AnyFunction<any, FuncsT>)();
  }

  /**
   * Runs through the queue using a generator, for when you want to loop through the values
   */
  public *genNext(): Generator<FuncsT, any, any> {
    while (!this.isEmpty()) {
      yield (this.callQueue.dequeue() as AnyFunction<any, FuncsT>)();
    }
  }

  /**
   * Calls the next function asynchronously
   * @returns The promise given by the user
   */
  public async asyncNext(): Promise<FuncsT> {
    if (!this.async) throw new ManagedLimiterModeError('Cant call next on a synchronous limiter, use next() instead.');
    if (this.isEmpty()) return;
    return (this.callQueue.dequeue() as AnyFunction<any, Promise<FuncsT>>)();
  }

  /**
   * Runs through the promises using a generator, for when you want to loop through all of the promises
   */
  public async *genAsyncNext(): AsyncGenerator<FuncsT, any, any> {
    while (!this.isEmpty()) {
      yield (this.callQueue.dequeue() as AnyFunction<any, Promise<FuncsT>>)();
    }
  }

  /**
   * Add additional promises or functions to the call queue
   * @param funcs An array of functions or promises
   */
  public push(...funcs: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>): void {
    this.callQueue.bulkEnqueue(funcs);
  }

  /**
   * Returns the size of the queue at this point in time
   * @returns size of the queue
   */
  public size(): number {
    return this.callQueue.length;
  }

  /**
   * Returns true for when the queue is empty or false for when there are additional functions / promises in the queue
   * @returns is the queue empty
   */
  public isEmpty(): boolean {
    return this.callQueue.isEmpty();
  }
}