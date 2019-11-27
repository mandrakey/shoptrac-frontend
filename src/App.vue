<i18n src="@/lang/common.json"></i18n>
<i18n>
{
  "en": {
    "nav": {
      "settings": "Settings",
      "purchases": "Purchases",
      "statistics": "Statistics"
    }
  }
}
</i18n>

<template>
  <div id="app">

    <toast-view></toast-view>

    <div id="header" class="w3-row w3-theme w3-display-container">
        <div class="w3-half st-heading">
            <h2 class="w3-left-align">Shoptrac</h2>
        </div>
        <div class="w3-half st-menu">
          <div class="st-display-right">
            <router-link to="/" 
                :class="['w3-button', ($route.path === '/' ? 'background-complement-4' : 'w3-theme-dark')]">
              {{ $t('nav.purchases') }}
            </router-link>&nbsp;
            <router-link to="/settings"
                :class="['w3-button', ($route.path === '/settings' ? 'background-complement-4' : 'w3-theme-dark')]">
              {{ $t('nav.settings') }}
            </router-link>&nbsp;
            <router-link to="/statistics"
                :class="['w3-button', ($route.path === '/statistics' ? 'background-complement-4' : 'w3-theme-dark')]">
              {{ $t('nav.statistics') }}
            </router-link>
          </div>
        </div>
    </div>

    <router-view id="router-view" />

    <div id="footer" class="w3-row w3-padding w3-theme w3-display-container">
        <div class="w3-third st-version">
            <p>Shoptrac {{appVersion}}</p>
        </div>
        <div class="w3-third st-copyright">
            <p class="w3-display-center">Copyright &copy; 2018 shoptrac contributors</p>
        </div>
        <div class="w3-third w3-right-align st-display-right">
            <a href="https://github.com/mandrakey/shoptrac" target="_blank">
                <img src="@/assets/img/github.png" alt="Find shoptrac on Github">
            </a>
            <a href="https://twitter.com/shoptracapp" target="_blank">
                <img src="@/assets/img/twitter.png" alt="Find shoptrac on Twitter">
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import Api from 'api'
import Console from '@/utils/Console'
import EventBus from '@/utils/EventBus'

import Venue from '@/model/Venue'
import Category from '@/model/Category'

import ToastView from '@/components/ToastView'

import store from '@/store'

window.toast = function (message) {
  EventBus.$emit('toast', { message: message })
}

export default {
  name: 'app',

  components: {
    ToastView
  },

  created () {
    this.loadVenues()
    this.loadCategories()
    this.loadPurchaseTimestamps()
  },

  computed: {
    appVersion () { return window._APP_VERSION }
  },

  methods: {
    loadVenues () {
      // var self = this

      Api.getVenues()
        .then(resp => {
          if (typeof resp.status !== 'number' || resp.status !== 200) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
            return
          }

          try {
            var venues = {}
            resp.data.forEach(e => {
              var v = Venue.fromObject(e)
              venues[v._key] = v
            })

            store.commit('venues', venues)
            EventBus.$emit('venues-loaded')
          } catch (err) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${err}`)
          }
        })
        .catch(err => {
          //window.message(self.$i18n.t('errors.apiCommunication', [err]), 'red', 2500)
          Console.error(`API communication: ${err}`)
        })
    },

    loadCategories () {
      // var self = this

      Api.getCategories()
        .then(resp => {
          if (typeof resp.status !== 'number' || resp.status !== 200) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
            return
          }

          try {
            var categories = {}
            resp.data.forEach(e => {
              var c = Category.fromObject(e)
              categories[c._key] = c
            })

            store.commit('categories', categories)
            EventBus.$emit('categories-loaded')
          } catch (err) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${err}`)
          }
        })
        .catch(err => {
          // window.message(self.$i18n.t('errors.apiCommunication', [err]), 'red', 2500)
          Console.log(`API communication: ${err}`)
        })
    },

    loadPurchaseTimestamps () {
      var self = this

      Api.getPurchaseTimestamps()
        .then(resp => {
          if (typeof resp.status !== 'number' || resp.status !== 200) {
            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          store.commit('setPurchaseTimestamps', resp.data)
          EventBus.$emit('purchase-timestamps-updated')
        })
        .catch(err => {
          window.toast({
            text: self.$i18n.t('errors.apiCommunication'),
            color: 'red'
          })
          Console.error(`API communication: ${err}`)
        })
    }
  }
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
}

#app {
  font-family: 'DejaVu Sans', Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

#footer {
  height: 55px;
}

.st-heading {
    padding-left: 20px;
    height: 70px;
}
.st-menu {
    padding-right: 20px;
}
.st-display-right {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translate(0%, -50%);
}
.st-display-left {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translate(0%, -50%);
}
.st-version {
  font-size: .8em;
}
.st-copyright {
    font-size: .8em;
}
.message-panel {
  padding: 15px;
}
.message-panel p {
  margin: 0;
}
.message-panel .close-button {
  float: right;
}
</style>
