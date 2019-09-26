<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "deletePurchase": "Delete purchase",
        "deletePurchaseInfo1": "Do you really want to delete the following purchase?",
        "deletePurchaseInfo2": "This action can not be undone.",
        "deletingPurchase": "Deleting purchase ..."
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t('deletePurchase') }}
            </div>

            <div class="w3-padding">
                <p>{{ $t('deletePurchaseInfo1') }}</p>
                <purchase-item v-if="purchase !== null" :purchase="purchase" class="purchase-item"></purchase-item>
                <p>{{ $t('deletePurchaseInfo2') }}</p>
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

.purchase-item {
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
import Console from '@/utils/Console'

import Purchase from '@/model/Purchase'

import PurchaseItem from '@/components/PurchaseItem'

export default {
    components: {
        PurchaseItem
    },

    data () {
        return {
            showDialog: false,
            action: '',
            purchase: null
        }
    },

    methods: {
        show (purchase) {
            if (!(purchase instanceof Purchase)) {
                return
            }

            this.purchase = purchase
            this.showDialog = true
        },

        cancel_Click () {
            this.showDialog = false
        },

        delete_Click () {
            var self = this

            self.action = self.$i18n.t('deletingPurchase')
            Api.deletePurchase(self.purchase)
                .then(resp => {
                    if (typeof resp.status !== 'number') {
                        // window.message(self.$i18n.t('errors.invalidApiResponse'), 'red', 2500)
                        Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
                        return
                    }

                    switch (resp.status) {
                        case 404:
                            // window.message(self.$i18n.t('errors.failedToDeletePurchase'), 'red', 2500)
                            Console.error(`The selected purchase with key '${self.purchase._key}' was not found.`)
                            return

                        case 200:
                            // window.message(self.$i18n.t('purchaseHasBeenDeleted'), 'green', 2500)
                            self.$emit('deleted', self.purchase)
                            self.showDialog = false
                    }
                })
                .catch(err => {
                    // window.message(self.$i18n.t('errors.apiCommunication', [err]), 'red', 2500)
                    Console.error(`API communication: ${err}`)
                })
                .finally(() => self.action = '')
        }
    }
}
</script>