/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Delay.ts":
/*!**********************!*\
  !*** ./src/Delay.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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
        // ^ if the use entered a custom id that is the one that will be used
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


/***/ }),

/***/ "./src/Errors/LimiterFinishedError.ts":
/*!********************************************!*\
  !*** ./src/Errors/LimiterFinishedError.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var LimiterFinishedError = /** @class */ (function (_super) {
    __extends(LimiterFinishedError, _super);
    function LimiterFinishedError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'LimiterFinishedError';
        return _this;
    }
    return LimiterFinishedError;
}(Error));
exports["default"] = LimiterFinishedError;


/***/ }),

/***/ "./src/Errors/ManagedLimiterModeError.ts":
/*!***********************************************!*\
  !*** ./src/Errors/ManagedLimiterModeError.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ManagedLimiterModeError = /** @class */ (function (_super) {
    __extends(ManagedLimiterModeError, _super);
    function ManagedLimiterModeError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ManagedLimiterModeError;
}(Error));
exports["default"] = ManagedLimiterModeError;


/***/ }),

/***/ "./src/Limiter/ManagedLimiter.ts":
/*!***************************************!*\
  !*** ./src/Limiter/ManagedLimiter.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManagedLimiter = void 0;
var ManagedLimiterModeError_1 = __webpack_require__(/*! ../Errors/ManagedLimiterModeError */ "./src/Errors/ManagedLimiterModeError.ts");
var Queue_1 = __webpack_require__(/*! ../Queue */ "./src/Queue.ts");
/**
 * A call limiter controlled by the user of the class
 */
var ManagedLimiter = /** @class */ (function () {
    /**
     * Create a new instance of the class and return it to the user
     * @param funcs What to pre-populate the queue with
     * @param async Whether or not the class is asynchronous
     */
    function ManagedLimiter(funcs, async) {
        this.async = async;
        /**
         * Holds the queue of calls the user is preparing
         */
        this.callQueue = Queue_1.default.create();
        this.callQueue.bulkEnqueue(funcs);
    }
    /**
     * The entry point for the synchronous ManagedLimiter, all functions will be executed and their value will be returned
     * @param funcs An array of functions
     * @returns A ManagedLimiter
     */
    ManagedLimiter.makeSync = function (funcs) {
        if (funcs === void 0) { funcs = []; }
        return new ManagedLimiter(funcs, false);
    };
    /**
     * The entry point for the asynchronous ManagedLimiter, all promises will be returned as a promise
     * @param promises An array of promises to pre-populate the queue with
     * @returns A ManagedLimiter
     */
    ManagedLimiter.makeAsync = function (promises) {
        if (promises === void 0) { promises = []; }
        return new ManagedLimiter(promises, true);
    };
    /**
     * Calls the next function in the queue and returns its value
     * @returns The value of the function from the queue, with the return type as indicated by the user
     */
    ManagedLimiter.prototype.next = function () {
        if (this.async)
            throw new ManagedLimiterModeError_1.default('Cant call next on a asynchronous limiter, use asyncNext() instead.');
        if (this.isEmpty())
            return;
        return this.callQueue.dequeue()();
    };
    /**
     * Runs through the queue using a generator, for when you want to loop through the values
     */
    ManagedLimiter.prototype.genNext = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!this.isEmpty()) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.callQueue.dequeue()()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    };
    /**
     * Calls the next function asynchronously
     * @returns The promise given by the user
     */
    ManagedLimiter.prototype.asyncNext = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.async)
                    throw new ManagedLimiterModeError_1.default('Cant call next on a synchronous limiter, use next() instead.');
                if (this.isEmpty())
                    return [2 /*return*/];
                return [2 /*return*/, this.callQueue.dequeue()()];
            });
        });
    };
    /**
     * Runs through the promises using a generator, for when you want to loop through all of the promises
     */
    ManagedLimiter.prototype.genAsyncNext = function () {
        return __asyncGenerator(this, arguments, function genAsyncNext_1() {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.isEmpty()) return [3 /*break*/, 3];
                        return [4 /*yield*/, __await(this.callQueue.dequeue()())];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add additional promises or functions to the call queue
     * @param funcs An array of functions or promises
     */
    ManagedLimiter.prototype.push = function () {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        this.callQueue.bulkEnqueue(funcs);
    };
    /**
     * Returns the size of the queue at this point in time
     * @returns size of the queue
     */
    ManagedLimiter.prototype.size = function () {
        return this.callQueue.length;
    };
    /**
     * Returns true for when the queue is empty or false for when there are additional functions / promises in the queue
     * @returns is the queue empty
     */
    ManagedLimiter.prototype.isEmpty = function () {
        return this.callQueue.isEmpty();
    };
    return ManagedLimiter;
}());
exports.ManagedLimiter = ManagedLimiter;


