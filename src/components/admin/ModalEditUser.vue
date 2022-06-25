<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/admin.users.json"></i18n>

<template>
  <div :class="['w3-modal', { 'w3-show': showDialog }]">
    <div class="w3-modal-content w3-card">
      <div class="w3-theme w3-padding st-modal-header">
        {{ $t(mode === 'add' ? 'Add new user' : 'Edit user') }}
      </div>

      <div class="w3-padding w3-form">
        <div v-if="mode === 'edit'" class="w3-cell-row" style="padding-top: 5px;">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('UUID') }}</div>
          <div class="w3-cell"><code>{{ user._key }}</code></div>
        </div>
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Username') }}</div>
          <div class="w3-cell">
            <input type="text" class="w3-input w3-border" v-model="user.username" :disabled="mode !== 'add'">
          </div>
        </div>
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Name') }}</div>
          <div class="w3-cell">
            <input type="text" class="w3-input w3-border" v-model="user.name">
          </div>
        </div>
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Email address') }}</div>
          <div class="w3-cell">
            <input type="text" class="w3-input w3-border" v-model="user.email">
          </div>
        </div>
        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Level') }}</div>
          <div class="w3-cell">
            <select class="w3-input w3-border" v-model="user.level">
              <option v-for="lvl of Object.keys($t('userlevels'))" :key="lvl" :value="lvl">
                {{ $t(`userlevels.${lvl}`) }}
              </option>
            </select>
          </div>
        </div>

        <div class="w3-cell-row" v-show="mode === 'edit'">
          <div class="w3-cell" :style="[{ 'width': formLabelWidth }]">&nbsp;</div>
          <div class="w3-cell">
            <span style="cursor: pointer;" @click.stop="changePassword = !changePassword">
              <input type="checkbox" class="w3-checkbox" v-model="changePassword"> 
              {{ $t('Change the password') }} 
            </span>
          </div>
        </div>
        <div class="w3-cell-row" v-show="mode === 'add' || changePassword">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Password') }}</div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="password"
                :type="showPasswords ? 'text' : 'password'">
          </div>
        </div>
        <div class="w3-cell-row" v-show="mode === 'add' || changePassword">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">&nbsp;</div>
          <div class="w3-cell">
            <button class="w3-button st-button-theme w3-tiny" @click="onRandomPasswordClicked()">
              {{ $t('Generate a random password') }}
            </button>
          </div>
        </div>
        <div class="w3-cell-row" v-show="mode === 'add' || changePassword">
          <div class="w3-cell w3-cell-middle" :style="[{ 'width': formLabelWidth }]">{{ $t('Confirmation') }}</div>
          <div class="w3-cell">
            <input class="w3-input w3-border" v-model="confirmation"
                :type="showPasswords ? 'text' : 'password'">
          </div>
        </div>
        <div class="w3-cell-row" v-show="mode === 'add' || changePassword">
          <div class="w3-cell" :style="[{ 'width': formLabelWidth }]">&nbsp;</div>
          <div class="w3-cell">
            <span style="cursor: pointer;" @click.stop="showPasswords = !showPasswords">
              <input type="checkbox" class="w3-checkbox" v-model="showPasswords"> 
              {{ $t('Show the passwords') }}
            </span>
          </div>
        </div>
      </div>

      <div class="w3-padding st-modal-footer w3-cell-row">
        <div class="w3-cell w3-cell-middle w3-padding w3-text-theme">
              <div v-show="action !== ''">
                  <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" alt="loading">
                  <span class="action">{{ action }}</span>
              </div>
          </div>

          <div class="w3-cell w3-right-align">
            <span v-if="mode === 'edit'">
              <button class="w3-button w3-small st-button-theme w3-red st-button-theme-hover"
                  @click="onDeleteClicked()">
                {{ $t('buttonlabels.delete') }}
              </button>&nbsp;
            </span>
            <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                @click="onCancelClicked()">{{ $t('buttonlabels.cancel') }}</button>
            <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                @click="onSaveClicked()">{{ $t('buttonlabels.save') }}</button>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from 'api'

