<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-dropdown-click w3-block">
        <button @click="toggleDropdown" class="w3-button w3-theme-action w3-block button">
            <img v-if="typeof selected.image !== 'undefined' && selected.image !== ''"
                    :src="`data:image/png;base64,${selected.image}`"
                    width="32" height="32">
            {{ selected.name }}
        </button>
        <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showDropdown }]">
            <span v-for="c in categories" :key="c.key">
                <a class="w3-button w3-bar-item" @click="select(c)">
                    {{ c.name }}
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
import EventBus from '@/utils/EventBus'

import store from '@/store'

export default {
    props: {
        'value': {
            type: Number,
            default: -1
        }
    },

    computed: {
        categories () {
            return store.state.categories
        }
    },

    data () {
        return {
            showDropdown: false,
            selected: { key: -1, name: '' }
        }
    },

    mounted () {
        var self = this

        EventBus.$on('categories-loaded', self.preselect)
        self.preselect()
    },

    destroyed () {
        EventBus.$off('categories-loaded', self.preselect)
    },

    methods: {
        select (category) {
            if (typeof this.categories[category.key] === 'object') {
                this.selected = this.categories[category.key]
                this.$emit('selected', { category: this.selected.key })
                this.toggleDropdown()
            }
        },

        selectByKey (key) {
            if (typeof this.categories[key] === 'object') {
                this.selected = this.categories[key]
            }
        },

        preselect () {
            if (this.selected.key > 0) {
                return
            }

            var keys = Object.keys(this.categories)
            if (keys.length > 0) {
                this.selected = this.categories[keys[0]]
                this.$emit('selected', { category: this.selected.key })
            }
        },

        toggleDropdown () {
            this.showDropdown = !this.showDropdown
        }
    }
}
</script>