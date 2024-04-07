<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/profile.json"></i18n>

<template>
  <div class="w3-content w3-padding">
    <h2>{{ $t('Profile Settings') }}</h2>

    <div class="w3-border">
      <div class="w3-bar background-primary-0">
        <button :class="['w3-bar-item', 'w3-button', { 'background-primary-1': tab === 'profile' }]"
            @click="tab = 'profile'">
          {{ $t('Change profile data') }}
        </button>
        <button :class="['w3-bar-item', 'w3-button', { 'background-primary-1': tab === 'password' }]"
            @click="tab = 'password'">
          {{ $t('Change your password') }}
        </button>
      </div>

      <div v-if="tab === 'profile'" class="w3-padding form">
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            {{ $t('Full name') }}
          </div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="fullname" @keyup.enter="onUpdateProfile()">
          </div>
        </div>
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            {{ $t('Email address') }}
          </div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="email" @keyup.enter="onUpdateProfile()">
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            &nbsp;
          </div>
          <div class="w3-cell w3-right-align">
            <span :class="['w3-small', 'action', {'action-show': action !== ''}]">
              <img src="@/assets/img/spinner-24-primary.gif" alt="LDG"> {{ action }}
            </span>&nbsp;&nbsp;
            <button class="w3-button st-button-theme" @click="onUpdateProfile()">{{ $t('Update Profile') }}</button>
          </div>
        </div>
      </div>

      <div v-if="tab === 'password'" class="w3-padding form">
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            {{ $t('Current Password') }}
          </div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="currentPassword" :type="showPasswords ? 'text' : 'password'"
                @keyup.enter="onUpdatePassword()">
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            {{ $t('New Password') }}
          </div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="newPassword" :type="showPasswords ? 'text' : 'password'"
                @keyup.enter="onUpdatePassword()">
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            {{ $t('Confirmation') }}
          </div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="confirmation" :type="showPasswords ? 'text' : 'password'"
                @keyup.enter="onUpdatePassword()">
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            &nbsp;
          </div>
          <div class="w3-cell">
            <input class="w3-check" type="checkbox" v-model="showPasswords"> {{ $t('Show passwords') }}
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" style="width: 150px;">
            &nbsp;
          </div>
          <div class="w3-cell w3-right-align">
            <span :class="['w3-small', 'action', {'action-show': action !== ''}]">
              <img src="@/assets/img/spinner-24-primary.gif" alt="LDG"> {{ action }}
            </span>&nbsp;&nbsp;
            <button class="w3-button st-button-theme" @click="onUpdatePassword()">{{ $t('Update Password') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.action {
  display: none;
}
.action-show {
  display: inline-block;
}
div.w3-content {
  margin-bottom: 10px;
}

div.form {
  margin-top: 10px;
}
div.form > div.w3-cell-row {
  margin-bottom: 10px;
}
</style>

<script>
import Api from 'api'

export default {
  data () {
    return {
      tab: 'profile',
      action: '',

      fullname: '',
      email: '',
      
      showPasswords: false,
      currentPassword: '',
      newPassword: '',
      confirmation: ''
    }
  },

  mounted () {
    this.loadProfileData()
  },

  methods: {
    loadProfileData () {
      const self = this

      self.action = self.$i18n.t('Loading profile data ...')
      Api.getProfile()
        .then(resp => {
          if (typeof resp !== 'object' || typeof resp.data !== 'object'
              || typeof resp.data._key !== 'string' || typeof resp.data.name !== 'string' 
              || typeof resp.data.email !== 'string') {
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          self.fullname = resp.data.name
          self.email = resp.data.email
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('errors.apiCommunication')
          })
        })
        .finally(() => self.action = '')
    },

    onUpdatePassword () {
      const self = this

      const problems = []
      if (self.currentPassword === '') {
        problems.push(self.$i18n.t('Current Password'))
      }
      if (self.newPassword === '') {
        problems.push(self.$i18n.t('New Password'))
      }
      if (self.confirmation !== self.newPassword) {
        problems.push(self.$i18n.t('Confirmation'))
      }

      if (problems.length > 0) {
        window.toast({
          text: `${self.$i18n.t('The following problems exist with the entered information:')}<br><br><tt>- ${problems.join('<br>- ')}</tt>`,
          color: 'yellow',
          timeout: 0
        })
        return
      }

      // Execute
      self.action = self.$i18n.t('Updating password ...')
      Api.postProfileUpdatePassword(self.currentPassword, self.newPassword, self.confirmation)
        .then(() => {
          window.toast({
            text: self.$i18n.t('Password has been updated successfully.'),
            color: 'green'
          })
          self.currentPassword = ''
          self.newPassword = ''
          self.confirmation = ''
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to update the password.'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    onUpdateProfile () {
      const self = this

      const problems = []
      if (self.fullname === '') {
        problems.push(self.$i18n.t('Full name'))
      }
      if (self.email === '') {
        problems.push(self.$i18n.t('Email address'))
      }
      if (problems.length > 0) {
        window.toast({
          text: `${self.$i18n.t('The following problems exist with the entered information:')}<br><br><tt>- ${problems.join('<br>- ')}</tt>`,
          color: 'yellow',
          timeout: 0
        })
        return
      }

      // Execute
      self.action = self.$i18n.t('Updating profile ...')
      const data = { name: self.fullname, email: self.email }
      Api.patchProfile(data)
        .then(() => {
          window.toast({
            text: self.$i18n.t('Profile has been updated successfully.'),
            color: 'green'
          })
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to update the profile.'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    }
  }
}
</script>
