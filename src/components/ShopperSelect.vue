<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
  <div class="w3-block">
    <div class="w3-cell-row st-select" @click="focus(null)">
      <div class="w3-cell w3-cell-middle" style="max-width: 32px;">
        <img class="st-shopper-avatar-32" v-if="selected.image !== ''" :src="`data:image/png;base64,${selected.image}`">
        <img class="st-shopper-avatar-32" v-else src="@/assets/img/image-solid.svg">
      </div>
      <div class="w3-cell w3-cell-bottom">
        <input type="text" class="w3-input w3-border-0" v-model="selectedName" ref="SelectedName"
            @keyup="onSelectedNameKeyUp($event)" @blur="blur($event)" @focus="focus($event)">
      </div>
    </div>
    <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showDropdown }]"
        @mouseenter="mouseInDropdown = true" @mouseleave="mouseInDropdown = false">
      <span v-for="s in Object.values(visibleShoppers)" :key="s._key">
        <a :class="['w3-button', 'w3-bar-item', { 'hovered-shopper': hoveredShopper === s._key }]"
            @click="selectByKey(s._key)">
          <img class="st-shopper-avatar-32" v-if="s.image !== ''" :src="`data:image/png;base64,${s.image}`">
          <img class="st-shopper-avatar-32" v-else src="@/assets/img/image-solid.svg">
            {{ s.name }}
        </a>
      </span>
    </div>
  </div>
</template>

<style scoped>
.button {
  min-height: 48px;
}

.hovered-shopper {
  background: #ccc;
}

.shopper-entry img {
  width: 32px;
  height: 32px;
  border-radius: 16px;
}
</style>

<script>
import EventBus from '@/utils/EventBus'

import Store from '@/store'

import Shopper from '@/model/Shopper'

export default {
  props: {
    value: {
      type: Number,
      default: -1
    },
    'allow-empty': {
      type: Boolean,
      default: false
    }
  },

  computed: {
    SelectedName: function() {
      const e = this.$refs['SelectedName']
      return e !== null && typeof e === 'object' ? e : null
    },

    shoppers() {
      const stored = Store.state.shoppers
      
      return this.allowEmpty
        ? { ...stored, '-1': this.createDummyShopper() }
        : stored
    },

    visibleShoppers() {
      const self = this

      if (self.selectedName === '' || self.selectedName === self.selected.name) {
        return self.shoppers
      }

      const map = {}
      for (const s of Object.values(self.shoppers)) {
        if (s.name.toLowerCase().includes(self.selectedName.toLowerCase())) {
          map[s._key] = s
        }
      }
      return map
    }
  },

  data() {
    return {
      showDropdown: false,
      mouseInDropdown: false,
      hoveredShopper: '',
      selectedName: '',
      selected: null
    }
  },

  created() {
    this.selected = this.createDummyShopper()
    this.selectedName = this.selected.name
  },
  
  mounted() {
    EventBus.$on('shoppers-loaded', this.preselect)
    this.preselect()
  },

  destroyed() {
    EventBus.$off('shoppers-loaded', this.preselect)
  },

  methods: {
    focus(event) {
      if (typeof event !== 'object' || event === null || event.type !== 'focus') {
        if (this.selectedName !== null) {
          this.SelectedName.focus()
        }
      } else {
        this.showDropdown = true
      }
    },

    blur(event) {
      if (typeof event !== 'object' || event === null || event.type !== 'blur') {
        if (this.selectedName !== null) {
          this.SelectedName.blur()
        }
      } else if (!this.mouseInDropdown) {
        window.setTimeout(() => this.showDropdown = false, 200)
      }
    },

    selectByKey(key) {
      if (typeof this.shoppers[key] === 'object') {
        this.selected = this.shoppers[key]
        this.selectedName = this.selected.name
        this.$emit('selected', { shopper: this.selected._key })
        this.showDropdown = false
      }
    },

    preselect() {
      const keys = Object.keys(this.shoppers)
      if (this.allowEmpty) {
          this.selectByKey('-1')
      } else if (keys.length > 0) {
        this.selectByKey(keys[0])
      }
    },

    onSelectedNameKeyUp(event) {
      this.showDropdown = true
      switch (event.key) {
        case 'ArrowDown':
          this.changeHoveredShopper(1)
          break
        
        case 'ArrowUp':
          this.changeHoveredShopper(-1)
          break
        
        case 'Enter':
          this.selectByKey(this.hoveredShopper)
          this.hoveredShopper = ''
          break
        
        case 'Escape':
          this.selectedName = this.selected.name
          this.hoveredShopper = ''
          this.showDropdown = false
          this.blur()
      }
    },

    changeHoveredShopper(direction) {
      const visibleKeys = Object.keys(this.visibleShoppers)

      if (typeof this.hoveredShopper !== 'string' || this.hoveredShopper === '') {
        this.hoveredShopper = direction === 1
          ? visibleKeys[0]
          : visibleKeys[visibleKeys.length - 1]
      } else {
        let idx = 0
        for (; idx < visibleKeys.length; ++idx) {
          if (visibleKeys[idx] === this.hoveredShopper) {
            idx = idx + direction
            break
          }
        }

        if (idx < 0) {
          idx = visibleKeys.length - 1
        }
        if (idx === visibleKeys.length) {
          idx = 0
        }
        this.hoveredShopper = visibleKeys[idx]
      }
    },

    createDummyShopper() {
      const s = new Shopper()
      s._key = '-1'
      s.name = this.$i18n.t('All shoppers')
      return s
    }
  }
}
</script>
