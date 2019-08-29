<i18n src="@/lang/common.json"></i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': action !== '' }]">
        <div class="w3-modal-content w3-card w3-border w3-round">
            <img class="spinner" src="@/assets/img/spinner-48-primary.gif">
            <span class="action">{{ action }}</span>
        </div>
    </div>
</template>

<style scoped>
.w3-modal-content {
    width: 33%;
    padding: 20px;
}

.spinner {
    margin-right: 20px;
}
</style>

<script>
export default {
    data () {
        return {
            action: ''
        }
    },

    methods: {
        setAction (action) {
            if (typeof action === 'string') {
                this.action = action
            }
        }
    }
}
</script>