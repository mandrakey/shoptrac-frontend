<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<template>
  <div>
    <input class="w3-block" type="text" :value="theValue" @keyup="keyPress" ref="sum">

    <div class="w3-row">
      <div class="w3-col l9 m9 s9">

        <div class="w3-row">
          <div class="w3-col w3-third w3-center w3-padding-small">
            <button
              class="w3-button w3-theme-dark w3-block"
              @click="keyClick">
              1
            </button>
          </div>
          <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            2
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            3
          </button>
        </div>
      </div>

      <div class="w3-row">
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            4
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            5
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            6
          </button>
        </div>
      </div>

      <div class="w3-row">
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            7
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            8
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            9
          </button>
        </div>
      </div>

      <div class="w3-row">
        <div class="w3-col w3-twothird w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            0
          </button>
        </div>
        <div class="w3-col w3-third w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="keyClick">
            ,
          </button>
        </div>
      </div>
    </div>

    <div class="w3-col l3 m3 s3">
      <div>
        <div class="w3-center w3-padding-small">
          <button
            class="w3-button w3-theme-dark w3-block"
            @click="back">
              &lt;
          </button>
        </div>
        <div class="w3-center w3-padding-small">
          <button
            v-if="!hideEnterKey"
            id="st-enter-button"
            class="w3-button w3-theme-dark w3-block"
            @click="enter">
              OK
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import EventBus from '@/utils/EventBus'

export default {
  name: 'Keypad',

  props: {
    'value': {
      type: String,
      default: '0'
    },
    'hideEnterKey': {
      type: Boolean,
      default: false
    }
  },

  watch: {
    value: function (v) {
      this.theValue = v
    }
  },

  // model: {
  //   prop: 'value',
  //   event: 'change'
  // },

  data () {
    return {
      'theValue': '0'
    }
  },

  mounted () {
    EventBus.$on('focus-sum', this.onFocusSumHandler)

    if (typeof (this.value) !== 'undefined') {
      this.theValue = this.value
    }
  },

  destroyed () {
    EventBus.$off('focus-sum', this.onFocusSumHandler)
  },

  methods: {
    keyClick: function (e) {
      this.add(e.target.innerHTML.trim())
    },

    keyPress: function (e) {
      switch (e.key) {
        case 'Backspace':
          this.back()
          break
        case 'Enter':
          this.enter()
          break
        default:
          this.add(e.key)
      }
      return true
    },

    add: function (c) {
      const nr = parseInt(c)
      let value = this.theValue
      if (!isNaN(nr)) {
        value += nr
      } else {
        if (['.', ','].indexOf(c) > -1 && value.indexOf('.') === -1) {
          value += '.'
        }
      }

      // Remove leading 0, if any
      if (value[0] === '0') {
        value = value.substr(1, value.length)
      }

      // Force 2 decimals if more
      const tmp = value.split('.')
      if (tmp.length === 2 && tmp[1].length > 2) {
        value = tmp[0] + '.' + tmp[1].substring(0, 2)
      }

      this.setValue(value)
    },

    back: function () {
      const value = this.theValue
      if (value !== '0') {
        this.setValue(value.substring(0, value.length - 1))
      }

      if (value === '') {
        this.setValue(0)
      }
    },

    setValue: function (value) {
      this.theValue = `${value}`
      this.$forceUpdate()
      this.$emit('change', { sum: this.theValue })
    },

    enter: function () {
      this.$emit('submit', { sum: this.theValue })
    },

    clear: function () {
      this.theValue = ''
      this.$forceUpdate()
      this.$emit('change', { sum: this.theValue })
    },

    onFocusSumHandler () {
      this.$refs['sum'].focus()
    }
  }
}
</script>

<style scoped>
#st-enter-button {
  height: 131px;
}
</style>
