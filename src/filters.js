import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', (value, format) => {
  if (typeof value !== 'string' || value === '') {
    return ''
  }

  return moment(value).format(format)
})