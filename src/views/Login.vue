<i18n src="@/lang/common.json"></i18n>
<i18n>
{
  "en": {
    "WelcomeToShoptrac": "Welcome to Shoptrac!",
    "Welcome::IntroText": "In order to use the application, you need to login. Please provide your username and password in the form below.",

    "Username": "Username",
    "Password": "Password",
    "Remember login on this device": "Remember login on this device",
    "Login": "Log in",
    "Logging in ...": "Logging in ...",

    "You need to provide a username": "You need to provide a username.",
    "You need to provide a password": "You need to provide a password.",
    "Login successful!": "Login successful!",
    "Failed to log in: Please confirm username and password.": "Failed to log in: Please confirm username and password."
  }
}
</i18n>

<template>
  <div class="w3-content w3-padding">
    <h2>{{ $t('WelcomeToShoptrac') }}</h2>
    <p>{{ $t('Welcome::IntroText') }}</p>

    <div class="w3-card w3-padding">
      <div class="w3-cell-row">
        <div class="w3-cell w3-cell-middle" style="width: 25%;">{{ $t('Username') }}:</div>
        <div class="w3-cell">
          <input type="text" class="w3-input" v-model="username" :placeholder="$t('Username')"
              @keyup.enter="onFormEnter()">
        </div>
      </div>
      <div class="w3-cell-row">
        <div class="w3-cell w3-cell-middle" style="width: 25%;">{{ $t('Password') }}:</div>
        <div class="w3-cell">
          <input type="password" class="w3-input" v-model="password" :placeholder="$t('Password')"
              @keyup.enter="onFormEnter()">
        </div>
      </div>
      <div class="w3-cell-row">
        <div class="w3-cell" style="width: 25%;">&nbsp;</div>
        <div class="w3-cell padding-top-15">
          <input class="w3-check" type="checkbox" v-model="rememberMe"> {{ $t('Remember login on this device') }}
        </div>
      </div>
      <div class="w3-cell-row w3-center">
        <div class="w3-cell w3-right-align">
          <br>
          <span :class="['w3-small', 'action', {'action-show': action !== ''}]">
            <img src="@/assets/img/spinner-24-primary.gif" alt="LDG"> {{ action }}
          </span>&nbsp;&nbsp;
          <button class="w3-button st-button-theme" @click="onLoginClicked()">{{ $t('Login') }}</button>
        </div>
      </div>
    </div>
    <br>&nbsp;
  </div>
</template>

<style scoped>
.action {
  display: none;
}
.action-show {
  display: inline-block;
}
.padding-top-15 {
  padding-top: 15px;
}
</style>

<script>
import Api from 'api'

import User from '@/model/User'
import Session from '@/utils/Session'
import EventBus from '@/utils/EventBus'

export default {
  data () {
    return {
      action: '',

      username: '',
      password: '',
      rememberMe: false
    }
  },

  methods: {
    onLoginClicked () {
      this.loginStep1()
    },

    onFormEnter () {
      this.loginStep1()
    },

    resetLoginData () {
      Session.setSessionId(null)
      Session.setRememberMeToken(null)
      Session.setUser(null)
    },

    loginStep1 () {
      const self = this
      if (self.username === '') {
        window.toast({
          color: 'yellow',
          text: self.$i18n.t('You need to provide a username')
        })
        return
      }
      if (self.password === '') {
        window.toast({
          color: 'yellow',
          text: self.$i18n.t('You need to provide a password')
        })
        return
      }

      self.action = self.$i18n.t('Logging in ...')
      Api.postLogin(self.username, self.password, self.rememberMe)
        .then(resp => {
          if (typeof resp.data !== 'object'
              || typeof resp.data.uuid !== 'string' || resp.data.uuid === '') {
            window.toast({
              color: 'red',
              text: self.$i18n.t('errors.apiCommunication')
            })
            return
          }

          Session.setSessionId(resp.data.uuid)
          if (typeof resp.data.remember_me_token === 'string' && resp.data.remember_me_token !== '') {
            Session.setRememberMeToken(resp.data.remember_me_token)
          }

          self.loginStep2()
        })
        .catch(err => {
          const msg = err.response.status === 401
            ? "Failed to log in: Please confirm username and password."
            : "errors.invalidApiResponse"
          self.cancelLogin(msg)
        })
    },

    loginStep2 () {
      const self = this

      Api.getProfile()
        .then(resp => {
          if (typeof resp !== 'object' || typeof resp.data !== 'object') {
            self.cancelLogin()
            return
          }
          
          try {
            Session.setUser(User.fromObject(resp.data))
          } catch (err) {
            self.cancelLogin()
            return
          }
          
          // Finish login
          this.action = ''
          EventBus.$emit('session-change')
          this.$router.push('/')
        })
        .catch(() => self.cancelLogin())
    },

    cancelLogin (err = null) {
      const errormsg = typeof err !== 'undefined' && err !== null ? err : "errors.invalidApiResponse"

      this.resetLoginData()
      this.action = ''
      window.toast({
        text: this.$i18n.t(errormsg),
        color: 'red'
      })
    }
  }
}
</script>
