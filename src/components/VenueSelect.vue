<i18n src="@/lang/common.json"></i18n>

<template>
    <div class="w3-block">
        <modal-filterable-select :choices="venueChoices" :visible="showChoices" @blur="choices_Blur()" @selected="choices_Selected($event)" />
        <div class="w3-cell-row st-select-button" @click="btnChoices_Click()">
            <div v-if="(typeof selected.image !== 'undefined' && selected.image !== '')" class="w3-cell w3-cell-middle logo">
                <img :src="`data:image/png;base64,${selected.image}`" width="32" height="32" :alt="`${selected.name} logo`">
            </div>
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
        venues() {
            const stored = store.state.venues
            return this.allowEmpty
                ? { ...stored, '-1': { _key: '-1', name: this.$i18n.t('allVenues') } }
                : stored
        },

        venueChoices() {
            const self = this
            const venues = Object.values(self.venues)

            return venues.map(v => {
                return { value: v._key, text: v.name, image: v.image }
            })
        }
    },

    data () {
        return {
            selected: { _key: -1, image: '', name: this.$i18n.t('allVenues') },

            showChoices: false
        }
    },

    mounted () {
        const self = this

        EventBus.$on('venues-loaded', self.preselect)
        self.preselect()
    },

    destroyed () {
        EventBus.$off('venues-loaded', self.preselect)
    },

    methods: {
        hasImage(venue) {
            return typeof venue.image !== 'undefined' && venue.image !== ''
        },

        preselect() {
            if (this.value < -1) {
                throw new Error('venue default value must be -1 or greater.')
            }

            const keys = Object.keys(this.venues)
            let v = this.value
            if ((this.value < 0 && !this.allowEmpty) || !keys.includes(v)) {
                v = keys[0]
            }
            this.selectByKey(v)
        },

        selectByKey(key) {
            if (typeof this.venues[key] !== 'object') {
                return
            }
            this.selected = this.venues[key]
            this.emitSelected()
        },

        emitSelected() {
            if (typeof this.selected !== 'undefined') {
                this.$emit('selected', { venue: this.selected._key })
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