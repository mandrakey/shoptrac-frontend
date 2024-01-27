<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.shoppers.json"></i18n>

<template>
    <div class="w3-block st-select-button-container">
        <modal-filterable-select :choices="shopperChoices" :visible="showChoices" @blur="choices_Blur()" @selected="choices_Selected($event)" />
        <div class="w3-cell-row st-select-button" @click="btnChoices_Click()">
            <div v-if="(typeof selected.image !== 'undefined' && selected.image !== '')" class="w3-cell w3-cell-middle logo">
                <img :src="`data:image/png;base64,${selected.image}`" :alt="`${selected.name} avatar`">
            </div>
            <div class="w3-cell w3-cell-middle text">{{ selected.name }}</div>
        </div>
    </div>
</template>

<style scoped>
.logo {
    width: 32px;
}
.logo > img {
    width: 32px;
    height: 32px;
    border-radius: 16px;
}
.text {
    padding-left: 10px;
}
</style>

<script>
import EventBus from '@/utils/EventBus'

import Store from '@/store'

import Shopper from '@/model/Shopper'

import ModalFilterableSelect from '@/components/ModalFilterableSelect.vue'

export default {
    components: {
        ModalFilterableSelect
    },

    props: {
        value: {
            type: Number,
            default: -1
        },
        'allow-empty': {
            type: Boolean,
            default: false
        }
    },

    computed: {
        shoppers() {
            const stored = Store.state.shoppers

            return this.allowEmpty
                ? { ...stored, '-1': this.createDummyShopper() }
                : stored
        },

        shopperChoices() {
            return Object.values(this.shoppers).map(s => {
                return { value: s._key, text: s.name, image: s.image }
            })
        }
    },

    data() {
        return {
            selected: null,
            showChoices: false
        }
    },

    created() {
        this.selected = this.createDummyShopper()
    },

    mounted() {
        EventBus.$on('shoppers-loaded', this.preselect)
        this.preselect()
    },

    destroyed() {
        EventBus.$off('shoppers-loaded', this.preselect)
    },

    methods: {
        hasImage(shopper) {
            return typeof shopper.image === 'string' && shopper.image !== ''
        },
        
        preselect() {
            if (this.value < -1) {
                throw new Error('shopper default value must be -1 or greater.')
            }

            const keys = Object.keys(this.shoppers)
            let v = this.value
            if ((v < 0 && !this.allowEmpty) || !keys.includes(v)) {
                v = keys[0]
            }
            this.selectByKey(v)
        },

        selectByKey(key) {
            if (typeof this.shoppers[key] === 'object') {
                this.selected = this.shoppers[key]
                this.emitSelected()
            }
        },

        emitSelected() {
            if (typeof this.selected !== 'undefined') {
                this.$emit('selected', { shopper: this.selected._key })
            }
        },

        createDummyShopper() {
            const s = new Shopper()
            s._key = '-1'
            s.name = this.$i18n.t('All shoppers')
            return s
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
