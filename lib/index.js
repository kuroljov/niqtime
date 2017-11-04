const moment = require('moment')

class Unique {
  constructor (intervals, fromDate = {}) {
    this.moment = moment(fromDate)
    this.intervals = Array.isArray(intervals) ? intervals : []
    const format = 'YYYY-MM-DD'
    const currentMinute = this.moment.minute()
    const currentHour = this.moment.hour()
    this.cursor = this.intervals.filter(x => {
      x = x.split(':')
      const intervalHour = parseInt(x[0], 10)
      const intervalMinute = parseInt(x[1], 10)
      if (currentHour > intervalHour || (currentHour === intervalHour && currentMinute > intervalMinute)) {
        return true
      } else if (currentHour < intervalHour || (currentHour === intervalHour && currentMinute < intervalMinute)) {
        return false
      } else {
        // if interval and current are the same
        // then move cursor forward (e.g. because publish
        // mechanism will not have time enought
        // to publish article in this same minute)
        return true
      }
    }).length
    return () => {
      const time = this.getTime()
      const date = this.moment.format(format)
      const ISODate = `${date} ${time}`
      return {
        moment: this.moment,
        timestamp: +moment(ISODate),
        date: ISODate
      }
    }
  }
  getTime () {
    let i = this.cursor
    if (!this.intervals[i]) {
      this.cursor = i = 0
      this.moment.add(1, 'days')
    }
    this.cursor++
    return this.intervals[i]
  }
}

module.exports = Unique
