const t = require('tap')
const niqtime = require('../lib')
const moment = require('moment')

function generateExpects (fromDate, intervals, length) {
  let expects = []
  let cursor = 0
  const now = moment(fromDate)

  Array(length).fill().forEach(() => {
    let i = cursor
    if (!intervals[i]) {
      cursor = i = 0
      now.add(1, 'days')
    }
    cursor++
    expects.push(moment(`${now.format('YYYY-MM-DD')} ${intervals[i]}`).format('YYYY-MM-DD HH:mm'))
  })

  return expects
}

t.test('Unique', t => {
  const tests = [
    {
      intervals: ['10:00'],
      expects: [
        '2011-01-01 10:00',
        '2011-01-02 10:00',
        '2011-01-03 10:00'
      ],
      notExpects: ['2011-01-01 09:34'],
      fromDate: '2011-01-01 09:00'
    },
    {
      intervals: ['10:00', '13:00', '15:00', '19:00'],
      expects: generateExpects('2016-07-01 09:00', ['10:00', '13:00', '15:00', '19:00'], 1000),
      notExpects: ['2016-07-01 09:34'],
      fromDate: '2016-07-01 09:00'
    },
    {
      intervals: ['12:00', '16:00'],
      expects: [moment().hours(16).minutes(0).format('YYYY-MM-DD HH:mm')],
      notExpects: [moment().hours(12).minutes(0).format('YYYY-MM-DD HH:mm')],
      fromDate: moment().hours(13).minutes(18).format('YYYY-MM-DD HH:mm')
    }
  ]

  tests.forEach(test => {
    const { intervals, expects, notExpects, fromDate } = test
    const uniqueDate = niqtime(intervals, fromDate)

    t.test(`${JSON.stringify(intervals)}`, t => {
      t.test(`expectation case (${expects.length} tests)`, t => {
        expects.forEach(expect => {
          const uq = uniqueDate()
          t.strictEqual(uq.date, expect)
          t.strictEqual(uq.timestamp, +moment(expect))
        })

        t.end()
      })

      if (notExpects && notExpects.length) {
        t.test(`not expectation case (${notExpects.length} tests)`, t => {
          notExpects.forEach(expect => {
            const uq = uniqueDate()
            t.notStrictEqual(uq.date, expect)
            t.notStrictEqual(uq.timestamp, +moment(expect))
          })

          t.end()
        })
      }

      t.end()
    })
  })

  t.end()
})
