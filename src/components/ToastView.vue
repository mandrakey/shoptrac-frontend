<i18n src="@/lang/common.json"></i18n>

<template>
    <div id="toast-container">
        <div v-for="(message, idx) in messages" :key="idx" :class="['toast', 'w3-card', 'w3-leftbar', `w3-border-${message.color}`]">
            <div :class="['toast-title', `w3-text-${message.color}`]" v-if="typeof message.title !== 'undefined' && message.title !== ''">{{ message.title }}</div>
            <p class="toast-text" v-html="message.text"></p>
            <div class="toast-footer-container w3-right-align" v-if="typeof message.timeout === 'undefined' || message.timeout <= 0">
                <button class="w3-button st-button-theme st-button-theme-hover w3-tiny"
                        @click="removeMessage(message)">OK</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
#toast-container {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 25%;
    z-index: 99;
}

.toast {
    padding: 10px;
    background: #fff;
    margin-bottom: 10px;
}

.toast-title {
    font-size: 1.1em;
    font-weight: bold;
}

.toast-text {
    max-height: 200px;
    overflow-y: auto;
}

.toast-footer-container {
    border-top: 1px solid #ccc;
    margin-top: 10px;
    padding-top: 10px;
}
</style>

<script>
import EventBus from '@/utils/EventBus'

export default {
    data () {
        return {
            colors: ['red', 'green', 'blue', 'yellow'],
            messages: []
        }
    },

    created () {
        EventBus.$on('toast', this.addMessage)
    },

    destroyed () {
        EventBus.$off('toast', this.addMessage)
    },

    methods: {
        addMessage (event) {
            var self = this

            if (typeof event.message !== 'object') {
                throw 'Cannot process toast event without message object.'
            }

            var msg = self.createMessage(event.message)
            self.messages.push(msg)

            if (msg.timeout > 0) {
                window.setTimeout(() => self.removeMessage(msg), msg.timeout)
            }
        },

        removeMessage (message) {
            var self = this
            for (var i = 0; i < self.messages.length; ++i) {
                var msg = self.messages[i]
                if (msg.id === message.id) {
                    self.messages.splice(i, 1)
                    return
                }
            }
        },

        createMessage (data) {
            if (typeof data.text !== 'string' || data.text === '') {
                throw `Cannot process toast without text: ${JSON.stringify(data, null, ' ')}`
            }

            return {
                id: new Date().getTime(),
                color: typeof data.color === 'string' && this.colors.includes(data.color) ? data.color : 'blue',
                title: typeof data.title === 'string' ? data.title : '',
                text: data.text,
                timeout: typeof data.timeout === 'number' && data.timeout >= 0 ? data.timeout : 2500
            }
        }
    }
}
</script>