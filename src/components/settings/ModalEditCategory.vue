<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "addCategory": "Add category",
        "editCategory": "Edit category",
        "image": "Image",
        "selectImage": "Select image",
        "categoryName": "Category name",

        "pleaseEnterACategoryName": "Please enter a category name.",

        "savingCategoryData": "Saving category data ...",
        "categoryHasBeenSaved": "Category has been saved.",

        "errors": {
            "failedToSaveCategory": "Failed to save the category."
        }
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t(mode === 'edit' ? 'editCategory' : 'addCategory') }}
            </div>

            <form class="w3-form">
            <div class="w3-padding">
                <div class="w3-row">
                    <div class="w3-col w3-third w3-padding">
                        {{ $t('categoryName') }}:
                    </div>
                    <div class="w3-col w3-twothird">
                        <input type="text" class="w3-input" v-model="category.name">
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
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="cancel_Click()">
                        {{ $t('buttonlabels.cancel') }}
                    </button>
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="save_Click()">
                        {{ $t('buttonlabels.save') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
import Console from '@/utils/Console'

import Category from '@/model/Category'

export default {
    data () {
        return {
            showDialog: false,
            mode: 'add',
            action: '',
            category: new Category()
        }
    },

    methods: {
        cancel_Click () {
            this.showDialog = false
            this.reset()
        },

        save_Click () {
            if (this.mode === 'add') {
                this.doAddCategory()
            } else {
                this.doUpdateCategory()
            }
        },

        doUpdateCategory () {
            const self = this

            if (typeof self.category._key !== 'string' || self.category._key === '' 
                    || self.category.name === '') {
                window.toast({
                    text: self.$i18n.t('errors.failedToSaveCategory'),
                    color: 'red'
                })
                return
            }

            self.action = self.$i18n.t('savingCategoryData')
            Api.updateCategory(self.category)
                .then(resp => {
                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('errors.failedToSaveCategory'),
                            color: 'red'
                        })
                        return
                    }

                    window.toast({
                        text: self.$i18n.t('categoryHasBeenSaved'),
                        color: 'green'
                    })
                    self.$emit('update', { category: self.category })
                    self.reset()
                    self.showDialog = false
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication', [err]),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        doAddCategory () {
            const self = this

            if (self.category.name === '') {
                window.toast({
                    text: self.$i18n.t('pleaseEnterACategoryName'),
                    color: 'yellow'
                })
                return
            }

            self.action = self.$i18n.t('savingCategoryData')
            Api.addCategory(self.category)
                .then(resp => {
                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('errors.failedToSaveCategory'),
                            color: 'red'
                        })
                        return
                    }

                    let savedCategory = null
                    try {
                        savedCategory = Category.fromObject(resp.data)
                    } catch (err) {
                        Console.debug(`Invalid response after adding a category: ${err}`)
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    window.toast({
                        text: self.$i18n.t('categoryHasBeenSaved'),
                        color: 'green'
                    })
                    self.$emit('add', { category: savedCategory })
                    self.reset()
                    self.showDialog = false
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication', [err]),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        show (mode, category = null) {
            if (!['add', 'edit'].includes(mode)) {
                return
            }
            if (mode === 'edit') {
                if (typeof category === 'undefined' || category === null) {
                    return
                }
                this.category = Category.fromObject(category)
            }

            this.mode = mode
            this.showDialog = true
        },

        reset () {
            this.category = new Category()
            this.action = ''
        }
    }
}
</script>