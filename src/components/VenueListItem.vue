<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "editThisItem": "Edit this item",
        "deleteThisItem": "Delete this item"
    }
}
</i18n>

<template>
    <div :class="['w3-row', 'venue-container', { 'w3-theme-l1': selected }]"
            @click="$emit('click', { venue: venue })">
        <div :class="['w3-col', 'l2 m2']">
            <img v-if="venue.image !== ''" :src="`data:image/png;base64,${venue.image}`" class="venue-image" :alt="$t('venue')">
            <span v-else>NOIMG</span>
        </div>
        <div :class="['w3-col', selected ? 'l8 m8' : 'l10 m10', 'venue-name']">
            {{ venue.name }}
        </div>
        <div v-show="selected" class="w3-col l2 m2 action-buttons">
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
.venue-container {
    border-bottom: 1px solid #333;
    padding: 5px;
    cursor: pointer;
}

.venue-name {
    padding-top: 15px;
}

.venue-image {
    width: 48px;
    height: 48px;
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
// import EventBus from '@/utils/EventBus'

import Venue from '@/model/Venue'

export default {
    props: {
        venue: {
            type: Venue,
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

    methods: {
        edit_Click () {
            this.$emit('edit')
        },

        delete_Click () {
            this.$emit('delete')
        }
    }
}
</script>