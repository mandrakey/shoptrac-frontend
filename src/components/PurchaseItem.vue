<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "deleteThisItem": "Delete this item",
        "editThisItem": "Edit this item"
    }
}
</i18n>

<template>
    <div :class="['w3-row', 'purchase-container', { 'w3-theme-l1': selected }]"
        @click="$emit('click', { purchase: purchase })">
        <div class="w3-col l2 m2">
            <img v-if="venueImage !== ''" :src="venueImage" :alt="`${venueName} logo`">
            <span v-else>&nbsp;</span> <!-- put default image here -->
        </div>
        <div :class="['w3-col', selected ? 'l6 m5' : 'l8 m9']">
            <div class="w3-row">
                <div class="w3-col l10 m9 purchase-venue">{{ venueName }}</div>
                <div class="w3-col l2 m3 purchase-date">{{ purchase.date | dateformat($t('YYYY-MM-DD')) }}</div>
            </div>
            <div class="w3-row">
                <div class="w3-col l10 m9 purchase-sum">{{ purchase.sum }}</div>
                <div class="w3-col l2 m3 purchase-category">{{ categoryName }}</div>
            </div>
        </div>
        <div class="w3-col l2 m2 w3-right-align w3-small padding-top-5">
            <div class="w3-center">
                <img class="st-shopper-avatar-16" v-if="shopperImage !== ''" :src="`data:image/png;base64,${shopperImage}`" :alt="$t('shopper')">
                <img class="st-shopper-avatar-16" v-else src="@/assets/img/image-solid.svg" :alt="$t('shopper')">
                <br>
                {{ shopperName }}
            </div>
        </div>
        <div v-show="selected" class="w3-col l2 m3 w3-right-align purchase-action-buttons">
            <button class="w3-button background-primary-0 hover-primary-0 w3-round display-inline-block"
                    @click="edit_Click()">
                <img src="@/assets/img/pencil16-white.png" :alt="$t('edit')" :title="$t('editThisItem')">
            </button>
            <button class="w3-button background-primary-0 hover-primary-0 w3-round display-inline-block"
                    @click="delete_Click()">
                <img src="@/assets/img/remove16-white.png" :alt="$t('delete')" :title="$t('deleteThisItem')">
            </button>
        </div>
    </div>
</template>

<style scoped>
.padding-top-5 {
    padding-top: 5px;
}
</style>

<script>
import EventBus from '@/utils/EventBus'
import store from '@/store'

export default {
    props: {
        purchase: {
            type: Object,
            required: true
        },
        selected: {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
        }
    },

    computed: {
        venueName () {
            const venueId = this.purchase.venue
            return typeof store.state.venues[venueId] !== 'undefined'
                ? store.state.venues[venueId].name
                : 'N/A'
        },

        venueImage () {
            const venueId = this.purchase.venue
            return typeof store.state.venues[venueId] !== 'undefined'
                ? `data:image/png;base64,${store.state.venues[venueId].image}`
                : ''
        },

        categoryName () {
            const catId = this.purchase.category
            return typeof store.state.categories[catId] !== 'undefined'
                ? store.state.categories[catId].name
                : 'N/A'
        },

        shopperName () {
            const shopperId = this.purchase.shopper
            return typeof store.state.shoppers[shopperId] !== 'undefined'
                ? store.state.shoppers[shopperId].name
                : 'N/A'
        },

        shopperImage () {
            const shopperId = this.purchase.shopper
            return typeof store.state.shoppers[shopperId] !== 'undefined'
                ? store.state.shoppers[shopperId].image
                : ''
        }
    },

    watch: {
        selected (n) {
            this.selected = n
        }
    },

    methods: {
        delete_Click () {
            EventBus.$emit('begin-delete-purchase', this.purchase)
        },

        edit_Click () {
            EventBus.$emit('begin-edit-purchase', this.purchase)
        }
    }
}
</script>

<style scoped>
.purchase-container {
  border-bottom: 1px solid #333;
  padding: 5px;
  cursor: pointer;
}

div.purchase-venue {
    text-decoration: underline;
}

div.purchase-sum {
    font-size: 1.2em;
    font-weight: bold;
}

div.purchase-date {
    text-decoration: underline;
}

div.purchase-category {
    font-size: 1.2em;
    font-weight: bold;
}

.purchase-action-buttons {
    padding-top: 5px;
}

.purchase-action-buttons button {
    margin-right: 5px;
}
</style>