type callFunc<T> = (...args: any) => T;
type ReuseCall<T> = [Promise<any>, (func: callFunc<T>, milsDelay: number) => ReuseCall<T>, number?];

export class Delay {
    // Holds all of the timeouts currently happening
    private static timeouts: Map<number, number> = new Map();
    // Holds all of the functions to be called when the timeout end or the page blurs
    private static functions: Map<number, (...args: any) => any> = new Map();
    // Holds all of the override listeners for promises, so they know when to delay resolve
    private static overrideListeners: Map<number, (func: callFunc<any>, milsDelay: number) => any> = new Map();

    /**
     * A bulkified debouncer for calls
     * All operations are aggregated for when you need 
     * 
     * @param func the function to call after the timeout
     * @param milsDelay the delay for the timeout
     * @param registerId a unique identifer for the caller, will be automatically created when not provided, reuse the identifier for resetting the delay
     * @returns An object holding the promise created, a re-usable function for the same operation and the id created for the operation
     */
    public static callOnceReleased<T>(func: callFunc<T>, milsDelay: number, registerId?: number): {delay: (func: callFunc<T>, milsDelay: number) => ReuseCall<T>, id?: number} {
        let id = registerId;
        // If the id exists, override the current function call and delay
        if (id && this.overrideListeners.has(id)) this.override(func, milsDelay, id);
        else id = this.createRandomIdentifier(); // If the id does not exist, create it
        // If the override listener does not exist (first call) create it
        if(!this.functions.has(id)) {
            this.onOverride((overrideFunc, overrideMilsDelay) => {
                // Set the function to the new function
                this.functions.set(id, overrideFunc);
                // Clear the timeout and create a new one
                window.clearTimeout(this.timeouts.get(id));
                this.timeouts.set(id, this.createTimeout(overrideFunc, overrideMilsDelay, id));
            }, id);
            // Register the new function, for when we want to unload / blur the page
            this.functions.set(id, func);
            // Set the new timeout
            this.timeouts.set(id, this.createTimeout(func, milsDelay, id));
        }
        // Return the same delay function and the id
        return {
            delay: ((overrideFunc: callFunc<T>, overrideMilsDelay: number) => this.callOnceReleased(overrideFunc, overrideMilsDelay, id)).bind(id),
            id
        };
    }

    /**
     * Remove the operation, and cancel it if you wish
     * @param id The id of the operation to cancel
     * @param clearTimeout Should clear timeout
     */
    public static purge(id: number, clearTimeout: boolean = true) {
        // Remove all of the nodes for this request
        if (clearTimeout) {
            window.clearTimeout(this.timeouts.get(id));
        }
        this.timeouts.delete(id);
        this.overrideListeners.delete(id);
        this.functions.delete(id);
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
     * @param milsDelay The time to wait in milliseconds
     * @param id The unique identifier for this operation
     * @returns The identifier of the createTimeout function
     */
    private static createTimeout<T>(func: callFunc<T>, milsDelay: number, id: number): number {
        return window.setTimeout(() => {
            try {
                func();
                this.purge(id);
            } catch(e) {
                this.purge(id);
                throw e;
            }
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
        this.functions.forEach((func, id) => {
            func();
            this.purge(id, true);
        });
    }
}
