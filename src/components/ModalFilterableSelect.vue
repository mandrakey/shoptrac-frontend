<i18n src="@/lang/common.json"></i18n>
<i18n>
    {
        "en": {
            "txtFilter__placeholder": "Type to filter choices ..."
        }
    }
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': visible }]" @click="outside_Clicked()">
        <div class="w3-modal-content w3-card" @click="preventOutsideClick($event)">
            <input class="w3-input txtFilter" :placeholder="$t('txtFilter__placeholder')" v-model="filter" />
            <div class="items-container">
                <div v-for="item in filteredChoices"
                        :key="typeof item.key === 'undefined' ? item.value : item.key"
                        :class="['w3-padding', 'choice-item']"
                        @click="onChoiceClick(item)"
                >
                    <img v-if="(typeof item.image !== 'undefined' && item.image !== '')"
                            :src="`data:image/png;base64,${item.image}`" 
                            width="32" height="32" :alt="item.text"> 
                    {{ item.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.txtFilter {
    border-bottom: 2px solid #ccc;
}
.choice-item {
    border-bottom: 1px solid #ccc;
}
.choice-item:hover {
    background: #006e6d;
    color: #fff;
    cursor: pointer;    
}
.choice-item > img {
    margin-right: 10px;
}

.items-container {
    max-height: 450px;
    overflow-y: scroll;
}
</style>

<script>
export default {
    props: {
        choices: {
            type: Array,
            required: true,
            validator(value) {
                for (const item of value) {
                    if (!(item instanceof Object)) {
                        return false
                    }
                    const keys = Object.keys(item)
                    if (!keys.includes('value') || !keys.includes('text')) {
                        return false
                    }
                }
                return true
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        disableBlur: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            filter: '',
            selected: null
        }
    },

    computed: {
        filteredChoices() {
            const self = this

            self.selected = null
            const fv = self.filter.toLowerCase()
            return typeof self.filter === 'string' && self.filter !== ''
                ? self.choices.filter(it => it.text.toLowerCase().includes(fv))
                : [...self.choices]
        }
    },

    methods: {
        onChoiceClick(choice) {
            this.$emit('selected', { choice: choice })
            this.$emit('blur')
        },

        outside_Clicked() {
            if (!this.disableBlur) {
                this.$emit('blur')
            }
        },

        preventOutsideClick(event) {
            event.stopPropagation()
        }
    }
}
</script>