import User from '@/model/User'

export default {
  name: 'ModalEditUser',

  data () {
    return {
      formLabelWidth: '120px',

      showDialog: false,
      mode: 'add',
      user: new User(),
      
      changePassword: false,
      showPasswords: false,
      password: '',
      confirmation: '',

      action: ''
    }
  },

  methods: {
    showAdd () {
      this.user = new User()
      this.password = ''
      this.confirmation = ''
      this.showPasswords = false
      this.mode = 'add'
      this.showDialog = true
    },

    showEdit (user) {
      this.user = User.copyOf(user)
      this.password = ''
      this.confirmation = ''
      this.showPasswords = false
      this.mode = 'edit'
      this.showDialog = true
    },

    close () {
      this.user = new User()
      this.mode = 'add'
      this.showDialog = false
    },

    onRandomPasswordClicked () {
      const chars = 'CsJXNFIo!3MtQPGvpwkEjm9huBqR$*D7leS+2xH0Wgzb1K68da4ZfVLyTr#YA5-Uc&iOn'
      let res = ''
      for (let i = 0; i < 12; ++i) {
        const r = parseInt(Math.random() * 100) % chars.length
        res += chars[r]
      }
      
      this.password = res
      this.confirmation = res
      this.showPasswords = true
    },

    onCancelClicked () {
      this.close()
    },

    onSaveClicked () {
      if (this.mode === 'add') {
        this.addUser()
      } else {
        this.saveUser()
      }
    },

    addUser () {
      const self = this

      try {
        self.validateForm()
      } catch (_) {
        return
      }

      const password = self.password !== '' ? self.password : null
      const confirmation = self.confirmation !== '' ? self.confirmation : null

      self.action = 'Adding user ...'
      Api.putUsers(self.user, password, confirmation)
        .then(resp => {
          if (typeof resp !== 'object' || typeof resp.data !== 'object') {
            throw new Error('No response data present.')
          }
          
          const user = User.fromObject(resp.data)
          self.$emit('added', { user: user })
          self.close()
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to add new user.'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    saveUser () {
      const self = this

      try {
        self.validateForm()
      } catch (_) {
        return
      }

      const newPassword = self.password !== '' ? self.password : null
      const confirmation = self.confirmation !== '' ? self.confirmation : null

      self.action = self.$i18n.t('Updating user ...')
      Api.patchUsers(self.user, newPassword, confirmation)
        .then(() => {
          self.$emit('edited', { user: self.user })
          self.close()
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to update user.'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    onDeleteClicked () {
      const self = this
      if (self.mode !== 'edit') {
        return
      }

      const yn = confirm(self.$i18n.t('Delete user::Question'))
      if (yn !== true) {
        return
      }

      self.action = self.$i18n.t('Deleting user ...')
      Api.deleteUsers(self.user._key)
        .then(() => {
          self.$emit('deleted', { user: self.user })
          self.close()
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to delete user.'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    validateForm () {
      const problems = []
      if (this.user.name === '') {
        problems.push(this.$i18n.t('Name'))
      }
      if (this.user.username === '') {
        problems.push(this.$i18n.t('Username'))
      }
      if (this.user.email === '') {
        problems.push(this.$i18n.t('Email address'))
      }
      if (this.password === '' && (this.mode === 'add' || this.changePassword)) {
        problems.push(this.$i18n.t('Password'))
      }
      if (this.confirmation !== this.password && (this.mode === 'add' || this.changePassword)) {
        problems.push(this.$i18n.t('Confirmation'))
      }
      if (problems.length > 0) {
        window.toast({
          text: `${this.$i18n.t('The following problems exist with the entered information:')}:<br>- ${problems.join('<br>- ')}`,
          color: 'yellow',
          timeout: 0
        })
        throw new Error('Entered information is not valid.')
      }
    }
  }
}
</script>
