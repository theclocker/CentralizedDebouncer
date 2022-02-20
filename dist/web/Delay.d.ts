declare type callFunc<T> = (...args: any) => T;
declare type ReuseCall<T> = [Promise<any>, (func: callFunc<T>, milsDelay: number) => ReuseCall<T>, number?];
export declare class Delay {
    private static timeouts;
    private static functions;
    private static overrideListeners;
    /**
     * A bulkified debouncer for calls
     * All operations are aggregated for when you need
     *
     * @param func the function to call after the timeout
     * @param milsDelay the delay for the timeout
     * @param registerId a unique identifier for the caller, will be automatically created when not provided, reuse the identifier for resetting the delay
     * @returns An object holding the promise created, a re-usable function for the same operation and the id created for the operation
     */
    static callOnceReleased<T>(func: callFunc<T>, milsDelay: number, registerId?: number): {
        delay: (func: callFunc<T>, milsDelay: number) => ReuseCall<T>;
        id?: number;
    };
    /**
     * Remove the operation, and cancel it if you wish
     * @param id The id of the operation to cancel
     * @param clearTimeout Should clear timeout
     */
    static purge(id: number, clearTimeout?: boolean): void;
    /**
     * Use to register an event that will fire all callbacks when the page blurs / unloads
     */
    static registerCallStackOnPageBlur(): void;
    /**
     * Remove the events that will trigger when the page unloads / blurs
     */
    static removeCallStackOnPageExit(): void;
    /**
     * Overrides an existing operation's callback function and delay, and notifies subscribers
     * @param func A new callback function for th opeartion
     * @param milsDelay A new delay for the operation
     * @param id A unique identifier for th operation
     */
    private static override;
    /**
     * A subscriber-like function that is used when the user overrides the current operation with a new callback and delay
     * @param call A callback function accepting the new func and new delay given by the user
     * @param id A unique identifier for this operation
     */
    private static onOverride;
    /**
     * Creates a timeout for the callback function, returns an id of the callback function
     *
     * @param func The callback function to call once the delay has ended
     * @param milsDelay The time to wait in milliseconds
     * @param id The unique identifier for this operation
     * @returns The identifier of the createTimeout function
     */
    private static createTimeout;
    /**
     * Create / Remove event listeners used when the page unloads / blurs
     * @param remove boolean indicating whether or not this functions removes or adds the event listeners
     * @returns
     */
    private static unloadCallsEvent;
    /**
     * Creates a unique identifier for debounce calls
     * @returns A "unique" identifier for the debounce calls
     */
    private static createRandomIdentifier;
    /**
     * Call all of the functions in the map
     */
    private static unloadProcedure;
}
export {};
