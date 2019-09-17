<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "settings": "Settings",
        "settingsDescription": "Here you can edit categories and venues.",
        "venues": "Venues",
        "noVenuesFound": "No venues found.",
        "addVenue": "Add venue"
    }
}
</i18n>

<template>
    <div class="w3-row w3-padding">
        <modal-delete-venue ref="ModalDeleteVenue"
                @deleted="finishDeleteVenue($event)"></modal-delete-venue>
        <modal-edit-venue ref="ModalEditVenue"
                @update="finishEditVenue($event)" @add="finishAddVenue($event)"></modal-edit-venue>

        <h2>{{ $t('settings') }}</h2>
        <p>{{ $t('settingsDescription') }}</p>

        <!-- List of venues -->
        <div class="w3-border">
            <div class="background-primary-0 w3-padding w3-display-container">
                {{ venues.length }} {{ $t('venues') }}
                <div class="w3-display-topright" style="padding-top: 4px; padding-right: 4px;">
                    <button class="w3-button w3-round w3-tiny background-primary-4 hover-primary-4"
                            @click="beginAddVenue()">
                        <strong>{{ $t('addVenue') }}</strong>
                    </button>
                </div>
            </div>
            
            <div>
                <div v-show="loadingVenues" class="w3-center">
                    <img src="@/assets/img/spinner-48-primary.gif" alt="Loading venues ...">
                </div>

                <div v-show="!loadingVenues" id="venueItemsContainer">
                    <p v-show="venues.length === 0" class="w3-padding">{{ $t('noVenuesFound') }}</p>
                    <venue-list-item v-for="v in venues" :key="v.key"
                            :venue="v" :selected="selectedVenue === v.key"
                            @click="venue_Click($event)"
                            @edit="beginEditVenue(v)"
                            @delete="beginDeleteVenue(v)"></venue-list-item>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#venueItemsContainer {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #333;
}
</style>

<script>
import Api from 'api'
import Console from '@/utils/Console'

import Venue from '@/model/Venue'

import ModalDeleteVenue from '@/components/settings/ModalDeleteVenue'
import ModalEditVenue from '@/components/settings/ModalEditVenue'
import VenueListItem from '@/components/VenueListItem'

export default {
    components: {
        ModalDeleteVenue,
        ModalEditVenue,
        VenueListItem
    },

    data () {
        return {
            loadingVenues: false,
            venues: [],
            selectedVenue: null
        }
    },

    mounted () {
        this.loadVenues()
    },

    destroyed () {
    },

    methods: {
        loadVenues () {
            var self = this

            self.loadingVenues = true
            Api.getVenues()
                .then(resp => {
                    if (typeof resp.status !== 'number') {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('loadingVenuesFailed'),
                            color: 'red'
                        })
                        Console.error(`Failed to load venues: ${JSON.stringify(resp)}`)
                        return
                    }

                    if (!(resp.data instanceof Array)) {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    // Venues loaded
                    self.venues = resp.data.map(row => Venue.fromObject(row))
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('loadingVenuesFailed'),
                        color: 'red'
                    })
                    Console.error(`Failed to load venues: ${JSON.stringify(err)}`)
                })
                .finally(() => self.loadingVenues = false)
        },

        venue_Click (event) {
            if (typeof event.venue === 'object') {
                var key = event.venue.key

                this.selectedVenue = this.selectedVenue === key ? null : key
            }
        },

        beginAddVenue () {
            var modal = this.$refs['ModalEditVenue']
            modal.show('add', null)
        },

        finishAddVenue (event) {
            if (!(event.venue instanceof Venue)) {
                return
            }

            this.venues.push(event.venue)
        },

        beginEditVenue () {
            for (var i in this.venues) {
                var venue = this.venues[i]
                if (venue.key === this.selectedVenue) {
                    var modal = this.$refs['ModalEditVenue']
                    modal.show('edit', venue)
                }
            }
        },

        finishEditVenue (event) {
            if (typeof event.venue !== 'object') {
                return
            }

            var venue = event.venue
            for (var i in this.venues) {
                var v = this.venues[i]
                if (v.key === venue.key) {
                    // Update!
                    v.name = venue.name
                    v.image = venue.image
                    return
                }
            }
        },

        beginDeleteVenue (venue) {
            this.$refs['ModalDeleteVenue'].show(venue)
        },

        finishDeleteVenue (event) {
            if (typeof event.venue !== 'object') {
                return
            }

            var venue = event.venue
            this.venues = this.venues.filter(v => v.key !== venue.key)
            if (this.selectedVenue === venue.key) {
                this.selectedVenue = null
            }
        }
    }
}
</script>