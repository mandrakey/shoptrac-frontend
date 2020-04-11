<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-dropdown-click w3-block">
        <button @click="toggleDropdown" class="w3-button w3-theme-action w3-block button">
            {{ selected === -1 ? $t('allYears') : selected }}
        </button>
        <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showDropdown }]">
            <span v-if="allowEmpty">
                <a class="w3-button w3-bar-item" @click="select(-1)">
                    {{ $t('allYears') }}
                </a>
            </span>
            <span v-for="y in years" :key="y">
                <a class="w3-button w3-bar-item" @click="select(y)">
                    {{ y }}
                </a>
            </span>
        </div>
    </div>
</template>

<style scoped>
.button {
    min-height: 48px;
}
</style>

<script>
export default {
    props: {
        'years': {
            type: Array,
            default: () => []
        },
        'value': {
            type: Number,
            default: -1
        },
        'allow-empty': {
            type: Boolean,
            default: false
        }
    },

    data () {
        return {
            showDropdown: false,
            selected: -1
        }
    },

    watch: {
        value: function (v) {
            this.select(v)
            this.toggleDropdown()
        }
    },

    mounted () {
        var self = this
        self.preselect()
    },

    methods: {
        select (year) {
            if (this.years.includes(year)) {
                this.selected = year
                this.$emit('selected', { year: year })
                this.toggleDropdown()
            } else if (year === -1 && this.allowEmpty) {
                this.selected = null
                this.$emit('selected', { year: -1 })
                this.toggleDropdown()
            }
        },

        preselect () {
            if (this.selected !== null) {
                return
            }

            if (this.allowEmpty) {
                this.select(-1)
                return
            }

            if (this.years.length > 0) {
                this.select(this.years[0])
            }
        },

        toggleDropdown () {
            this.showDropdown = !this.showDropdown
        }
    }
}
</script>