/***/ }),

/***/ "./src/Limiter/TimeLimiter.ts":
/*!************************************!*\
  !*** ./src/Limiter/TimeLimiter.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeLimiter = void 0;
var Queue_1 = __webpack_require__(/*! ../Queue */ "./src/Queue.ts");
var LimiterFinishedError_1 = __webpack_require__(/*! ../Errors/LimiterFinishedError */ "./src/Errors/LimiterFinishedError.ts");
/**
 * This class will limit the number of calls you make by calculating the number of calls made in the time-frame provided
 * The point of this class is to make as many calls as possible, clearing the queue as fast as the user is allowed to
 * This is good when you have batches of calls you need to make and you do not want to spread them out
 * For example if you have an api that accepts 60 calls per minute and you have 60 calls to make, there is no need to wait 1 second between
 * each call, you can just exhaust your limits all at once
 */
var TimeLimiter = /** @class */ (function () {
    /**
     * Setup a rate limiter for making function calls using a time-frame and the number
     * of calls you can make in that time-frame
     * @param numOfCalls Number of calls you can make in time-frame
     * @param milsInterval The time-frame in milliseconds
     */
    function TimeLimiter(numOfCalls, milsInterval) {
        this.numOfCalls = numOfCalls;
        this.milsInterval = milsInterval;
        this.timestamps = Queue_1.default.create();
        this.requestQueue = Queue_1.default.create();
        this.results = new Array();
        this.finished = false;
        this.makingCalls = false;
        this.timeTook = 0;
    }
    /**
     * Create a limiter call and return a promise, the promise will resolve when the queue is done
     * @param funcs An array of functions to pass into the request queue
     * @returns A promise resolving the results of the limiter
     */
    TimeLimiter.prototype.make = function (funcs) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.requestQueue.bulkEnqueue(funcs);
                // Make all of the calls until the queue is done (generator is finished)
                this.timeTook = Date.now();
                // Return a promise that will resolve when the Limiter is marked as finished and the queue is depleted
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.onQueueDone(function () {
                            if (_this.isFinished) { // Only resolve if the limiter is marked as
                                _this.timeTook = Date.now() - _this.timeTook;
                                resolve({
                                    milliseconds: _this.timeTook,
                                    results: _this.results
                                });
                            }
                        });
                        // Begin running through the queue
                        _this.runThroughQueue();
                    })];
            });
        });
    };
    /**
     * Push a function or an array of functions into the call queue of the limiter
     * @param funcs An array of functions or a single function
     */
    TimeLimiter.prototype.push = function () {
        var funcs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            funcs[_i] = arguments[_i];
        }
        if (this.isFinished)
            throw new LimiterFinishedError_1.default("Cant push more functions to a limiter that is set to finished.");
        this.requestQueue.bulkEnqueue(funcs);
        !this.makingCalls && this.runThroughQueue();
    };
    /**
     * Returns wether or not you can make a call, if nothing is passed, Date.now() will be used to calculate (preferred)
     * @param timestamp a timestamp for when you want to calculate ahead of time
     * @returns whether or not you can make a call for the timestamp or the Date.now() value
     */
    TimeLimiter.prototype.canMakeCall = function (timestamp) {
        // Deals with permissions up to the number of calls
        if (this.timestamps.length < this.numOfCalls)
            return true;
        // If the timestamp or time now - the mils interval is greater than the first call in the queue, you can make a call
        var time = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now() - this.milsInterval;
        // While the queue is not empty and the first timestamp in the queue is smaller than the time function
        while (!this.timestamps.isEmpty() && this.timestamps.peek() < time) {
            this.timestamps.dequeue();
        }
        return this.timestamps.length < this.numOfCalls;
    };
    /**
     * Mark the Limiter as finished, when the queue is done the results will be resolved
     */
    TimeLimiter.prototype.finish = function () {
        this.finished = true;
        if (this.requestQueue.isEmpty && !this.makingCalls)
            this.queueDoneCallback();
    };
    Object.defineProperty(TimeLimiter.prototype, "isFinished", {
        /**
         * Whether or not the limiter is done accepting calls
         */
        get: function () {
            return this.finished;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Register a callback for when the is queue done
     * @param call a callback function that fires when the queue is done
     */
    TimeLimiter.prototype.onQueueDone = function (call) {
        this.queueDoneCallback = call;
    };
    /**
     * Call the makeCalls generator and mark the limiter's making calls parameter
     */
    TimeLimiter.prototype.runThroughQueue = function () {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var _b, _c, result, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.makingCalls = true; // Before calling the generator, make the Limiter as making calls
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = __asyncValues(this.makeCalls());
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        result = _c.value;
                        this.results.push(result);
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_c && !_c.done && (_a = _b.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(_b)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        // Reset the making calls parameter
                        this.makingCalls = false;
                        this.queueDoneCallback(); // Call the queue done callback
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * A generator for calling the functions given to the queue
     */
    TimeLimiter.prototype.makeCalls = function () {
        return __asyncGenerator(this, arguments, function makeCalls_1() {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.requestQueue.isEmpty()) return [3 /*break*/, 7];
                        if (!this.canMakeCall()) return [3 /*break*/, 3];
                        this.timestamps.enqueue(Date.now());
                        return [4 /*yield*/, __await((this.requestQueue.dequeue()()))];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [4 /*yield*/, __await(new Promise(function (resolve) {
                            setTimeout(function () {
                                _this.timestamps.enqueue(Date.now());
                                var func = _this.requestQueue.dequeue();
                                var res = func();
                                resolve(res);
                            }, _this.milsUntilNextCall());
                        }))];
                    case 4: return [4 /*yield*/, __await.apply(void 0, [_a.sent()])];
                    case 5: 
                    // If cant make call, start an interval until time clears
                    // This will not wait for functions that are promises them-selves
                    return [4 /*yield*/, _a.sent()];
                    case 6:
                        // If cant make call, start an interval until time clears
                        // This will not wait for functions that are promises them-selves
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns the number of milliseconds to wait until you can make another call from the request queue
     * @param timestamp a timestamp to use for comparison, if not passed, Date.now() is used
     * @returns the milliseconds until the next call can be made
     */
    TimeLimiter.prototype.milsUntilNextCall = function (timestamp) {
        // The interval - The difference between the timestamp / Date.now() and the oldest timestamp
        timestamp = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now();
        return this.milsInterval - (timestamp - this.timestamps.peek());
    };
    return TimeLimiter;
}());
exports.TimeLimiter = TimeLimiter;


/***/ }),

/***/ "./src/Queue.ts":
/*!**********************!*\
  !*** ./src/Queue.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Queue = /** @class */ (function (_super) {
    __extends(Queue, _super);
    /**
     * Use Queue.create to create a new queue that is extending an Array
     * @param items Initial array items
     */
    function Queue() {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return _super.apply(this, items) || this;
    }
    Queue.create = function () {
        return Object.create(Queue.prototype);
    };
    Queue.prototype.enqueue = function (value) {
        this.push(value);
    };
    Queue.prototype.bulkEnqueue = function (values) {
        this.push.apply(this, values);
    };
    Queue.prototype.dequeue = function () {
        return this.shift();
    };
    Queue.prototype.peek = function () {
        return this[0];
    };
    Queue.prototype.isEmpty = function () {
        return this.length === 0;
    };
    return Queue;
}(Array));
exports["default"] = Queue;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ManagedLimiter = exports.TimeLimiter = exports.Delay = void 0;
var Delay_1 = __webpack_require__(/*! ./Delay */ "./src/Delay.ts");
Object.defineProperty(exports, "Delay", ({ enumerable: true, get: function () { return Delay_1.Delay; } }));
var TimeLimiter_1 = __webpack_require__(/*! ./Limiter/TimeLimiter */ "./src/Limiter/TimeLimiter.ts");
Object.defineProperty(exports, "TimeLimiter", ({ enumerable: true, get: function () { return TimeLimiter_1.TimeLimiter; } }));
var ManagedLimiter_1 = __webpack_require__(/*! ./Limiter/ManagedLimiter */ "./src/Limiter/ManagedLimiter.ts");
Object.defineProperty(exports, "ManagedLimiter", ({ enumerable: true, get: function () { return ManagedLimiter_1.ManagedLimiter; } }));

})();

/******/ })()
;
//# sourceMappingURL=index.js.map