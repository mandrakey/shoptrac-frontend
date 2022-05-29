<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-block">
        <div class="w3-cell-row st-select" @click="focus(null)">
            <div class="w3-cell w3-cell-middle" style="max-width: 32px;">
                <img v-if="typeof selected.image !== 'undefined' && selected.image !== ''"
                        :src="`data:image/png;base64,${selected.image}`" width="32" height="32">
            </div>
            <div class="w3-cell w3-cell-bottom">
                <input type="text" class="w3-input w3-border-0" v-model="selectedName"
                        ref="selectedName"
                        @keyup="onSelectedNameKeyUp($event)" @blur="blur($event)" @focus="focus($event)">
            </div>
        </div>
        <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showDropdown }]"
                    @mouseenter="mouseInDropdown = true" @mouseleave="mouseInDropdown = false">
            <span v-for="v in Object.values(visibleVenues)" :key="v._key">
                <a :class="['w3-button', 'w3-bar-item', { 'hovered-venue': hoveredVenue === v._key }]"
                        @click="selectByKey(v._key)">
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

.hovered-venue {
    background: #ccc;
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
        venues () {
            const stored = store.state.venues
            return this.allowEmpty
                ? { ...stored, '-1': { _key: '-1', name: this.$i18n.t('allVenues') } }
                : stored
        },

        visibleVenues () {
            const self = this

            if (self.selectedName === '' || self.selectedName === self.selected.name) {
                return self.venues
            }

            const map = {}
            for (const v of Object.values(self.venues)) {
                if (v.name.toLowerCase().includes(self.selectedName.toLowerCase())) {
                    map[v._key] = v
                }
            }
            return map
        }
    },

    data () {
        return {
            showDropdown: false,
            mouseInDropdown: false,
            hoveredVenue: '',
            selectedName: '',
            selected: { key: -1, image: '', name: this.$i18n.t('allVenues') }
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

    methods: {
        focus (event) {
            if (typeof event !== 'object' || event === null || event.type !== 'focus') {
                this.$refs['selectedName'].focus()
            } else {
                this.showDropdown = true
            }
        },

        blur (event) {
            if (typeof event !== 'object' || event === null || event.type !== 'blur') {
                this.$refs['selectedName'].blur()
            } else if (!this.mouseInDropdown) {
                this.showDropdown = false
            }
        },

        selectByKey (key) {
            if (typeof this.venues[key] === 'object') {
                this.selected = this.venues[key]
                this.selectedName = this.selected.name
                this.$emit('selected', { venue: this.selected._key })
                this.showDropdown = false
            }
        },

        preselect () {
            const keys = Object.keys(this.venues)
            if (this.allowEmpty) {
                this.selectByKey('-1')
            } else if (keys.length > 0) {
                this.selectByKey(keys[0])
            }
        },

        onSelectedNameKeyUp (event) {
            this.showDropdown = true
            switch (event.key) {
                case 'ArrowDown':
                    this.changeHoveredVenue(1)
                    break

                case 'ArrowUp':
                    this.changeHoveredVenue(-1)
                    break

                case 'Enter':
                    this.selectByKey(this.hoveredVenue)
                    this.hoveredVenue = ''
                    break

                case 'Escape':
                    this.selectedName = this.selected.name
                    this.hoveredVenue = ''
                    this.showDropdown = false
                    this.blur()
            }
        },

        changeHoveredVenue (direction) {
            const visibleKeys = Object.keys(this.visibleVenues)

            if (typeof this.hoveredVenue !== 'string' || this.hoveredVenue === '') {
                this.hoveredVenue = direction === 1
                    ? visibleKeys[0]
                    : visibleKeys[visibleKeys.length - 1]
            } else {
                let idx = 0
                for (; idx < visibleKeys.length; ++idx) {
                    if (visibleKeys[idx] === this.hoveredVenue) {
                        idx = idx + direction
                        break
                    }
                }

                if (idx < 0) {
                    idx = visibleKeys.length - 1
                }
                if (idx === visibleKeys.length) {
                    idx = 0
                }
                this.hoveredVenue = visibleKeys[idx]
            }
        }
    }
}
</script>