<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.json"></i18n>

<template>
  <div class="w3-row w3-padding">
    <h2>{{ $t("settings") }}</h2>
    <p>{{ $t("settingsDescription") }}</p>

    <div class="w3-border w3-border-black">
      <div class="w3-bar background-primary-0">
        <button :class="['w3-button', 'w3-bar-item', { 'background-primary-1': tab === 'venues' }]"
            @click="tab = 'venues'">
          {{ $t('Venues') }}
        </button>
        <button :class="['w3-button', 'w3-bar-item', { 'background-primary-1': tab === 'categories' }]"
            @click="tab = 'categories'">
          {{ $t('Categories') }}
        </button>
        <button :class="['w3-button', 'w3-bar-item', { 'background-primary-1': tab === 'shoppers' }]"
            @click="tab = 'shoppers'">
          {{ $t('Shoppers') }}
        </button>
      </div>
      
      <tab-venues v-show="tab === 'venues'" />
      <tab-categories v-show="tab === 'categories'" />
      <tab-shoppers v-show="tab === 'shoppers'" />
    </div>
  </div>
</template>

<script>
import TabVenues from '@/components/settings/TabVenues'
import TabCategories from '@/components/settings/TabCategories'
import TabShoppers from '@/components/settings/TabShoppers'

export default {
  components: {
    TabVenues,
    TabCategories,
    TabShoppers
  },

  data() {
    return {
      tab: 'venues'
    }
  }
}
</script>