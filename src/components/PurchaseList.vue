<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>

<template>
    <div>
        <div v-show="loading" class="w3-center">
            <img src="@/assets/img/spinner-48-primary.gif" :alt="$t('loading')">
        </div>
        <div id="purchaseItemsContainer" v-show="!loading">
            <purchase-item v-for="p in purchasesList"
                :key="p._key"
                :purchase="p"
                :selected="selectedPurchase === p._key"
                @click="PurchaseItem_Click($event)">
            </purchase-item>
        </div>
    </div>
</template>

<script>
import Api from 'api'
import Console from '@/utils/Console'

import Purchase from '@/model/Purchase'

import PurchaseItem from '@/components/PurchaseItem'

export default {
    components: {
        PurchaseItem
    },

    props: {
        'month': {
            type: Number,
            default: 1
        },
        'year': {
            type: Number,
            required: true
        }
    },

    data () {
        return {
            loading: false,
            purchasesList: [],
            selectedPurchase: ''
        }
    },

    watch: {
        month (n, o) {
            if (n !== o) {
                this.reloadList()
            }
        },

        year (n, o) {
            if (n !== o) {
                this.reloadList()
            }
        }
    },

    methods: {
        reloadList () {
            const self = this

            self.loading = true
            self.selectedPurchase = ''
            Api.getPurchases(self.month, self.year)
                .then(resp => {
                    if (typeof resp.status !== 'number') {
                        window.toast({
                            color: 'red',
                            text: self.$i18n.t('errors.invalidApiResponse')
                        })
                        return
                    }

                    switch (resp.status) {
                        case 404:
                            Console.log('No purchases for the selected month')
                            self.purchasesList = []
                            return
                        
                        case 200:
                            if (typeof resp.data !== 'object') {
                                Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
                                return
                            }

                            try {
                                self.purchasesList = resp.data.map(e => Purchase.fromObject(e))
                            } catch (err) {
                                window.toast({
                                    color: 'red',
                                    text: 'failedToLoadPurchases'
                                })
                                Console.error(`Failed to load purchases: ${err}`)
                            }
                            break
                        
                        default:
                            window.toast({
                                color: 'red',
                                text: 'errors.invalidApiResponse'
                            })
                            Console.error(`Invalid API response: ${JSON.stringify(resp)}`)
                    }
                })
                .catch(err => {
                    window.toast({
                        color: 'red',
                        text: self.$i18n.t('errors.apiCommunication')
                    })
                    Console.error(`API communication: ${err}`)
                })
                .finally(() => self.loading = false)
        },

        PurchaseItem_Click (event) {
            if (typeof event.purchase === 'object') {
                const key = event.purchase._key
                this.selectedPurchase = this.selectedPurchase !== key
                    ? key
                    : null
            }
        },

        removePurchase (purchase) {
            const self = this

            self.purchasesList = self.purchasesList.filter(p => purchase._key !== p._key)
            self.selectedPurchase = ''
        },

        addPurchase (purchase) {
            this.purchasesList.push(purchase)
            this.selectedPurchase = ''
            this.sortPurchases()
        },

        sortPurchases () {
            this.purchasesList.sort((a, b) => {
                if (a.date === b.date) {
                    return 0
                }

                return a.date < b.date ? 1 : -1
            })
        }
    }
}
</script>

<style scoped>
#purchaseItemsContainer {
    border: 1px solid #333;
}
</style>
