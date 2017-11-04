'use strict'

const moment = require('moment')

const format = 'YYYY-MM-DD'
const COLON_REGEXP = /:/

function * niqtimeIterator (intervals, fromDate) {
  fromDate = fromDate || new Date()
  intervals = Array.isArray(intervals) ? intervals : []

  const now = moment(fromDate)

  const current = {
    minute: now.minute(),
    hour: now.hour()
  }

  let cursor = intervals
    .filter(time => {
      time = time.split(COLON_REGEXP)

      const hour = Number(time[0])
      const minute = Number(time[1])

      if (current.hour > hour || (current.hour === hour && current.minute > minute)) {
        return true
      } else if (current.hour < hour || (current.hour === hour && current.minute < minute)) {
        return false
      } else {
        // if interval and current are the same then move cursor forward
        return true
      }
    })
    .length

  while (true) {
    let i = cursor

    if (!intervals[i]) {
      cursor = i = 0
      now.add(1, 'days')
    }

    cursor++
    const time = intervals[i]

    const date = now.format(format)
    const ISODate = `${date} ${time}`

    yield {
      moment: now,
      timestamp: +moment(ISODate),
      date: ISODate
    }
  }
}

function niqtime (...args) {
  const iterator = niqtimeIterator(...args)
  return () => iterator.next().value
}

niqtime.iterator = niqtimeIterator

module.exports = niqtime
