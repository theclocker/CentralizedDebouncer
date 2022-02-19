"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delay = void 0;
var Delay = /** @class */ (function () {
    function Delay() {
    }
    /**
     * A bulkified debouncer for calls
     * All operations are aggregated for when you need
     *
     * @param func the function to call after the timeout
     * @param milsDelay the delay for the timeout
     * @param registerId a unique identifier for the caller, will be automatically created when not provided, reuse the identifier for resetting the delay
     * @returns An object holding the promise created, a re-usable function for the same operation and the id created for the operation
     */
    Delay.callOnceReleased = function (func, milsDelay, registerId) {
        var _this = this;
        var id = registerId;
        // If the id exists, override the current function call and delay
        if (id && this.overrideListeners.has(id))
            this.override(func, milsDelay, id);
        else if (id == null)
            id = this.createRandomIdentifier(); // If the id does not exist, create it
        // If the override listener does not exist (first call) create it
        if (!this.functions.has(id)) {
            this.onOverride(function (overrideFunc, overrideMilsDelay) {
                // Set the function to the new function
                _this.functions.set(id, overrideFunc);
                // Clear the timeout and create a new one
                window.clearTimeout(_this.timeouts.get(id));
                _this.timeouts.set(id, _this.createTimeout(overrideFunc, overrideMilsDelay, id));
            }, id);
            // Register the new function, for when we want to unload / blur the page
            this.functions.set(id, func);
            // Set the new timeout
            this.timeouts.set(id, this.createTimeout(func, milsDelay, id));
        }
        // Return the same delay function and the id
        return {
            delay: (function (overrideFunc, overrideMilsDelay) { return _this.callOnceReleased(overrideFunc, overrideMilsDelay, id); }).bind(id),
            id: id
        };
    };
    /**
     * Remove the operation, and cancel it if you wish
     * @param id The id of the operation to cancel
     * @param clearTimeout Should clear timeout
     */
    Delay.purge = function (id, clearTimeout) {
        if (clearTimeout === void 0) { clearTimeout = true; }
        // Remove all of the nodes for this request
        if (clearTimeout) {
            window.clearTimeout(this.timeouts.get(id));
        }
        this.timeouts.delete(id);
        this.overrideListeners.delete(id);
        this.functions.delete(id);
    };
    /**
     * Use to register an event that will fire all callbacks when the page blurs / unloads
     */
    Delay.registerCallStackOnPageBlur = function () {
        this.unloadCallsEvent(false);
    };
    /**
     * Remove the events that will trigger when the page unloads / blurs
     */
    Delay.removeCallStackOnPageExit = function () {
        this.unloadCallsEvent(true);
    };
    /**
     * Overrides an existing operation's callback function and delay, and notifies subscribers
     * @param func A new callback function for th opeartion
     * @param milsDelay A new delay for the operation
     * @param id A unique identifier for th operation
     */
    Delay.override = function (func, milsDelay, id) {
        var overrideListener = this.overrideListeners.get(id);
        overrideListener(func, milsDelay);
    };
    /**
     * A subscriber-like function that is used when the user overrides the current operation with a new callback and delay
     * @param call A callback function accepting the new func and new delay given by the user
     * @param id A unique identifier for this operation
     */
    Delay.onOverride = function (call, id) {
        this.overrideListeners.set(id, call);
    };
    /**
     * Creates a timeout for the callback function, returns an id of the callback function
     *
     * @param func The callback function to call once the delay has ended
     * @param milsDelay The time to wait in milliseconds
     * @param id The unique identifier for this operation
     * @returns The identifier of the createTimeout function
     */
    Delay.createTimeout = function (func, milsDelay, id) {
        var _this = this;
        return window.setTimeout(function () {
            try {
                func();
                _this.purge(id);
            }
            catch (e) {
                console.error(e);
                _this.purge(id);
                throw e;
            }
        }, milsDelay);
    };
    /**
     * Create / Remove event listeners used when the page unloads / blurs
     * @param remove boolean indicating whether or not this functions removes or adds the event listeners
     * @returns
     */
    Delay.unloadCallsEvent = function (remove) {
        var _this = this;
        if (remove === void 0) { remove = false; }
        if (remove) {
            window.removeEventListener('beforeunload', function () { return _this.unloadProcedure(); });
            window.removeEventListener('blur', function () { return _this.unloadProcedure(); });
            return;
        }
        // NOTE: This will fire if you focus the developer console
        window.addEventListener('beforeunload', function () { return _this.unloadProcedure(); });
        window.addEventListener('blur', function () { return _this.unloadProcedure(); });
    };
    /**
     * Creates a unique identifier for debounce calls
     * @returns A "unique" identifier for the debounce calls
     */
    Delay.createRandomIdentifier = function () {
        return Math.round(Math.random() * 10000); // Random number up to 10000, should be enough... should probably replace
    };
    /**
     * Call all of the functions in the map
     */
    Delay.unloadProcedure = function () {
        var _this = this;
        this.functions.forEach(function (func, id) {
            func();
            _this.purge(id, true);
        });
    };
    // Holds all of the timeouts currently happening
    Delay.timeouts = new Map();
    // Holds all of the functions to be called when the timeout end or the page blurs
    Delay.functions = new Map();
    // Holds all of the override listeners for promises, so they know when to delay resolve
    Delay.overrideListeners = new Map();
    return Delay;
}());
exports.Delay = Delay;
