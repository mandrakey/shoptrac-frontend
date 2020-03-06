<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-row w3-padding">
        <div class="w3-col w3-third w3-right-align">
            <button class="w3-button w3-theme-action" @click="changeMonth(-1)">&lt;&lt;</button>
        </div>
        <div class="w3-col w3-third w3-center">
            <div class="w3-dropdown-click w3-block">
                <button @click="toggleMonthSelectDropdown" class="w3-button w3-theme-action w3-block button month-selector">
                    {{ text }}
                </button>
            </div>
            <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showMonthSelectDropdown }]">
                <span v-for="(t, idx) in timestamps" :key="idx">
                    <a class="w3-button w3-bar-item" @click="changeTimestamp(t)">
                        {{ getTimestampText(t.month, t.year) }}
                    </a>
                </span>
            </div>
        </div>
        <div class="w3-col w3-third">
            <button class="w3-button w3-theme-action" @click="changeMonth(1)">&gt;&gt;</button>
        </div>
    </div>
</template>

<script>
import store from '@/store'

export default {
    data () {
        return {
            month: 1,
            year: 2019,
            showMonthSelectDropdown: false
        }
    },

    computed: {
        text () {
            return this.getTimestampText(this.month, this.year)
        },

        timestamps () {
            return store.state.purchaseTimestamps
        }
    },

    mounted () {
        var d = new Date()
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

        toggleMonthSelectDropdown () {
            this.showMonthSelectDropdown = !this.showMonthSelectDropdown
        },

        changeTimestamp (t) {
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
