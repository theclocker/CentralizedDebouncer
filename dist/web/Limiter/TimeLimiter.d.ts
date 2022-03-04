import { AnyFunction } from '../Types';
/**
 * This class will limit the number of calls you make by calculating the number of calls made in the time-frame provided
 * The point of this class is to make as many calls as possible, clearing the queue as fast as the user is allowed to
 * This is good when you have batches of calls you need to make and you do not want to spread them out
 * For example if you have an api that accepts 60 calls per minute and you have 60 calls to make, there is no need to wait 1 second between
 * each call, you can just exhaust your limits all at once
 */
export declare class TimeLimiter {
    private numOfCalls;
    private milsInterval;
    private timestamps;
    private requestQueue;
    private results;
    private finished;
    private makingCalls;
    private queueDoneCallback;
    private timeTook;
    /**
     * Setup a rate limiter for making function calls using a time-frame and the number
     * of calls you can make in that time-frame
     * @param numOfCalls Number of calls you can make in time-frame
     * @param milsInterval The time-frame in milliseconds
     */
    constructor(numOfCalls: number, milsInterval: number);
    /**
     * Create a limiter call and return a promise, the promise will resolve when the queue is done
     * @param funcs An array of functions to pass into the request queue
     * @returns A promise resolving the results of the limiter
     */
    make(funcs: Array<AnyFunction<any, any>>): Promise<any>;
    /**
     * Push a function or an array of functions into the call queue of the limiter
     * @param funcs An array of functions or a single function
     */
    push(...funcs: Array<AnyFunction<any, any>>): void;
    /**
     * Returns wether or not you can make a call, if nothing is passed, Date.now() will be used to calculate (preferred)
     * @param timestamp a timestamp for when you want to calculate ahead of time
     * @returns whether or not you can make a call for the timestamp or the Date.now() value
     */
    canMakeCall(timestamp?: number): boolean;
    /**
     * Mark the Limiter as finished, when the queue is done the results will be resolved
     */
    finish(): void;
    /**
     * Whether or not the limiter is done accepting calls
     */
    get isFinished(): boolean;
    /**
     * Register a callback for when the is queue done
     * @param call a callback function that fires when the queue is done
     */
    private onQueueDone;
    /**
     * Call the makeCalls generator and mark the limiter's making calls parameter
     */
    private runThroughQueue;
    /**
     * A generator for calling the functions given to the queue
     */
    private makeCalls;
    /**
     * Returns the number of milliseconds to wait until you can make another call from the request queue
     * @param timestamp a timestamp to use for comparison, if not passed, Date.now() is used
     * @returns the milliseconds until the next call can be made
     */
    private milsUntilNextCall;
}
