'use strict'

const moment = require('moment')

function getInitialCursor (base, intervals) {
  const baseHours = base.hours()
  const baseMinutes = base.minutes()

  let i = 0

  intervals.forEach(interval => {
    if (baseHours > interval.hours) {
      i++
    } else if (baseHours === interval.hours) {
      if (baseMinutes > interval.minutes) {
        i++
      }
    }
  })

  return i
}

function * niqtimeIterator (intervals, fromDate) {
  if (!Array.isArray(intervals) || !intervals.length) {
    return
  }

  fromDate = (fromDate instanceof Date || fromDate instanceof moment) ? fromDate : {}

  const base = moment(fromDate)

  let i = getInitialCursor(base, intervals)

  while (true) {
    if (!intervals[i]) {
      i = 0
      base.add(1, 'days')
    }

    const time = intervals[i++]

    yield moment({
      year: base.year(),
      month: base.month(),
      date: base.date(),
      hours: time.hours,
      minutes: time.minutes
    })
  }
}

function niqtime (intervals, fromDate) {
  const iterator = niqtimeIterator(intervals, fromDate)
  return () => iterator.next().value
}

niqtime.iterator = niqtimeIterator

module.exports = niqtime
