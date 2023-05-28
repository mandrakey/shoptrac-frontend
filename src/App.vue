<i18n src="@/lang/common.json"></i18n>
<i18n>
{
  "en": {
    "nav": {
      "settings": "Settings",
      "purchases": "Purchases",
      "statistics": "Statistics",
      "profile": "Profile",
      "admin_users": "User management",
      "logout": "Log out"
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
          <div id="navigation-menu" :class="['st-display-right', { 'w3-show': isLoggedIn }]">
            <router-link to="/" 
                :class="['w3-button', ($route.path === '/' ? 'background-primary-2' : 'w3-theme-dark')]">
              {{ $t('nav.purchases') }}
            </router-link>&nbsp;
            <router-link to="/settings"
                :class="['w3-button', ($route.path === '/settings' ? 'background-primary-2' : 'w3-theme-dark')]">
              {{ $t('nav.settings') }}
            </router-link>&nbsp;
            <router-link to="/statistics"
                :class="['w3-button', ($route.path === '/statistics' ? 'background-primary-2' : 'w3-theme-dark')]">
              {{ $t('nav.statistics') }}
            </router-link>&nbsp;
            <router-link to="/profile"
                :class="['w3-button', ($route.path === '/profile' ? 'background-primary-2' : 'w3-theme-dark')]">
              {{ $t('nav.profile') }}
            </router-link>&nbsp;
            <span style="display: none;" :class="[{ 'w3-show-inline-block': isAdmin }]">
              <router-link to="/admin/users"
                :class="['w3-button', ($route.path === '/admin/users' ? 'background-primary-2' : 'w3-theme-dark')]">
                {{ $t('nav.admin_users') }}
              </router-link>&nbsp;
            </span>
            &nbsp;&nbsp;
            <button class="w3-button w3-theme-dark" @click="onLogoutClicked()">
              {{ $t('nav.logout') }}
            </button>
          </div>
        </div>
    </div>

    <router-view id="router-view" />

    <div id="footer" class="w3-row w3-padding w3-theme w3-display-container">
        <div class="w3-third st-version">
            <p>Shoptrac {{appVersion}}</p>
        </div>
        <div class="w3-third st-copyright">
            <p class="w3-display-center">Copyright &copy; 2018-2023 shoptrac contributors</p>
        </div>
        <div class="w3-third w3-right-align st-display-right">
            <a href="https://github.com/mandrakey/shoptrac" target="_blank" rel="noopener">
                <img src="@/assets/img/github.png" alt="Find shoptrac on Github">
            </a>
        </div>
    </div>
  </div>
</template>

<script>
import Api from 'api'
import Console from '@/utils/Console'
import EventBus from '@/utils/EventBus'
import Session from '@/utils/Session'

import Venue from '@/model/Venue'
import Category from '@/model/Category'
import Shopper from '@/model/Shopper'
import User from '@/model/User'

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
    window.addEventListener('keyup', this.windowOnKeyUpHandler)
    EventBus.$on('session-change', this.recalculateIsLoggedIn)
    this.recalculateIsLoggedIn()
  },

  destroyed () {
    EventBus.$off('session-change', this.recalculateIsLoggedIn)
    window.removeEventListener('keyup', this.windowOnKeyUpHandler)
  },

  data () {
    return {
      isLoggedIn: false,
      isAdmin: false
    }
  },

  computed: {
    appVersion () { return window._APP_VERSION }
  },

  methods: {
    loadVenues () {
      Api.getVenues()
        .then(resp => {
          if (typeof resp.status !== 'number' || resp.status !== 200) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
            return
          }

          try {
            const venues = {}
            resp.data.forEach(e => {
              const v = Venue.fromObject(e)
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
      Api.getCategories()
        .then(resp => {
          if (typeof resp.status !== 'number' || resp.status !== 200) {
            // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
            return
          }

          try {
            const categories = {}
            resp.data.forEach(e => {
              const c = Category.fromObject(e)
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

    loadShoppers () {
      const self = this

      Api.getShoppers()
        .then(resp => {
          if (!(resp.data instanceof Array)) {
            throw new Error()
          }

          const shoppers = {}
          resp.data.forEach(row => {
            const s = Shopper.fromObject(row)
            shoppers[s._key] = s
          })
          store.commit('shoppers', shoppers)
          EventBus.$emit('shoppers-loaded')
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('errors.apiCommunication'),
            color: 'red'
          })
        })
    },

    loadPurchaseTimestamps () {
      const self = this

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
    },

    loadUser () {
      const self = this
      if (Session.getUser() !== null) {
        self.isAdmin = Session.getUser().level === 99
        return
      }

      Api.getProfile()
        .then(resp => {
          if (typeof resp !== 'object' || typeof resp.data !== 'object') {
            throw new Error('Failed to load user profile.')
          }

          const user = User.fromObject(resp.data)
          self.isAdmin = user.level === 99
          Session.setUser(user)
        })
        .catch(err => {
          Console.error(err)
          window.toast({
            text: self.$i18n.t('errors.failedToLoadUserProfile'),
            color: 'red'
          })
          self.onLogoutClicked()
        })
    },

    onLogoutClicked () {
      const self = this

      Api.getLogout()
        .then(() => {
          Session.setSessionId(null)
          Session.setRememberMeToken(null)
          EventBus.$emit('session-change')
          self.$router.push('/login')
        })
        .catch(() => {
          window.toast({
            color: 'red',
            text: self.$i18n.t('errors.apiCommunication')
          })
        })
    },

    recalculateIsLoggedIn () {
      this.isLoggedIn = Session.isLoggedIn()
      if (this.isLoggedIn) {
        this.loadUser()
        this.loadVenues()
        this.loadCategories()
        this.loadShoppers()
        this.loadPurchaseTimestamps()
      } else {
        if (this.$router.path !== '/login') {
          this.$router.push('/login')
        }
      }
    },

    windowOnKeyUpHandler (event) {
      if (event.altKey && event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            EventBus.$emit('focus-sum')
            break
          case 'd':
            EventBus.$emit('focus-date')
            break
          case 'v':
            EventBus.$emit('focus-venue')
            break
          case 'c':
            EventBus.$emit('focus-category')
            break
          case 'o':
            EventBus.$emit('focus-shopper')
            break
        }
      }
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

#navigation-menu {
  display: none;
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
.st-cursor-pointer {
    cursor: pointer;
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
