'use strict'

const t = require('tap')
const niqtime = require('../lib')
const moment = require('moment')

t.test('Unique', t => {
  const tests = [{
    intervals: [
      { hours: 12, minutes: 0 }
    ],
    expects: [
      moment({ year: 2011, month: 1, date: 1, hours: 12, minutes: 0 }),
      moment({ year: 2011, month: 1, date: 2, hours: 12, minutes: 0 }),
      moment({ year: 2011, month: 1, date: 3, hours: 12, minutes: 0 })
    ],
    fromDate: moment({ year: 2011, month: 1, date: 1, hours: 8, minutes: 0 })
  }, {
    intervals: [
      { hours: 10, minutes: 0 },
      { hours: 15, minutes: 30 }
    ],
    expects: [
      moment({ year: 2017, month: 11, date: 31, hours: 15, minutes: 30 }),
      moment({ year: 2018, month: 0, date: 1, hours: 10, minutes: 0 }),
      moment({ year: 2018, month: 0, date: 1, hours: 15, minutes: 30 }),
      moment({ year: 2018, month: 0, date: 2, hours: 10, minutes: 0 }),
      moment({ year: 2018, month: 0, date: 2, hours: 15, minutes: 30 }),
      moment({ year: 2018, month: 0, date: 3, hours: 10, minutes: 0 })
    ],
    fromDate: moment({ year: 2017, month: 11, date: 31, hours: 11, minutes: 0 })
  }]

  t.test('no intervals', t => {
    const iterator = niqtime.iterator([], new Date()).next()

    t.ok(iterator.done)

    t.end()
  })

  tests.forEach(test => {
    const uniqueDate = niqtime(test.intervals, test.fromDate)

    t.test(JSON.stringify(test.intervals), t => {
      t.test('expect', t => {
        test.expects.forEach(date => {
          const uq = uniqueDate()
          t.equal(uq.toString(), date.toString())
          t.ok(uq.isSame(date), 'should be the same dates')
        })

        t.end()
      })

      t.end()
    })
  })

  t.end()
})
