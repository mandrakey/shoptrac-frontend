<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
  <div :class="['w3-modal', { 'w3-show': showDialog }]">
    <div class="w3-modal-content w3-card">
      <div class="w3-theme w3-padding st-modal-header">
        {{ $t(mode === 'edit' ? 'Edit shopper' : 'Add shopper') }}
      </div>

      <form class="w3-form">
      <div class="w3-padding">

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle w3-padding" style="width: 25%;">
            {{ $t('Name') }}
          </div>
          <div class="w3-cell">
            <input type="text" class="w3-input" v-model="shopper.name">
          </div>
        </div>

        <div class="w3-cell-row">
          <div class="w3-cell w3-cell-middle w3-padding" style="width: 25%;">
            {{ $t('Image') }}
          </div>
          <div class="w3-cell">
            <input type="file" class="file-input" ref="FileInput" @change="onFileInputChanged($event)">
            <img :src="`data:image/png;base64,${shopper.image}`" class="w3-border shopper-image">
            <button class="w3-button st-button-theme st-button-theme-hover w3-small display-inline-block"
                @click="onSelectImageClicked()">
              {{ $t('Select image') }}
            </button>
            <span v-show="shopper.image !== ''">
              &nbsp;
              <button class="w3-button st-button-theme w3-red w3-hover-red w3-small display-inline-block"
                  @click="onRemoveImageClicked()">
                {{ $t('Remove image') }}
              </button>
            </span>
          </div>
        </div>

      </div>
      </form>

      <div class="w3-padding st-modal-footer w3-row">
        <div class="w3-col w3-half w3-padding st-loading w3-text-theme">
          <div v-show="action !== ''">
            <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" :alt="$t('loading')">
            <div class="action">{{ action }}</div>
          </div>
        </div>

        <div class="w3-col w3-half w3-right-align">
          <button class="w3-button w3-small st-button-theme st-button-theme-hover" @click="onCancelClicked()">
            {{ $t('buttonlabels.cancel') }}
          </button>
          <button class="w3-button w3-small st-button-theme st-button-theme-hover" @click="onSaveClicked()">
            {{ $t('buttonlabels.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopper-image {
    width: 64px;
    height: 64px;
    border-radius: 32px;
    margin-right: 10px;
}

.file-input {
    display: none;
}

.st-loading {
    font-size: .8em;
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

export default {
  data() {
    return {
      showDialog: false,
      mode: 'add',
      action: '',
      shopper: new Shopper()
    }
  },

  computed: {
    fileInput: function() {
      const e = this.$refs['FileInput']
      return typeof e === 'object' && e !== null ? e : null
    }
  },

  methods: {
    show(mode, shopper = null) {
      if (!['add', 'edit'].includes(mode)) {
        return
      }

      if (mode === 'edit') {
        if (!(shopper instanceof Shopper)) {
          throw new Error('No valid shopper supplied for editing')
        }
        this.shopper = Shopper.fromObject(shopper)
      }

      this.mode = mode
      this.showDialog = true
    },

    onSelectImageClicked() {
      if (this.fileInput === null) {
        return
      }
      this.fileInput.click()
    },

    onFileInputChanged(event) {
      const self = this

      if (typeof event.target !== 'object' || !(event.target.files instanceof FileList)
          || event.target.files.length <= 0) {
        return
      }
      
      const file = event.target.files[0]
      const rdr = new FileReader()
      rdr.onload = e => {
        if (typeof e.target !== 'object' || typeof e.target.result !== 'string') {
          window.toast({
            text: self.$i18n.t('Failed to load image'),
            color: 'red'
          })
          return
        }
        self.shopper.image = btoa(e.target.result)
      }
      rdr.readAsBinaryString(file)
    },

    onRemoveImageClicked() {
      this.shopper.image = ''
    },

    onCancelClicked() {
      this.shopper = new Shopper()
      this.action = ''
      this.showDialog = false
    },

    onSaveClicked() {
      try {
        this.validateData()
      } catch (err) {
        window.toast({
          text: `${this.$i18n.t('Please correct the following issues')}<br><br><tt>${err}</tt>`,
          color: 'yellow'
        })
        return
      }

      if (this.mode === 'add') {
        this.doAddShopper()
      } else {
        this.doUpdateShopper()
      }
    },

    doAddShopper() {
      const self = this

      self.action = self.$i18n.t('Adding shopper ...')
      Api.putShoppers(self.shopper)
        .then(resp => {
          const s = Shopper.fromObject(resp.data)
          self.$emit('added', { shopper: s })
          self.shopper = new Shopper()
          self.showDialog = false

          window.toast({
            text: self.$i18n.t('Shopper has been added'),
            color: 'green'
          })
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('errors.apiCommunication'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    doUpdateShopper() {
      const self = this

      self.action = self.$i18n.t('Updating shopper ...')
      Api.patchShoppers(self.shopper)
        .then(() => {
          self.$emit('edited', { shopper: Shopper.fromObject(self.shopper) })
          self.shopper = new Shopper()
          self.showDialog = false

          window.toast({
            text: self.$i18n.t('Shopper has been updated'),
            color: 'green'
          })
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('errors.apiCommunication'),
            color: 'red'
          })
        })
        .finally(() => self.action = '')
    },

    validateData() {
      if (this.shopper.name === '') {
        throw new Error('Please enter a shopper name')
      }
    }
  }
}
</script>
