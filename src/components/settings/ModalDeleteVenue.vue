<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "deleteVenue": "Delete venue",
        "deleteVenueInfo1": "Do you really want to delete the following venue?",
        "deleteVenueInfo2": "This action can not be undone.",
        "deletingVenue": "Deleting venue ...",
        "venueHasBeenDeleted": "Venue has been deleted."
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t('deleteVenue') }}
            </div>

            <div class="w3-padding">
                <p>{{ $t('deleteVenueInfo1') }}</p>
                <p><venue-list-item v-if="venue !== null" :venue="venue" class="venue-item"></venue-list-item></p>
                <p>{{ $t('deleteVenueInfo2') }}</p>
            </div>

            <div class="w3-padding st-modal-footer w3-row">
                <div class="w3-col w3-half w3-padding st-loading w3-text-theme">
                    <div v-show="action !== ''">
                        <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" alt="loading">
                        <div class="action">{{ action }}</div>
                    </div>
                </div>

                <div class="w3-col w3-half w3-right-align">
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="cancel_Click()">Cancel</button>
                    <button class="w3-button w3-small st-button-theme w3-hover-red"
                            @click="delete_Click()">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.w3-modal-content {
    border-radius: 5px;
    overflow: hidden;
}

.st-loading {
    font-size: .8em;
}

.venue-item {
    border: 1px solid #000;
    cursor: default;
}

.action-loading {
    float: left;
}

.action {
    padding-top: 3px;
    float: left;
}
</style>

<script>
import Api from 'api'

import Venue from '@/model/Venue'

import VenueListItem from '@/components/VenueListItem'

export default {
    components: {
        VenueListItem
    },

    data () {
        return {
            showDialog: false,
            action: '',
            venue: null
        }
    },

    methods: {
        cancel_Click () {
            this.showDialog = false
            this.venue = null
        },

        delete_Click () {
            var self = this

            self.action = self.$i18n.t('deletingVenue')
            Api.deleteVenue(self.venue)
                .then(resp => {
                    if (typeof resp.status !== 'number') {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    if (resp.status === 200) {
                        window.toast({
                            text: self.$i18n.t('venueHasBeenDeleted'),
                            color: 'green'
                        })
                        self.showDialog = false
                        self.$emit('deleted', { venue: self.venue })
                        self.venue = null
                    } else {
                        window.toast({
                            text: self.$i18n.t('failedToDeleteVenue'),
                            color: 'red'
                        })
                    }
                })
                .catch(() => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication'),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        show (venue) {
            if (venue instanceof Venue) {
                this.venue = venue
                this.showDialog = true
            }
        }
    }
}
</script>