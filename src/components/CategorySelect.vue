<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-block">
        <div class="w3-cell-row st-select" @click="focus()">
            <div class="w3-cell w3-cell-middle" style="max-width: 32px;">
                <img v-show="typeof selected.image !== 'undefined' && selected.image !== ''"
                    :src="`data:image/png;base64,${selected.image}`" width="32" height="32">
            </div>
            <div class="w3-cell w3-cell-bottom">
                <input type="text" class="w3-input w3-border-0" v-model="selectedName"
                        ref="selectedName" @keyup="onSelectedNameKeyUp($event)" @focus="focus($event)" @blur="blur($event)">
            </div>
        </div>
        <div :class="['w3-dropdown-content', 'w3-bar-block', 'w3-border', { 'w3-show': showDropdown }]"
                @mouseenter="mouseInDropdown = true" @mouseleave="mouseInDropdown = false">
            <span v-for="c in Object.values(visibleCategories)" :key="c._key">
                <a :class="['w3-button', 'w3-bar-item', { 'hovered-category': hoveredCategory === c._key }]"
                        @click="selectByKey(c._key)">
                    <img v-if="typeof c.image !== 'undefined' && c.image !== ''"
                            :src="`data:image/png;base64,${c.image}`"
                            width="32" height="32">
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

.hovered-category {
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
        categories () {
            const stored = store.state.categories
            return this.allowEmpty
                ? { ...stored, '-1': { _key: '-1', name: this.$i18n.t('allCategories') } }
                : stored
        },

        visibleCategories () {
            const self = this

            if (self.selectedName === '' || self.selectedName === self.selected.name) {
                return self.categories
            }

            const map = {}
            for (const c of Object.values(self.categories)) {
                if (c.name.toLowerCase().includes(self.selectedName.toLowerCase())) {
                    map[c._key] = c
                }
            }
            return map
        }
    },

    data () {
        return {
            showDropdown: false,
            mouseInDropdown: false,
            hoveredCategory: '',
            selectedName: '',
            selected: { _key: '-1', name: this.$i18n.t('allCategories') }
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
            } else {
                if (!this.mouseInDropdown) {
                    window.setTimeout(() => this.showDropdown = false, 200)
                }
            }
        },

        selectByKey (key) {
            if (typeof this.categories[key] === 'object') {
                this.selected = this.categories[key]
                this.selectedName = this.selected.name
                this.$emit('selected', { category: this.selected._key })
                this.showDropdown = false
            }
        },

        preselect () {
            var keys = Object.keys(this.categories)
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
                    this.changeHoveredCategory(1)
                    break

                case 'ArrowUp':
                    this.changeHoveredCategory(-1)
                    break
                
                case 'Enter':
                    this.selectByKey(this.hoveredCategory)
                    this.hoveredCategory = ''
                    break

                case 'Escape':
                    this.selectedName = this.selected.name
                    this.hoveredCategory = ''
                    this.showDropdown = false
                    this.blur()
            }
        },

        changeHoveredCategory (direction) {
            const visibleKeys = Object.keys(this.visibleCategories)

            if (typeof this.hoveredCategory !== 'string' || this.hoveredCategory === '') {
                this.hoveredCategory = direction === 1
                    ? visibleKeys[0]
                    : visibleKeys[visibleKeys.length - 1]
            } else {
                let idx = 0
                for (; idx < visibleKeys.length; ++idx) {
                    if (visibleKeys[idx] === this.hoveredCategory) {
                        idx += direction
                        break
                    }
                }

                if (idx < 0) {
                    idx = visibleKeys.length -1
                }
                if (idx === visibleKeys.length) {
                    idx = 0
                }
                this.hoveredCategory = visibleKeys[idx]
            }
        }
    }
}
</script>