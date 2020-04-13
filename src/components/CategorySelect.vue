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
            <span v-if="allowEmpty">
                <a class="w3-button w3-bar-item" @click="select({ _key: -1, name: $t('allCategories') })">
                    {{ $t('allCategories') }}
                </a>
            </span>
            <span v-for="c in categories" :key="c._key">
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
        },
        'allow-empty': {
            type: Boolean,
            default: false
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
            selected: { _key: -1, name: this.$i18n.t('allCategories') }
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
            if (typeof this.categories[category._key] === 'object') {
                this.selected = this.categories[category._key]
                this.$emit('selected', { category: this.selected._key })
                this.toggleDropdown()
            } else if (category._key === -1 && this.allowEmpty) {
                this.selected = category
                this.$emit('selected', { category: category._key })
                this.toggleDropdown()
            }
        },

        selectByKey (key) {
            if (typeof this.categories[key] === 'object') {
                this.selected = this.categories[key]
            }
        },

        preselect () {
            if (this.selected._key > 0) {
                return
            }

            if (this.allowEmpty) {
                var c = { _key: -1, name: this.$i18n.t('allCategories') }
                this.selected = c
                this.$emit('selected', { category: c._key })
                return
            }

            var keys = Object.keys(this.categories)
            if (keys.length > 0) {
                this.selected = this.categories[keys[0]]
                this.$emit('selected', { category: this.selected._key })
            }
        },

        toggleDropdown () {
            this.showDropdown = !this.showDropdown
        }
    }
}
</script>