var Ontyme;
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

/***/ "./src/Limiter.ts":
/*!************************!*\
  !*** ./src/Limiter.ts ***!
  \************************/
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
exports.Limiter = exports.LimiterMode = void 0;
var Queue_1 = __webpack_require__(/*! ./Queue */ "./src/Queue.ts");
var LimiterMode;
(function (LimiterMode) {
    LimiterMode[LimiterMode["Clear"] = 0] = "Clear";
    LimiterMode[LimiterMode["Spread"] = 1] = "Spread";
})(LimiterMode = exports.LimiterMode || (exports.LimiterMode = {}));
var Limiter = /** @class */ (function () {
    /**
     * Setup a rate limiter for making function calls using a time-frame and the number
     * of calls you can make in that time-frame
     * @param numOfCalls Number of calls you can make in time-frame
     * @param milsInterval The time-frame in milliseconds
     */
    function Limiter(numOfCalls, milsInterval, mode) {
        if (mode === void 0) { mode = LimiterMode.Clear; }
        this.numOfCalls = numOfCalls;
        this.milsInterval = milsInterval;
        this.timestamps = Queue_1.default.create();
        this.requestQueue = Queue_1.default.create();
    }
    Limiter.prototype.call = function (funcs) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var results, _b, _c, result, e_1_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.requestQueue.bulkEnqueue(funcs);
                        results = new Array();
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _b = __asyncValues(this.makeCalls());
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _b.next()];
                    case 3:
                        if (!(_c = _d.sent(), !_c.done)) return [3 /*break*/, 5];
                        result = _c.value;
                        results.push(result);
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
                    // Resolve a promise all, this is good for when you have multiple calls that all depend on each other
                    return [2 /*return*/, Promise.all(results)];
                }
            });
        });
    };
    Limiter.prototype.push = function (funcs) {
        if (funcs instanceof Array) {
            this.requestQueue.bulkEnqueue(funcs);
        }
        else {
            this.requestQueue.enqueue(funcs);
        }
    };
    /**
     * A generator for calling the functions given to the queue
     */
    Limiter.prototype.makeCalls = function () {
        return __asyncGenerator(this, arguments, function makeCalls_1() {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.requestQueue.length > 0)) return [3 /*break*/, 7];
                        if (!this.canMakeCall()) return [3 /*break*/, 3];
                        this.timestamps.enqueue(Date.now());
                        return [4 /*yield*/, __await((this.requestQueue.dequeue()()))];
                    case 1: return [4 /*yield*/, _a.sent()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [4 /*yield*/, __await(new Promise(function (resolve) {
                            window.setTimeout(function () {
                                _this.timestamps.enqueue(Date.now());
                                var res = (_this.requestQueue.dequeue())();
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
     * Returns wether or not you can make a call, if nothing is passed, Date.now() will be used to calculate (preferred)
     * @param timestamp a timestamp for when you want to calculate ahead of time
     * @returns whether or not you can make a call for the timestamp or the Date.now() value
     */
    Limiter.prototype.canMakeCall = function (timestamp) {
        // Deals with permissions up to the number of calls
        if (this.timestamps.length < this.numOfCalls)
            return true;
        // If the timestamp or time now - the mils interval is greater than the first call in the queue, you can make a call
        var time = timestamp !== null && timestamp !== void 0 ? timestamp : Date.now() - this.milsInterval;
        var removed = 0;
        while (this.timestamps.length > 0 && this.timestamps.peek() < time) {
            removed++;
            this.timestamps.dequeue();
        }
        // console.log("removed", removed);
        return this.timestamps.length < this.numOfCalls;
    };
    Limiter.prototype.milsUntilNextCall = function (timestamp) {
        // The interval - The difference between the timestamp / Date.now() and the oldest timestamp
        console.log("To wait", (this.milsInterval - ((timestamp !== null && timestamp !== void 0 ? timestamp : Date.now()) - this.timestamps.peek())));
        return this.milsInterval - ((timestamp !== null && timestamp !== void 0 ? timestamp : Date.now()) - this.timestamps.peek());
    };
    return Limiter;
}());
exports.Limiter = Limiter;


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
exports.Limiter = exports.Delay = void 0;
var Delay_1 = __webpack_require__(/*! ./Delay */ "./src/Delay.ts");
Object.defineProperty(exports, "Delay", ({ enumerable: true, get: function () { return Delay_1.Delay; } }));
var Limiter_1 = __webpack_require__(/*! ./Limiter */ "./src/Limiter.ts");
Object.defineProperty(exports, "Limiter", ({ enumerable: true, get: function () { return Limiter_1.Limiter; } }));

})();

Ontyme = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=bundle.js.map