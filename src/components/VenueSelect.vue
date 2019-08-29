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
            <span v-for="v in venues" :key="v.key">
                <a class="w3-button w3-bar-item" @click="select(v)">
                    <img v-if="typeof v.image !== 'undefined' && v.image !== ''"
                            :src="`data:image/png;base64,${v.image}`"
                            width="32" height="32">
                    {{ v.name }}
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
        venues () {
            return store.state.venues
        }
    },

    mounted () {
        var self = this

        EventBus.$on('venues-loaded', self.preselect)
        self.preselect()
    },

    destroyed () {
        EventBus.$off('venues-loaded', self.preselect)
    },

    data () {
        return {
            showDropdown: false,
            selected: { key: -1, image: '', name: '' }
        }
    },

    methods: {
        select (venue) {
            if (typeof this.venues[venue.key] === 'object') {
                this.selected = this.venues[venue.key]
                this.$emit('selected', { venue: this.selected.key })
                this.toggleDropdown()
            }
        },

        selectByKey (key) {
            if (typeof this.venues[key] === 'object') {
                this.selected = this.venues[key]
            }
        },

        preselect () {
            if (this.selected.key > 0) {
                return
            }

            var keys = Object.keys(this.venues)
            if (keys.length > 0) {
                this.selected = this.venues[keys[0]]
                this.$emit('selected', { venue: this.selected.key })
            }
        },

        toggleDropdown () {
            this.showDropdown = !this.showDropdown
        }
    }
}
</script>