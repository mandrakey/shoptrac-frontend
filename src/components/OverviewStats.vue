<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "purchases": "purchases",
        "lastMonth": "Last month",
        "currentMonth": "Current month",
        "allTime": "All time"
    }
}
</i18n>

<template>
    <div class="container">
        <div class="w3-row">
            <div class="w3-col w3-third stats-heading">{{ $t('lastMonth') }}</div>
            <div class="w3-col w3-third stats-heading">{{ $t('currentMonth') }}</div>
            <div class="w3-col w3-third stats-heading">{{ $t('allTime') }}</div>
        </div>
        <div class="w3-row">
            <div class="w3-col w3-third stats">
                <span v-if="lastMonth !== null && typeof lastMonth === 'object'">
                    {{ `${lastMonth.count} ${$t('purchases')}: ${$t('currencySymbol')} ${lastMonth.sum}` }}
                </span>
                <span v-else>{{ $t('N/A') }}</span>
            </div>
            <div class="w3-col w3-third stats">
                <span v-if="lastMonth !== null && typeof currentMonth === 'object'">
                    {{ `${currentMonth.count} ${$t('purchases')}: ${$t('currencySymbol')} ${currentMonth.sum}` }}
                </span>
                <span v-else>{{ $t('N/A') }}</span>
            </div>
            <div class="w3-col w3-third stats">
                <span v-if="lastMonth !== null && typeof allTime === 'object'">
                    {{ `${allTime.count} ${$t('purchases')}: ${$t('currencySymbol')} ${allTime.sum}` }}
                </span>
                <span v-else>{{ $t('N/A') }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    margin: 10px 0 10px 0;
}

.stats-heading {
    font-size: .8em;
    text-decoration: underline;
}

.stats {
    font-size: .8em;
}
</style>

<script>
import Api from 'api'
import Console from '@/utils/Console'
import EventBus from '@/utils/EventBus'

export default {
    props: {
        month: {
            type: Number,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    },

    data () {
        return {
            lastMonth: null,
            currentMonth: null,
            allTime: null
        }
    },

    watch: {
        month (n, o) {
            if (n !== o) {
                this.reload()
            }
        },

        year (n, o) {
            if (n !== o) {
                this.reload()
            }
        }
    },

    mounted () {
        EventBus.$on('reload-overview-stats', this.reload)
    },

    destroyed () {
        EventBus.$off('reload-overview-stats', this.reload)
    },

    methods: {
        reload () {
            const self = this

            Api.getOverviewStatistics(self.month, self.year)
                .then(resp => {
                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('failedToLoadStatistics'),
                            color: 'red'
                        })
                        return
                    }

                    if (resp.data === null || typeof resp.data !== 'object' || 
                            typeof resp.data.lastMonth !== 'object' || 
                            typeof resp.data.currentMonth !== 'object' || 
                            typeof resp.data.allTime !== 'object') {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        Console.debug(`Invalid API response: ${JSON.stringify(resp)}`)
                        return
                    }

                    self.lastMonth = resp.data.lastMonth
                    self.currentMonth = resp.data.currentMonth
                    self.allTime = resp.data.allTime
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('errors.invalidApiResponse'),
                        color: 'red'
                    })
                    Console.debug(`Failed to load overview statistics: ${err}`)
                })
        }
    }
}
</script>