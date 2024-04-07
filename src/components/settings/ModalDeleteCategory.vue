<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "deleteCategory": "Delete category",
        "deleteCategoryInfo1": "Do you really want to delete the following category?",
        "deleteCategoryInfo2": "This action can not be undone.",
        "deletingCategory": "Deleting category ...",
        "categoryHasBeenDeleted": "Category has been deleted."
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t('deleteCategory') }}
            </div>

            <div class="w3-padding">
                <p>{{ $t('deleteCategoryInfo1') }}</p>
                <p><category-list-item v-if="category !== null" :category="category" class="category-item"></category-list-item></p>
                <p>{{ $t('deleteCategoryInfo2') }}</p>
            </div>

            <div class="w3-padding st-modal-footer w3-row">
                <div class="w3-col w3-half w3-padding st-loading w3-text-theme">
                    <div v-show="action !== ''">
                        <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" alt="loading">
                        <div class="action">{{ action }}</div>
                    </div>
                </div>

                <div class="w3-col w3-half w3-right-align">
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="cancel_Click()">Cancel</button>
                    <button class="w3-button w3-small st-button-theme w3-hover-red"
                            @click="delete_Click()">Delete</button>
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

.category-item {
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

import Category from '@/model/Category'

import CategoryListItem from '@/components/CategoryListItem'

export default {
    components: {
        CategoryListItem
    },

    data () {
        return {
            showDialog: false,
            action: '',
            category: null
        }
    },

    methods: {
        cancel_Click () {
            this.showDialog = false
            this.reset()
        },

        delete_Click () {
            const self = this

            self.action = self.$i18n.t('deletingCategory')
            Api.deleteCategory(self.category)
                .then(resp => {
                    if (typeof resp.status !== 'number') {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    if (resp.status === 200) {
                        window.toast({
                            text: self.$i18n.t('categoryHasBeenDeleted'),
                            color: 'green'
                        })
                        self.showDialog = false
                        self.$emit('deleted', { category: self.category })
                        self.reset()
                    } else {
                        window.toast({
                            text: self.$i18n.t('failedToDeleteCategory'),
                            color: 'red'
                        })
                    }
                })
                .catch(() => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication'),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        show (category) {
            if (category instanceof Category) {
                this.category = category
                this.showDialog = true
            }
        },

        reset () {
            this.category = null
            this.action = ''
        }
    }
}
</script>