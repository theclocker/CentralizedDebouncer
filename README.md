# Ontyme
For when you have complex function call delaying needs

## Delay
```ts
import { Delay } from 'ontyme/Delay'

const body = document.getElementsByTagName("body")[0];
let numberOfDelays = 0, id;

function onInputChange(value) {
  ({id} = Ontyme.Delay.callOnceReleased(() => {
    body.innerHTML += `Value when released: ${value}, Number of delays: ${numberOfDelays++}</br>`;
  }, 2000, id));
}
...

```
