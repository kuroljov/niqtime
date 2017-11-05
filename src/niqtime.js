// @flow
'use strict'

const moment = require('moment')

type Time = {
  hours: number,
  minutes: number
}

function getInitialCursor (base: moment, intervals: Array<Time>): number {
  const baseHours: number = base.hours()
  const baseMinutes: number = base.minutes()

  let i = 0

  intervals.forEach((interval: Time) => {
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

function * niqtimeIterator (intervals: Array<Time>, fromDate?: Date | moment) {
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

    const time: Time = intervals[i++]

    yield moment({
      year: base.year(),
      month: base.month(),
      date: base.date(),
      hours: time.hours,
      minutes: time.minutes
    })
  }
}

function niqtime (intervals: Array<Time>, fromDate?: moment | Date) {
  const iterator = niqtimeIterator(intervals, fromDate)
  return () => iterator.next().value
}

niqtime.iterator = niqtimeIterator

module.exports = niqtime
