<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
  <div>
    <modal-edit-shopper ref="ModalEditShopper" @added="onFinishAddShopper($event)" @edited="onFinishEditShopper($event)" />
    <modal-delete-shopper ref="ModalDeleteShopper" @deleted="onFinishDeleteShopper($event)" />

    <div class="w3-padding">
      <button class="w3-button st-button-theme w3-small" @click="onBeginAddShopper()">
        {{ $t('Add shopper') }}
      </button>
    </div>

    <div v-show="loading" class="w3-center">
      <img src="@/assets/img/spinner-48-primary.gif" alt="Loading shoppers ..." />
    </div>
    <div v-show="!loading" class="shopper-list-box">
      <p v-show="shoppers.length === 0" class="w3-padding">
        {{ $t('No shoppers found') }}
      </p>
      
      <shopper-list-item v-for="s in shoppers" :key="s._key" :shopper="s" :selected="selected === s._key"
          @click="onShopperClicked(s)" @edit="onBeginEditShopper(s)" @delete="onBeginDeleteShopper(s)" />

      <p class="w3-tiny w3-right-align shopper-count"><strong>{{ shoppers.length }} {{ $t('Shoppers') }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.shopper-list-box {
  border-top: 1px solid #333;
}

.shopper-count {
  padding-right: 10px;
}
</style>

<script>
import Api from 'api'
import Store from '@/store'

import Shopper from '@/model/Shopper'

import ShopperListItem from '@/components/ShopperListItem'
import ModalEditShopper from '@/components/settings/ModalEditShopper'
import ModalDeleteShopper from '@/components/settings/ModalDeleteShopper'

export default {
  components: {
    ShopperListItem,
    ModalEditShopper,
    ModalDeleteShopper
  },

  data() {
    return {
      loading: false,
      shoppers: [],
      selected: null
    }
  },

  computed: {
    modalEditShopper: function() {
      const e = this.$refs['ModalEditShopper']
      return e !== null && typeof e === 'object' ? e : null
    },
    
    modalDeleteShopper: function() {
      const e = this.$refs['ModalDeleteShopper']
      return e !== null && typeof e === 'object' ? e : null
    }
  },

  mounted() {
    this.loadShoppers()
  },

  methods: {
    loadShoppers() {
      const self = this

      self.loading = true
      Api.getShoppers()
        .then(resp => {
          if (!(resp.data instanceof Array)) {
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          self.shoppers = resp.data.map(row => Shopper.fromObject(row))
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to load shoppers'),
            color: 'red'
          })
        })
        .finally(() => self.loading = false)
    },
    
    onShopperClicked(shopper) {
      if (!(shopper instanceof Shopper)) {
        return
      }

      const key = shopper._key
      this.selected = this.selected === key ? null : key
    },

    onBeginAddShopper() {
      const modal = this.modalEditShopper
      if (modal !== null) {
        modal.show('add', null)
      }
    },

    onFinishAddShopper(event) {
      if (!(event.shopper instanceof Shopper)) {
        return
      }

      this.shoppers.push(event.shopper)
      this.commitShoppers()
    },

    onBeginEditShopper(shopper) {
      if (this.modalEditShopper !== null) {
        this.modalEditShopper.show('edit', shopper)
      }
    },

    onFinishEditShopper(event) {
      if (!(event.shopper instanceof Shopper)) {
        return
      }

      for (const i in this.shoppers) {
        let s = this.shoppers[i]
        if (s._key === event.shopper._key) {
          s.name = event.shopper.name
          s.image = event.shopper.image
          this.commitShoppers()
          return
        }
      }
    },

    onBeginDeleteShopper(shopper) {
      if (!(shopper instanceof Shopper)) {
        return
      }

      if (this.modalDeleteShopper !== null) {
        this.modalDeleteShopper.show(shopper)
      }
    },

    onFinishDeleteShopper(event) {
      if (!(event.shopper instanceof Shopper)) {
        return
      }

      this.shoppers = this.shoppers.filter(s => s._key !== event.shopper._key)
      this.commitShoppers()
      if (this.selected === event.shopper._key) {
        this.selected = null
      }
    },

    commitShoppers() {
      Store.commit('shoppers', this.shoppers)
    }
  }
}
</script>
