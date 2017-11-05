# niqtime
Fork time (HH:mm) certain times to get a sequence of days

## Getting started

```js
const moment = require('moment')
const niqtime = require('niqtime')

const intervals = [
  { hours: 12, minutes: 15 },
  { hours: 19, minutes: 0 }
]

const fromDate = moment({ hours: 16 }) // optional argument, uses now by default

const nextDate = niqtime(intervals, fromDate)

console.log(nextDate()) // moment instance representing today, at 19:00
console.log(nextDate()) // moment instance representing tomorrow, at 12:15
console.log(nextDate()) // moment instance representing tomorrow, 19:00
/// etc.
```
