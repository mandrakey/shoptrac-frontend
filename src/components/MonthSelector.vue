<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-row w3-padding">
        <div class="w3-col w3-third w3-right-align">
            <button class="w3-button w3-theme-action" @click="changeMonth(-1)">&lt;&lt;</button>
        </div>
        <div class="w3-col w3-third w3-center">
            <span class="w3-xlarge">{{ text }}</span>
        </div>
        <div class="w3-col w3-third">
            <button class="w3-button w3-theme-action" @click="changeMonth(1)">&gt;&gt;</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            month: 1,
            year: 2019
        }
    },

    computed: {
        text () {
            return `${this.$i18n.t('months.' + (this.month - 1))} ${this.year}`
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
        }
    }
}
</script>

<style>
</style>
