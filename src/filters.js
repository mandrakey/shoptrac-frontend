/*
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
*/

import Vue from 'vue'
import moment from 'moment'

Vue.filter('dateformat', (value, format) => {
  if (typeof value !== 'string' || value === '') {
    return ''
  }

  return moment(value).format(format)
})