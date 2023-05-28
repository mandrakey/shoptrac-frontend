<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
  <div :class="['w3-row', 'shopper-container', { 'w3-theme-l1': selected }]"
      @click="$emit('click', { shopper: shopper })">
    <div :class="['w3-col', 'l2 m2']">
      <img v-if="shopper.image !== ''" :src="`data:image/png;base64,${shopper.image}`" class="shopper-image" :alt="t('shopper')">
      <img v-else src="@/assets/img/image-solid.svg" class="shopper-image" :alt="t('shopper')">
    </div>
    <div :class="['w3-col', selected ? 'l8 m8' : 'l10 m10', 'shopper-name']">
      {{ shopper.name }}
    </div>
    <div v-show="selected" class="w3-col l2 m2 action-buttons">
      <button class="w3-button background-primary-0 hover-primary-0 w3-round display-inline-block"
          @click="onEditClicked()">
        <img src="@/assets/img/pencil16-white.png" :alt="$t('edit')" :title="$t('Edit this item')">
      </button>
      <button class="w3-button background-primary-0 hover-primary-0 w3-round display-inline-block"
          @click="onDeleteClicked()">
        <img src="@/assets/img/remove16-white.png" :alt="$t('delete')" :title="$t('Delete this item')">
      </button>
    </div>
  </div>
</template>

<style scoped>
.shopper-container {
  border-bottom: 1px solid #333;
  padding: 5px;
  cursor: pointer;
}

.shopper-name {
  padding-top: 15px;
}

.shopper-image {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.action-buttons {
  padding-top: 5px;
  text-align: right;
}

.action-buttons button {
  margin-right: 5px;
}
</style>

<script>
import Shopper from '@/model/Shopper'

export default {
  props: {
    shopper: {
      type: Shopper,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onEditClicked() {
      this.$emit('edit')
    },

    onDeleteClicked() {
      this.$emit('delete')
    }
  }
}
</script>
