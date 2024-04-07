<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
  <div :class="['w3-modal', { 'w3-show': showDialog }]">
    <div class="w3-modal-content w3-card">
      <div class="w3-theme w3-padding st-modal-header">
        {{ $t('Delete shopper') }}
      </div>

      <div class="w3-padding">
        <p>{{ $t('Delete shopper::Info1') }}</p>
        <p><shopper-list-item v-if="shopper !== null" :shopper="shopper" class="shopper-item" /></p>
        <p>{{ $t('Delete shopper::Info2') }}</p>
      </div>

      <div class="w3-padding st-modal-footer w3-row">
        <div class="w3-col w3-half w3-padding st-loading w3-text-theme">
          <div v-show="action !== ''">
            <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" alt="Loading">
            <div class="action">{{ action }}</div>
          </div>
        </div>

        <div class="w3-col w3-half w3-right-align">
          <button class="w3-button w3-small st-button-theme st-button-theme-hover"
              @click="onCancelClicked()">
            {{ $t('buttonlabels.cancel') }}
          </button>
          <button class="w3-button w3-small st-button-theme st-button-theme-hover"
              @click="onDeleteClicked()">
            {{ $t('buttonlabels.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.w3-modal-content {
    border-radius: 5px;
    overflow: hidden;
}

.st-loading {
    font-size: .8em;
}

.shopper-item {
    border: 1px solid #000;
    cursor: default;
}

.action-loading {
    float: left;
}

.action {
    padding-top: 3px;
    float: left;
}
</style>

<script>
import Api from 'api'

import Shopper from '@/model/Shopper'

import ShopperListItem from '@/components/ShopperListItem'

export default {
  components: {
    ShopperListItem
  },

  data() {
    return {
      showDialog: false,
      action: '',
      shopper: null
    }
  },

  methods: {
    show(shopper) {
      if (shopper instanceof Shopper) {
        this.shopper = Shopper.fromObject(shopper)
        this.showDialog = true
      }
    },

    onCancelClicked() {
      this.showDialog = false
      this.shopper = null
    },

    onDeleteClicked() {
      const self = this

      self.action = self.$i18n.t('Deleting shopper ...')
      Api.deleteShoppers(self.shopper)
        .then(() => {
          window.toast({
            text: self.$i18n.t('Shopper has been deleted'),
            color: 'green'
          })
          self.showDialog = false
          self.$emit('deleted', { shopper: self.shopper })
          self.shopper = null
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to delete shopper'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    }
  }
}
</script>
