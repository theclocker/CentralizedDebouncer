# Ontyme
For when you have complex function call delaying needs

# Delay
The Delay module is basically a bulkified debouncer, keep calling ```Delay.callOnceReleased``` function using the same id, and it will continue to be delayed.
```ts
import { Delay } from 'ontyme/Delay'

const body = document.getElementsByTagName("body")[0];
let numberOfDelays = 0, id;

function onInputChange(value) {
  // If you pass in undefined into the function, the id will be created for you
  ({id} = Delay.callOnceReleased(() => {
    body.innerHTML += `Value when released: ${value}, Number of delays: ${numberOfDelays++}</br>`;
  }, 2000, id));
}
...

```

### Or use your own id as an identifier
```ts
Delay.callOnceReleased(() => {
  body.innerHTML += `Value when released: ${value}, Number of delays: ${numberOfDelays++}</br>`;
}, 2000, 'unique_id'));
```

# Limiters

## TimeLimiter
Time limiter will aggregate callbacks and will execute them when a "time queue" is clear, as to not make too many calls in a time frame.

```ts
import { TimeLimiter } from 'ontyme/Limiters/TimeLimiter'

const limiter = new TimeLimiter(/*allowed calls*/10, /*Timeframe*/1000);
const calls = new Array();
const min = 10;
const max = 100;
recursivePush(min, max);
...
// You can make a limiter with an initial array of calls to make
// This function will not resolve until limiter.finish() was called
limiter.make(calls).then(resolve => {
    console.log(resolve.results.reduce((prev, curr) => prev + curr, 0));
});

...

let createdCalls = 0;
let timeout;
// helper function to create function calls with "random" timing
function recursivePush(min, max) {
    const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
    timeout = setTimeout(((randomTime) => {
        createdCalls++;
        if (createdCalls > 500) {
            console.log("--------- Reached END ---------");
            limiter.finish();
            clearTimeout(timeout);
            return;
        }
        limiter.push(() => randomTime);
        recursivePush(min, max);
    }).bind(this, randomTime), randomTime);
}
```

# Managed Limiter
Managed limiter is managed by the user as to how to make the calls in the stack