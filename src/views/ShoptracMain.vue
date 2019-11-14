<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "purchaseHasBeenSaved": "The purchase has been saved.",
        "failedToSavePurchase": "Failed to save the purchase.",
        "savingPurchase": "Saving purchase"
    }
}
</i18n>

<template>
    <div class="w3-row w3-padding">
        <modal-action ref="modal-action"></modal-action>
        <modal-edit-purchase ref="modalEditPurchase" @save="modalEditPurchase_Save($event)"></modal-edit-purchase>
        <modal-delete-purchase ref="modalDeletePurchase" @deleted="modalDeletePurchase_Deleted($event)"></modal-delete-purchase>

        <div class="w3-col l8 m8 s12 w3-padding">
            <month-selector ref="month-selector" @change="MonthSelector_Change($event)" />
            <overview-stats ref="overview-stats" :month="currentMonth" :year="currentYear"></overview-stats>
            <purchase-list :month="currentMonth" :year="currentYear" ref="purchase-list"></purchase-list>
        </div>

        <div class="w3-col l4 m4 s12 w3-padding">
            <div class="w3-row margin-top-5">
                <div class="w3-third st-label">{{ $t('venue') }}:</div>
                <div class="w3-twothird">
                    <venue-select :items="[]" @selected="changeCurrentVenue($event)"></venue-select>
                </div>
            </div>

            <div class="w3-row margin-top-5">
                <div class="w3-third st-label">{{ $t('category') }}:</div>
                <div class="w3-twothird">
                    <category-select :items="[]" @selected="changeCurrentCategory($event)"></category-select>
                </div>
            </div>

            <div class="w3-row margin-top-5">
                <div class="w3-third st-label">{{ $t('date') }}:</div>
                <div class="w3-twothird">
                    <input class="w3-input w3-border background-primary-4 hover-primary-4 w3-text-white date"
                            type="date" v-model="newPurchaseDate">
                </div>
            </div>

            <div class="margin-top-5">
                <keypad ref="keypad" @submit="createNewPurchase($event)"></keypad>
            </div>
        </div>
    </div>
</template>

<style scoped>
.st-label {
    padding-top: 15px;
}

.margin-top-5 {
    margin-top: 5px;
}

.date {
    cursor: pointer;
}
</style>

<script>
import moment from 'moment'
import Api from 'api'

import EventBus from '@/utils/EventBus'

import Purchase from '@/model/Purchase'

import MonthSelector from '@/components/MonthSelector'
import PurchaseList from '@/components/PurchaseList'
import Keypad from '@/components/Keypad'
import VenueSelect from '@/components/VenueSelect'
import CategorySelect from '@/components/CategorySelect'
import ModalDeletePurchase from '@/components/ModalDeletePurchase'
import ModalEditPurchase from '@/components/ModalEditPurchase'
import ModalAction from '@/components/ModalAction'
import OverviewStats from '@/components/OverviewStats'

export default {
    components: {
        MonthSelector,
        PurchaseList,
        Keypad,
        VenueSelect,
        CategorySelect,
        ModalDeletePurchase,
        ModalEditPurchase,
        ModalAction,
        OverviewStats
    },

    data () {
        return {
            currentMonth: 1,
            currentYear: 2019,
            currentVenue: -1,
            currentCategory: -1,

            newPurchaseDate: moment().format('YYYY-MM-DD')
        }
    },

    mounted () {
        var d = new Date()
        this.currentMonth = d.getMonth() + 1
        this.currentYear = d.getFullYear()

        EventBus.$on('begin-delete-purchase', this.beginDeletePurchase)
        EventBus.$on('begin-edit-purchase', this.beginEditPurchase)
    },

    destroyed () {
        EventBus.$off('begin-delete-purchase', this.beginDeletePurchase)
        EventBus.$off('begin-edit-purchase', this.beginEditPurchase)
    },

    methods: {
        MonthSelector_Change (event) {
            this.currentYear = event.year
            this.currentMonth = event.month
        },

        beginDeletePurchase (purchase) {
            this.$refs['modalDeletePurchase'].show(purchase)
        },

        modalDeletePurchase_Deleted (event) {
            this.$refs['purchase-list'].removePurchase(event)
            EventBus.$emit('reload-overview-stats')
        },

        beginEditPurchase (purchase) {
            this.$refs['modalEditPurchase'].show(purchase)
        },

        modalEditPurchase_Save (event) {
            this.$refs['purchase-list'].removePurchase(event.purchase)
            this.$refs['purchase-list'].addPurchase(event.purchase)
            EventBus.$emit('reload-overview-stats')
        },

        createNewPurchase (event) {
            var self = this

            var p = new Purchase()
            p.category = self.currentCategory
            p.venue = self.currentVenue
            p.date = self.newPurchaseDate
            p.sum = event.sum

            var d = moment(self.newPurchaseDate)
            p.month = d.month() + 1
            p.year = d.year()
            
            // Save the new purchase
            self.$refs['modal-action'].setAction(self.$i18n.t('savingPurchase'))
            Api.addPurchase(p)
                .then(resp => {
                    if (resp.status === 200) {
                        if (typeof resp.data !== 'object') {
                            window.toast({
                                text: self.$i18n.t('errors.apiCommunication'),
                                color: 'red'
                            })
                            return
                        }

                        window.toast({
                            color: 'green',
                            text: self.$i18n.t('purchaseHasBeenSaved')
                        })

                        p = Purchase.fromObject(resp.data)
                        self.addPurchaseOrReload(p)
                        self.$refs['keypad'].clear()
                    } else {
                        window.toast({
                            color: 'red',
                            text: self.$i18n.t('failedToSavePurchase')
                        })
                    }
                })
                .catch(err => {
                    window.toast({
                        color: 'red',
                        title: self.$i18n.t('errors.apiCommunication'),
                        text: `${err}`,
                        timeout: 0
                    })
                })
                .finally(() => self.$refs['modal-action'].setAction(''))

        },

        changeCurrentVenue (event) {
            if (typeof event.venue === 'string') {
                this.currentVenue = event.venue
            }
        },

        changeCurrentCategory (event) {
            if (typeof event.category === 'string') {
                this.currentCategory = event.category
            }
        },

        addPurchaseOrReload (purchase) {
            if (!(purchase instanceof Purchase)) {
                throw 'Expect a purchase object'
            }

            if (purchase.month === this.currentMonth && purchase.year === this.currentYear) {
                // Add to the list
                this.$refs['purchase-list'].addPurchase(purchase)
                EventBus.$emit('reload-overview-stats')
            } else {
                // Set month/year to trigger list reload
                this.$refs['month-selector'].setDate(purchase.month, purchase.year)
            }
        }
    }
}
</script>
