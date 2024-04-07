<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-row w3-padding">
        <modal-filterable-select :choices="timestampChoices" :visible="showMonthSelect" @blur="monthSelector_Blur()" @selected="changeTimestamp($event)" />
        <div class="w3-col w3-third w3-right-align">
            <button class="w3-button w3-theme-action" @click="changeMonth(-1)">&lt;&lt;</button>
        </div>
        <div class="w3-col w3-third w3-center">
            <button class="w3-button w3-theme-action w3-block button month-selector" @click="btnShowMonthSelect_Clicked()">
                {{ text }}
            </button>
        </div>
        <div class="w3-col w3-third">
            <button class="w3-button w3-theme-action" @click="changeMonth(1)">&gt;&gt;</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'

import ModalFilterableSelect from '@/components/ModalFilterableSelect.vue'

export default {
    components: {
        ModalFilterableSelect
    },

    data () {
        return {
            month: 1,
            year: 2019,
            showMonthSelect: false
        }
    },

    computed: {
        text () {
            return this.getTimestampText(this.month, this.year)
        },

        timestamps () {
            return store.state.purchaseTimestamps
        },

        timestampChoices() {
            const self = this
            return self.timestamps.sort((a, b) => {
                if (a.year === b.year) {
                    if (a.month === b.month) {
                        return 0
                    }
                    return a.month < b.month ? -1 : 1
                }
                return a.year < b.year ? -1 : 1
            }).map(t => {
                const text = self.getTimestampText(t.month, t.year)
                return { key: text, value: t, text: text }
            })
        }
    },

    mounted () {
        const d = new Date()
        this.month = d.getMonth() + 1
        this.year = d.getFullYear()
    },

    methods: {
        /**
         * Change the selected month/year combination.
         * @param direction Direction in which to change the month. If the value is greater than 0, the next month
         *  will beselected. If it is less than 0, the previous month will be selected. If the new month exceeds the
         *  interval [1,12], the previous or next year will be set.
         */
        changeMonth (direction) {
            this.month = direction > 0 ? this.month + 1 : this.month - 1

            if (this.month < 1) {
                this.month = 12
                this.year -= 1
            } else if (this.month > 12) {
                this.month = 1
                this.year += 1
            }

            this.$emit('change', { month: this.month, year: this.year })
        },

        setDate (month, year) {
            this.month = month
            this.year = year
            this.$emit('change', { month: this.month, year: this.year })
        },

        getTimestampText (month, year) {
            // month - 1: the month names are a 0-based array
            return `${this.$i18n.t('months.' + (month - 1))} ${year}`
        },

        btnShowMonthSelect_Clicked() {
            this.showMonthSelect = true
        },

        monthSelector_Blur() {
            this.showMonthSelect = false
        },

        changeTimestamp(event) {
            if (typeof event !== 'object' || typeof event.choice !== 'object') {
                return
            }
            
            const t = event.choice.value
            this.setDate(t.month, t.year)
            this.showMonthSelectDropdown = false
        }
    }
}
</script>

<style>
.month-selector {
    width: 99%;
    margin: auto;
}
</style>
