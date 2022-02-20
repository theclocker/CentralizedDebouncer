declare type AnyFunction = (...args: any) => any;
export declare enum LimiterMode {
    Clear = 0,
    Spread = 1
}
export declare class Limiter {
    private numOfCalls;
    private milsInterval;
    private timestamps;
    private requestQueue;
    /**
     * Setup a rate limiter for making function calls using a time-frame and the number
     * of calls you can make in that time-frame
     * @param numOfCalls Number of calls you can make in time-frame
     * @param milsInterval The time-frame in milliseconds
     */
    constructor(numOfCalls: number, milsInterval: number, mode?: LimiterMode);
    call(funcs: Array<AnyFunction>): Promise<Array<any>>;
    push(funcs: Array<AnyFunction> | AnyFunction): void;
    /**
     * A generator for calling the functions given to the queue
     */
    private makeCalls;
    /**
     * Returns wether or not you can make a call, if nothing is passed, Date.now() will be used to calculate (preferred)
     * @param timestamp a timestamp for when you want to calculate ahead of time
     * @returns whether or not you can make a call for the timestamp or the Date.now() value
     */
    canMakeCall(timestamp?: number): boolean;
    private milsUntilNextCall;
}
export {};
