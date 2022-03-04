import { AnyFunction } from '../Types';
/**
 * A call limiter controlled by the user of the class
 */
export declare class ManagedLimiter<FuncsT> {
    private async?;
    /**
     * Holds the queue of calls the user is preparing
     */
    private callQueue;
    /**
     * The entry point for the synchronous ManagedLimiter, all functions will be executed and their value will be returned
     * @param funcs An array of functions
     * @returns A ManagedLimiter
     */
    static makeSync<FuncsT>(funcs?: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>): ManagedLimiter<FuncsT>;
    /**
     * The entry point for the asynchronous ManagedLimiter, all promises will be returned as a promise
     * @param promises An array of promises to pre-populate the queue with
     * @returns A ManagedLimiter
     */
    static makeAsync<FuncsT>(promises?: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>): ManagedLimiter<FuncsT>;
    /**
     * Create a new instance of the class and return it to the user
     * @param funcs What to pre-populate the queue with
     * @param async Whether or not the class is asynchronous
     */
    protected constructor(funcs: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>, async?: boolean);
    /**
     * Calls the next function in the queue and returns its value
     * @returns The value of the function from the queue, with the return type as indicated by the user
     */
    next(): FuncsT;
    /**
     * Runs through the queue using a generator, for when you want to loop through the values
     */
    genNext(): Generator<FuncsT, any, any>;
    /**
     * Calls the next function asynchronously
     * @returns The promise given by the user
     */
    asyncNext(): Promise<FuncsT>;
    /**
     * Runs through the promises using a generator, for when you want to loop through all of the promises
     */
    genAsyncNext(): AsyncGenerator<FuncsT, any, any>;
    /**
     * Add additional promises or functions to the call queue
     * @param funcs An array of functions or promises
     */
    push(...funcs: Array<AnyFunction<any, FuncsT | Promise<FuncsT>>>): void;
    /**
     * Returns the size of the queue at this point in time
     * @returns size of the queue
     */
    size(): number;
    /**
     * Returns true for when the queue is empty or false for when there are additional functions / promises in the queue
     * @returns is the queue empty
     */
    isEmpty(): boolean;
}
