<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "editPurchase": "Edit purchase",
        "savingPurchase": "Saving purchase",
        "purchaseHasBeenUpdated": "The purchase has been updated."
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t('editPurchase') }}
            </div>

            <div>
                <div class="w3-bar st-tab-bar">
                    <button :class="['w3-bar-item', 'w3-button', { 'active': tab === 'purchase' }]"
                            @click="selectTab('purchase')">Purchase</button>
                    <button :class="['w3-bar-item', 'w3-button', { 'active': tab === 'sum' }]"
                            @click="selectTab('sum')">Sum</button>
                </div>

                <div v-show="tab === 'purchase'" class="w3-padding">
                    <div class="w3-row">
                        <div class="w3-col w3-third w3-padding">{{ $t('venue') }}:</div>
                        <div class="w3-col w3-twothird">
                            <venue-select ref="venue-select" @selected="changeVenue($event)"></venue-select>
                        </div>
                    </div>

                    <div class="w3-row margin-top-5">
                        <div class="w3-col w3-third w3-padding">{{ $t('category') }}:</div>
                        <div class="w3-col w3-twothird">
                            <category-select ref="category-select" @selected="changeCategory($event)"></category-select>
                        </div>
                    </div>

                    <div class="w3-row margin-top-5">
                        <div class="w3-col w3-third w3-padding">{{ $t('date') }}:</div>
                        <div class="w3-twothird">
                            <input class="w3-input w3-border background-primary-4 hover-primary-4 w3-text-white date"
                                    type="date" v-model="purchase.date">
                        </div>
                    </div>
                </div>

                <div v-show="tab === 'sum'" class="w3-padding">
                    <keypad ref="keypad" style="max-width: 400px; margin: auto;" :hideEnterKey="true"
                            @change="changeSum($event)"></keypad>
                </div>
            </div>

            <div class="w3-padding st-modal-footer w3-row">
                <div class="w3-col w3-half w3-padding w3-text-theme">
                    <div v-show="action !== ''">
                        <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" alt="loading">
                        <div class="action">{{ action }}</div>
                    </div>
                </div>

                <div class="w3-col w3-half w3-right-align">
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="cancel_Click()">{{ $t('buttonlabels.cancel') }}</button>
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="save_Click()">{{ $t('buttonlabels.save') }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.margin-top-5 {
    margin-top: 5px;
}

.action-loading {
    float: left;
}

.action {
    padding-top: 3px;
    float: left;
    font-size: .8em;
}
</style>

<script>
import moment from 'moment'
import Api from 'api'
import Console from '@/utils/Console'

import Purchase from '@/model/Purchase'

import VenueSelect from '@/components/VenueSelect'
import CategorySelect from '@/components/CategorySelect'
import Keypad from '@/components/Keypad'

export default {
    components: {
        VenueSelect,
        CategorySelect,
        Keypad
    },

    data () {
        return {
            tabs: ['purchase', 'sum'],

            showDialog: false,
            tab: 'purchase',
            action: '',
            purchase: new Purchase()
        }
    },

    watch: {
        'purchase.date' (n) {
            var m = moment(n)
            this.purchase.month = m.month() + 1
            this.purchase.year = m.year()
        }
    },

    methods: {
        selectTab (tab) {
            if (!this.tabs.includes(tab)) {
                return
            }

            this.tab = tab
        },

        show (purchase) {
            if (!(purchase instanceof Purchase)) {
                return
            }

            this.setPurchase(purchase)
            this.showDialog = true
        },

        setPurchase (purchase) {
            this.purchase = Purchase.fromObject(purchase)
            this.$refs['keypad'].setValue(purchase.sum)
            this.$refs['venue-select'].selectByKey(purchase.venue)
            this.$refs['category-select'].selectByKey(purchase.category)
            
        },

        cancel_Click () {
            this.tab = 'purchase'
            this.action = ''
            this.showDialog = false
        },

        save_Click () {
            var self = this

            self.action = `${self.$i18n.t('savingPurchase')} ...`
            console.log(self.purchase)
            Api.updatePurchase(this.purchase)
                .then(resp => {
                    switch (resp.status) {
                        case 200:
                            window.toast({
                                color: 'green',
                                text: self.$i18n.t('purchaseHasBeenUpdated')
                            })
                            self.$emit('save', { purchase: self.purchase })
                            self.showDialog = false
                            break
                        
                        case 500:
                            window.toast({
                                color: 'red',
                                text: self.$i18n.t('failedToUpdatePurchase')
                            })
                            break
                        
                        default:
                            window.toast({
                                color: 'red',
                                text: self.i18n.t('errors.invalidApiResponse')
                            })
                            Console.error(`Invalid API response code: ${JSON.stringify(resp)}`)
                    }
                })
                .catch(err => {
                    window.toast({
                        color: 'red',
                        text: self.$i18n.t('errors.apiCommunication')
                    })
                    Console.error(`API communication: ${err}`)
                })
                .finally(() => self.action = '')
        },

        changeCategory (event) {
            if (typeof event.category === 'string') {
                this.purchase.category = event.category
            }
        },

        changeVenue (event) {
            if (typeof event.venue === 'string') {
                this.purchase.venue = event.venue
            }
        },

        changeSum (event) {
            if (typeof event.sum !== 'undefined') {
                var sum = parseFloat(event.sum)
                if (sum >= 0) {
                    this.purchase.sum = event.sum
                }
            }
        }
    }
}
</script>