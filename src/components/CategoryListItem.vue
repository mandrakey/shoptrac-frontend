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
    <div :class="['w3-row', 'category-container', { 'w3-theme-l1': selected }]"
            @click="$emit('click', { category: category })">
        <div :class="['w3-col', selected ? 'l10 m10' : 'l12 m12', 'category-name']">
            {{ category.name }}
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
.category-container {
    border-bottom: 1px solid #333;
    padding: 5px;
    cursor: pointer;
}

.category-name {
    padding: 10px;
}

.action-buttons {
    padding-top: 2px;
    text-align: right;
}

.action-buttons button {
    margin-right: 5px;
}
</style>

<script>
import Category from '@/model/Category'

export default {
    props: {
        category: {
            type: Category,
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