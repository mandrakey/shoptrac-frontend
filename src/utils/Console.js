/*
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
*/

export default class Console {
  static LEVEL_LOG = 2
  static LEVEL_WARN = 1
  static LEVEL_ERROR = 0
  static LEVEL = 2

  static debug (message) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line
      console.debug(message)
    }
  }

  static log (message) {
    if (this.LEVEL >= this.LEVEL_LOG) {
      // eslint-disable-next-line
      console.log(message)
    }
  }

  static warn (message) {
    if (this.LEVEL >= this.LEVEL_WARN) {
      // eslint-disable-next-line
      console.warn(message)
    }
  }

  static error (message) {
    if (this.LEVEL >= this.LEVEL_ERROR) {
      // eslint-disable-next-line
      console.error(message)
    }
  }
}