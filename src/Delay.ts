type callFunc<T> = (...args: any) => T;
type ReuseCall<T> = [Promise<any>, (func: callFunc<T>, milsDelay: number) => ReuseCall<T>, number?];

class Delay {
    // Holds all of the timeouts currently happening
    private static timeouts: Map<number, number> = new Map();
    // Holds all of the functions to be called when the timeout end or the page blurs
    private static functions: Map<number, (...args: any) => any> = new Map();
    // Holds all of the promises that are currently resolving
    private static promises: Map<number, Promise<any>> = new Map();
    // Holds all of the override listeners for promises, so they know when to delay resolve
    private static overrideListeners: Map<number, (func: callFunc<any>, milsDelay: number) => any> = new Map();

    /**
     * A bulkified debouncer for calls that aggregates function calls for when a window is blurred / closing
     * 
     * @param func the function to call after the timeout
     * @param milsDelay the delay for the timeout
     * @param registerId a unique identifer for the caller, will be automatically created when not provided, reuse the identifier for resetting the delay
     * @returns an array with a promise to 
     */
    public static callOnceReleased<T>(func: callFunc<T>, milsDelay: number, registerId?: number): {promise: Promise<any>, delay: (func: callFunc<T>, milsDelay: number) => ReuseCall<T>, id?: number} {
        let id = registerId;
        // If the id exists, override the current function call and delay
        if (id && this.overrideListeners.has(id)) this.override(func, milsDelay, id);
        // If the id does not exist, create it
        else id = this.createRandomIdentifier();
        // Find the promise that was created if it exists, so we can return it for the user for subscribing
        let promise: Promise<any> = this.promises.get(id);
        // If the promise does not exist, create and register it
        if(!promise) {
            promise = new Promise<T>((resolve, reject) => {
                // This subscriber to override of the current id is used so the same promise resolved to the user on the first call
                // will never resolve while the the functin continues to be overriden
                this.onOverride((overrideFunc, overrideMilsDelay) => {
                    // Set the function to the new function
                    this.functions.set(id, overrideFunc);
                    // Clear the timeout and create a new one
                    window.clearTimeout(this.timeouts.get(id));
                    this.timeouts.set(id, this.createTimeout(overrideFunc, overrideMilsDelay, resolve, reject, id));
                }, id);
                // Register the new function, for when we want to unload / blur the page
                this.functions.set(id, func);
                // Set the new timeout
                this.timeouts.set(id, this.createTimeout(func, milsDelay, resolve, reject, id));
            });
            // Keep the promise for later fetching
            this.promises.set(id, promise);
        }
        return {promise, delay: ((func: (...args: any) => T, milsDelay: number) => this.callOnceReleased(func, milsDelay, id)).bind(id), id};
    }

    /**
     * Overrides an existing operation's callback function and delay, and notifies subscribers
     * @param func A new callback function for th opeartion
     * @param milsDelay A new delay for the operation
     * @param id A unique identifier for th operation
     */
    private static override<T>(func: callFunc<T>, milsDelay: number, id: number) {
        const overrideListener = this.overrideListeners.get(id);
        overrideListener(func, milsDelay);
    }

    /**
     * A subscriber-like function that is used when the user overrides the current operation with a new callback and delay
     * @param call A callback function accepting the new func and new delay given by the user
     * @param id A unique identifier for this operation
     */
    private static onOverride<T>(call: (func: callFunc<T>, milsDelay: number) => void, id: number) {
        this.overrideListeners.set(id, call);
    }

    /**
     * Creates a timeout for the callback function, returns an id of the callback function
     * 
     * @param func The callback function to call once the delay has ended
     * @param milsDelay The time to wait in miliseconds
     * @param resolve A promise / callback function that accepts the callback function's value
     * @param reject A promise / callback function that resolves an error
     * @param id The unique identifier for this operation
     * @returns The identifier of the createTimeout function
     */
    private static createTimeout<T>(func: callFunc<T>, milsDelay: number, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void, id: number): number {
        return window.setTimeout(() => {
            try {
                resolve(func());
            } catch(e) {
                reject(e);
            }
            // Remove all of the nodes for this request
            this.promises.delete(id);
            this.timeouts.delete(id);
            this.overrideListeners.delete(id);
            this.functions.delete(id);
        }, milsDelay);
    }

    /**
     * Use to register an event that will fire all callbacks when the page blurs / unloads
     */
    public static registerCallStackOnPageBlur(): void {
        this.unloadCallsEvent(false);
    }

    /**
     * Remove the events that will trigger when the page unloads / blurs
     */
    public static removeCallStackOnPageExit() {
        this.unloadCallsEvent(true);
    }

    /**
     * Creates a unique identifier for debounce calls
     * @returns A "unique" identifier for the debounce calls
     */
    private static createRandomIdentifier(): number {
        return Math.round(Math.random() * 10000); // Random number up to 10000, should be enough... should probably replace
    }

    /**
     * Create / Remove event listeners used when the page unloads / blurs
     * @param remove boolean indicating whether or not this functions removes or adds the event listeners
     * @returns 
     */
    private static unloadCallsEvent(remove: boolean = false) {
        if (remove) {
            window.removeEventListener('beforeunload', () => this.unloadProcedure());
            window.removeEventListener('blur', () => this.unloadProcedure());
            return;
        }
        // NOTE: This will fire if you focus the developer console
        window.addEventListener('beforeunload', () => this.unloadProcedure());
        window.addEventListener('blur', () => this.unloadProcedure());
    }

    /**
     * Call all of the functions in the map
     */
    private static unloadProcedure(): void {
        console.log("Unloading");
        this.functions.forEach((func, id) => {
            func();
            window.clearTimeout(this.timeouts.get(id));
            this.promises.delete(id);
            this.timeouts.delete(id);
            this.functions.delete(id);
            this.overrideListeners.delete(id);
        });
    }
}