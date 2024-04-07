<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/admin.users.json"></i18n>

<template>
  <div class="w3-container w3-padding">
    <modal-edit-user ref="ModalEditUser"
        @added="onModalEditUserAdded($event)"
        @edited="onModalEditUserEdited($event)"
        @deleted="onModalEditUserDeleted($event)" />

    <h2>{{ $t('Manage users') }}</h2>

    <div v-show="loadingUsers" class="w3-center">
      <img src="@/assets/img/spinner-48-primary.gif" alt="LDG"><br>
      <strong>{{ $t('Loading users ...') }}</strong>
    </div>
    <div v-show="!loadingUsers">
      <p>
        <button class="w3-button st-button-theme" @click="onAddUserClicked()">{{ $t('Add new user') }}</button>
      </p>

      <table class="w3-table w3-striped st-table">
        <caption>{{ $t('List of existing users') }}</caption>
        <thead>
          <tr>
            <th scope="title">{{ $t('Username') }}</th>
            <th scope="title">{{ $t('Name') }}</th>
            <th scope="title">{{ $t('Email address') }}</th>
            <th scope="title">{{ $t('Level') }}</th>
          </tr>
          <tr>
            <th scope="filter">
              <input class="w3-input w3-border w3-tiny" type="text" v-model="usersFilter.username"
                  @keyup.enter="filterUsers()">
            </th>
            <th scope="filter">
              <input class="w3-input w3-border w3-tiny" type="text" v-model="usersFilter.name"
                  @keyup.enter="filterUsers()">
            </th>
            <th scope="filter">
              <input class="w3-input w3-border w3-tiny" type="text" v-model="usersFilter.email"
                  @keyup.enter="filterUsers()">
            </th>
            <th scope="filter">
              <select class="w3-input w3-border w3-tiny" v-model="usersFilter.level" @change="filterUsers()">
                <option :value="null">{{ $t('Any') }}</option>
                <option :value="0">{{ $t('User') }}</option>
                <option :value="99">{{ $t('Administrator') }}</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in visibleUsers" :key="user._key" class="clickable hoverable"
              @click="onEditUserClicked(user)">
            <td>{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ $t(`userlevels.${user.level}`) }}</td>
          </tr>
        </tbody>
      </table>
      
      <p>
        <button class="w3-button st-button-theme" @click="onAddUserClicked()">{{ $t('Add new user') }}</button>
      </p>
    </div>
  </div>
</template>

<script>
import Api from 'api'

import ModalEditUser from '@/components/admin/ModalEditUser'

import User from '@/model/User'

export default {
  components: {
    ModalEditUser
  },

  data () {
    return {
      loadingUsers: true,
      users: [],
      usersFilter: {
        username: '',
        name: '',
        email: '',
        level: null
      },
      visibleUsers: []
    }
  },

  mounted () {
    this.loadUsers()
  },

  methods: {
    loadUsers () {
      const self = this

      self.loadingUsers = true
      self.users = []
      Api.getUsers()
        .then(resp => {
          if (typeof resp !== 'object' || typeof resp.data !== 'object' || !(resp.data instanceof Array)) {
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          const users = []
          for (const o of resp.data) {
            const user = User.fromObject(o)
            users.push(user)
          }
          self.users = users
          self.filterUsers()
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to load users'),
            color: 'red'
          })
        })
        .finally(() => self.loadingUsers = false)
    },

    filterUsers () {
      const self = this

      const username = self.usersFilter.username.toLowerCase()
      const name = self.usersFilter.name.toLowerCase()
      const email = self.usersFilter.email.toLowerCase()
      const level = self.usersFilter.level
      self.visibleUsers = self.users.filter(user => {
        let visible = true
        if (username !== '' && user.username.toLowerCase().indexOf(username) === -1) {
          visible = false
        }
        if (name !== '' && user.name.toLowerCase().indexOf(name) === -1) {
          visible = false
        }
        if (email !== '' && user.email.toLowerCase().indexOf(email) === -1) {
          visible = false
        }
        if (level !== null && user.level !== level) {
          visible = false
        }

        return visible
      })
      self.sortUsers()
    },

    sortUsers () {
      this.visibleUsers = this.visibleUsers.sort((a, b) => {
        if (a.name === b.name) {
          return 0
        }
        return a.name < b.name ? -1 : 1
      })
    },

    onAddUserClicked () {
      this.$refs['ModalEditUser'].showAdd()
    },

    onModalEditUserAdded (event) {
      if (typeof event !== 'object'
          || typeof event.user !== 'object' || !(event.user instanceof User)) {
        return
      }

      window.toast({
        text: this.$i18n.t('The new user account has been added.'),
        color: 'green'
      })
      this.users.push(event.user)
      this.filterUsers()
    },

    onEditUserClicked (user) {
      try {
        this.$refs['ModalEditUser'].showEdit(user)
      } catch (_) {
        window.toast({
          text: this.$i18n.t('Failed to open user for editing.'),
          color: 'red'
        })
      }
    },

    onModalEditUserEdited (event) {
      if (typeof event !== 'object'
          || typeof event.user !== 'object' || !(event.user instanceof User)) {
        return
      }

      window.toast({
        text: this.$i18n.t('The user account has been updated.'),
        color: 'green'
      })
      this.users = this.users.filter(user => user._key !== event.user._key)
      this.users.push(event.user)
      this.filterUsers()
    },

    onModalEditUserDeleted (event) {
      if (typeof event !== 'object'
          || typeof event.user !== 'object' || !(event.user instanceof User)) {
        return
      }

      window.toast({
        text: this.$i18n.t('The user account has been deleted.'),
        color: 'green'
      })
      this.users = this.users.filter(user => user._key !== event.user._key)
      this.filterUsers()
    }
  }
}
</script>
