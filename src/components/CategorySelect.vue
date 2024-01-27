<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-block st-select-button-container">
        <modal-filterable-select :choices="categoryChoices" :visible="showChoices" @blur="choices_Blur()" @selected="choices_Selected($event)" />
        <div class="w3-cell-row st-select-button" @click="btnChoices_Click()">
            <div class="w3-cell w3-cell-middle">{{ selected.name }}</div>
        </div>
    </div>
</template>

<style scoped>
.logo {
    width: 32px;
}
.logo > img {
    padding-right: 5px;
}
</style>

<script>
import EventBus from '@/utils/EventBus'

import store from '@/store'

import ModalFilterableSelect from '@/components/ModalFilterableSelect.vue'

export default {
    components: {
        ModalFilterableSelect
    },

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
        categories() {
            const stored = store.state.categories
            return this.allowEmpty
                ? { ...stored, '-1': { _key: '-1', name: this.$i18n.t('allCategories') } }
                : stored
        },

        categoryChoices() {
            return Object.values(this.categories).map(c => {
                return { value: c._key, text: c.name }
            })
        }
    },

    data() {
        return {
            showChoices: false,
            selected: { _key: '-1', name: this.$i18n.t('allCategories') }
        }
    },

    mounted() {
        const self = this

        EventBus.$on('categories-loaded', self.preselect)
        self.preselect()
    },

    destroyed() {
        EventBus.$off('categories-loaded', self.preselect)
    },

    methods: {
        preselect() {
            if (this.value < -1) {
                throw new Error('category default value must be -1 or greater.')
            }

            const keys = Object.keys(this.categories)
            let v = this.value
            if ((this.value < 0 && !this.allowEmpty) || !keys.includes(v)) {
                v = keys[0]
            }

            this.selectByKey(v)
        },

        selectByKey(key) {
            if (typeof this.categories[key] !== 'object') {
                return
            }
            this.selected = this.categories[key]
            this.emitSelected()
        },

        emitSelected() {
            if (typeof this.selected !== 'undefined') {
                this.$emit('selected', { category: this.selected._key })
            }
        },

        btnChoices_Click() {
            this.showChoices = true
        },

        choices_Blur() {
            this.showChoices = false
        },

        choices_Selected(event) {
            if (typeof event !== 'object' || typeof event.choice !== 'object') {
                return
            }
            this.selectByKey(event.choice.value)
        }
    }
}
</script>