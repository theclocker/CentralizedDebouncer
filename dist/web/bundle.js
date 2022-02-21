var Ontyme;(()=>{"use strict";var e={755:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Delay=void 0;var n=function(){function e(){}return e.callOnceReleased=function(e,t,n){var r=this,i=n;return i&&this.overrideListeners.has(i)?this.override(e,t,i):null==i&&(i=this.createRandomIdentifier()),this.functions.has(i)||(this.onOverride((function(e,t){r.functions.set(i,e),window.clearTimeout(r.timeouts.get(i)),r.timeouts.set(i,r.createTimeout(e,t,i))}),i),this.functions.set(i,e),this.timeouts.set(i,this.createTimeout(e,t,i))),{delay:function(e,t){return r.callOnceReleased(e,t,i)}.bind(i),id:i}},e.purge=function(e,t){void 0===t&&(t=!0),t&&window.clearTimeout(this.timeouts.get(e)),this.timeouts.delete(e),this.overrideListeners.delete(e),this.functions.delete(e)},e.registerCallStackOnPageBlur=function(){this.unloadCallsEvent(!1)},e.removeCallStackOnPageExit=function(){this.unloadCallsEvent(!0)},e.override=function(e,t,n){this.overrideListeners.get(n)(e,t)},e.onOverride=function(e,t){this.overrideListeners.set(t,e)},e.createTimeout=function(e,t,n){var r=this;return window.setTimeout((function(){try{e(),r.purge(n)}catch(e){throw console.error(e),r.purge(n),e}}),t)},e.unloadCallsEvent=function(e){var t=this;if(void 0===e&&(e=!1),e)return window.removeEventListener("beforeunload",(function(){return t.unloadProcedure()})),void window.removeEventListener("blur",(function(){return t.unloadProcedure()}));window.addEventListener("beforeunload",(function(){return t.unloadProcedure()})),window.addEventListener("blur",(function(){return t.unloadProcedure()}))},e.createRandomIdentifier=function(){return Math.round(1e4*Math.random())},e.unloadProcedure=function(){var e=this;this.functions.forEach((function(t,n){t(),e.purge(n,!0)}))},e.timeouts=new Map,e.functions=new Map,e.overrideListeners=new Map,e}();t.Delay=n},746:function(e,t){var n,r=this&&this.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},n(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=function(e){function t(t){var n=e.call(this,t)||this;return n.name="LimiterFinishedError",n}return r(t,e),t}(Error);t.default=i},266:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(i,o){function u(e){try{a(r.next(e))}catch(e){o(e)}}function s(e){try{a(r.throw(e))}catch(e){o(e)}}function a(e){var t;e.done?i(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(u,s)}a((r=r.apply(e,t||[])).next())}))},i=this&&this.__generator||function(e,t){var n,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;u;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!((i=(i=u.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=t.call(e,u)}catch(e){o=[6,e],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,s])}}},o=this&&this.__asyncValues||function(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,n=e[Symbol.asyncIterator];return n?n.call(e):(e="function"==typeof __values?__values(e):e[Symbol.iterator](),t={},r("next"),r("throw"),r("return"),t[Symbol.asyncIterator]=function(){return this},t);function r(n){t[n]=e[n]&&function(t){return new Promise((function(r,i){!function(e,t,n,r){Promise.resolve(r).then((function(t){e({value:t,done:n})}),t)}(r,i,(t=e[n](t)).done,t.value)}))}}},u=this&&this.__await||function(e){return this instanceof u?(this.v=e,this):new u(e)},s=this&&this.__asyncGenerator||function(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var r,i=n.apply(e,t||[]),o=[];return r={},s("next"),s("throw"),s("return"),r[Symbol.asyncIterator]=function(){return this},r;function s(e){i[e]&&(r[e]=function(t){return new Promise((function(n,r){o.push([e,t,n,r])>1||a(e,t)}))})}function a(e,t){try{(n=i[e](t)).value instanceof u?Promise.resolve(n.value.v).then(c,l):f(o[0][2],n)}catch(e){f(o[0][3],e)}var n}function c(e){a("next",e)}function l(e){a("throw",e)}function f(e,t){e(t),o.shift(),o.length&&a(o[0][0],o[0][1])}};Object.defineProperty(t,"__esModule",{value:!0}),t.Limiter=void 0;var a=n(316),c=n(746),l=function(){function e(e,t){this.numOfCalls=e,this.milsInterval=t,this.timestamps=a.default.create(),this.requestQueue=a.default.create(),this.results=new Array,this.finished=!1,this.makingCalls=!1,this.timeTook=0}return e.prototype.make=function(e){return r(this,void 0,void 0,(function(){var t=this;return i(this,(function(n){return this.requestQueue.bulkEnqueue(e),this.timeTook=Date.now(),[2,new Promise((function(e){t.onQueueDone((function(){t.isFinished&&(t.timeTook=Date.now()-t.timeTook,e({milliseconds:t.timeTook,results:t.results}))})),t.runThroughQueue()}))]}))}))},e.prototype.push=function(e){if(this.isFinished)throw new c.default("Cant push more functions to a limiter that is set to finished.");e instanceof Array?this.requestQueue.bulkEnqueue(e):this.requestQueue.enqueue(e),this.makingCalls||this.runThroughQueue()},e.prototype.finish=function(){this.finished=!0,this.requestQueue.isEmpty&&!this.makingCalls&&this.queueDoneCallback()},Object.defineProperty(e.prototype,"isFinished",{get:function(){return this.finished},enumerable:!1,configurable:!0}),e.prototype.onQueueDone=function(e){this.queueDoneCallback=e},e.prototype.runThroughQueue=function(){var e,t;return r(this,void 0,void 0,(function(){var n,r,u,s;return i(this,(function(i){switch(i.label){case 0:this.makingCalls=!0,i.label=1;case 1:i.trys.push([1,6,7,12]),n=o(this.makeCalls()),i.label=2;case 2:return[4,n.next()];case 3:if((r=i.sent()).done)return[3,5];u=r.value,this.results.push(u),i.label=4;case 4:return[3,2];case 5:return[3,12];case 6:return s=i.sent(),e={error:s},[3,12];case 7:return i.trys.push([7,,10,11]),r&&!r.done&&(t=n.return)?[4,t.call(n)]:[3,9];case 8:i.sent(),i.label=9;case 9:return[3,11];case 10:if(e)throw e.error;return[7];case 11:return[7];case 12:return this.makingCalls=!1,this.queueDoneCallback(),[2]}}))}))},e.prototype.makeCalls=function(){return s(this,arguments,(function(){var e=this;return i(this,(function(t){switch(t.label){case 0:return this.requestQueue.isEmpty()?[3,7]:this.canMakeCall()?(this.timestamps.enqueue(Date.now()),[4,u(this.requestQueue.dequeue()())]):[3,3];case 1:case 5:return[4,t.sent()];case 2:case 6:return t.sent(),[3,0];case 3:return[4,u(new Promise((function(t){window.setTimeout((function(){e.timestamps.enqueue(Date.now());var n=e.requestQueue.dequeue()();t(n)}),e.milsUntilNextCall())})))];case 4:return[4,u.apply(void 0,[t.sent()])];case 7:return[2]}}))}))},e.prototype.canMakeCall=function(e){if(this.timestamps.length<this.numOfCalls)return!0;for(var t=null!=e?e:Date.now()-this.milsInterval;this.timestamps.length>0&&this.timestamps.peek()<t;)this.timestamps.dequeue();return this.timestamps.length<this.numOfCalls},e.prototype.milsUntilNextCall=function(e){return e=null!=e?e:Date.now(),console.log("To wait",this.milsInterval-(e-this.timestamps.peek())),this.milsInterval-(e-this.timestamps.peek())},e}();t.Limiter=l},316:function(e,t){var n,r=this&&this.__extends||(n=function(e,t){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])},n(e,t)},function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)});Object.defineProperty(t,"__esModule",{value:!0});var i=function(e){function t(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return e.apply(this,t)||this}return r(t,e),t.create=function(){return Object.create(t.prototype)},t.prototype.enqueue=function(e){this.push(e)},t.prototype.bulkEnqueue=function(e){this.push.apply(this,e)},t.prototype.dequeue=function(){return this.shift()},t.prototype.peek=function(){return this[0]},t.prototype.isEmpty=function(){return 0===this.length},t}(Array);t.default=i}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}var r={};(()=>{var e=r;Object.defineProperty(e,"__esModule",{value:!0}),e.Limiter=e.Delay=void 0;var t=n(755);Object.defineProperty(e,"Delay",{enumerable:!0,get:function(){return t.Delay}});var i=n(266);Object.defineProperty(e,"Limiter",{enumerable:!0,get:function(){return i.Limiter}})})(),Ontyme=r})();