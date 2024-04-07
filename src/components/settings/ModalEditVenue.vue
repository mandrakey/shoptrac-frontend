<!--
SPDX-FileCopyrightText: Maurice Bleuel <mandrakey@litir.de>
SPDX-License-Identifier: BSD-3-Clause
-->

<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "addVenue": "Add venue",
        "editVenue": "Edit venue",
        "image": "Image",
        "selectImage": "Select image",
        "venueName": "Venue name",

        "pleaseEnterAVenueName": "Please enter a venue name.",

        "savingVenueData": "Saving venue data ...",
        "venueHasBeenSaved": "Venue has been saved.",

        "errors": {
            "failedToLoadImage": "Failed to load the image.",
            "failedToSaveVenue": "Failed to save the venue."
        }
    }
}
</i18n>

<template>
    <div :class="['w3-modal', { 'w3-show': showDialog }]">
        <div class="w3-modal-content w3-card">
            <div class="w3-theme w3-padding st-modal-header">
                {{ $t(mode === 'edit' ? 'editVenue' : 'addVenue') }}
            </div>

            <form class="w3-form">
            <div class="w3-padding">
                <div class="w3-row">
                    <div class="w3-col w3-third w3-padding">
                        {{ $t('venueName') }}:
                    </div>
                    <div class="w3-col w3-twothird">
                        <input type="text" class="w3-input" v-model="venue.name">
                    </div>
                </div>

                <div class="w3-row">
                    <div class="w3-col w3-third w3-padding">
                        {{ $t('image') }}:
                    </div>
                    <div class="w3-col w3-twothird">
                        <input type="file" class="file-input" ref="FileInput" @change="fileInput_Change">
                        <img :src="`data:image/png;base64,${venue.image}`" class="w3-border venue-image" :alt="$t('venue')">
                        <button class="w3-button st-button-theme st-button-theme-hover w3-small"
                                @click="selectImage_Click()">
                            {{ $t('selectImage') }}
                        </button>
                    </div>
                </div>
            </div>
            </form>

            <div class="w3-padding st-modal-footer w3-row">
                <div class="w3-col w3-half w3-padding st-loading w3-text-theme">
                    <div v-show="action !== ''">
                        <img class="action-loading" src="@/assets/img/spinner-24-complement.gif" :alt="$t('loading')">
                        <div class="action">{{ action }}</div>
                    </div>
                </div>

                <div class="w3-col w3-half w3-right-align">
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="cancel_Click()">
                        {{ $t('buttonlabels.cancel') }}
                    </button>
                    <button class="w3-button w3-small st-button-theme st-button-theme-hover"
                            @click="save_Click()">
                        {{ $t('buttonlabels.save') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.venue-image {
    width: 64px;
    height: 64px;
    margin-right: 10px;
}

.file-input {
    display: none;
}

.st-loading {
    font-size: .8em;
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

export default {
    data () {
        return {
            showDialog: false,
            mode: 'add',
            action: '',
            venue: new Venue()
        }
    },

    methods: {
        selectImage_Click () {
            this.$refs['FileInput'].click()
        },

        fileInput_Change (event) {
            const self = this

            const file = event.target.files[0]
            if (typeof file === 'undefined' || file === null) {
                return
            }

            const rdr = new FileReader()
            rdr.onload = e => {
                if (typeof e.target.result !== 'string') {
                    window.toast({
                        text: self.$i18n.t('errors.failedToLoadImage'),
                        color: 'red',
                        timeout: 0
                    })
                    return
                }
                self.venue.image = btoa(e.target.result)
            }
            rdr.readAsBinaryString(file)
        },

        cancel_Click () {
            this.venue = new Venue()
            this.action = ''
            this.showDialog = false
        },

        save_Click () {
            if (this.mode === 'add') {
                this.doAddVenue()
            } else {
                this.doUpdateVenue()
            }
        },

        doUpdateVenue () {
            const self = this

            if (typeof self.venue._key !== 'string' || self.venue._key === ''
                    || self.venue.name === '') {
                window.toast({
                    text: self.$i18n.t('errors.failedToSaveVenue'),
                    color: 'red'
                })
                return
            }

            self.action = self.$i18n.t('savingVenueData')
            Api.updateVenue(self.venue)
                .then(resp => {
                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('errors.failedToSaveVenue'),
                            color: 'red'
                        })
                        return
                    }

                    window.toast({
                        text: self.$i18n.t('venueHasBeenSaved'),
                        color: 'green'
                    })
                    self.showDialog = false
                    self.$emit('update', { venue: self.venue })
                    self.venue = new Venue()
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication', [err]),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        doAddVenue () {
            const self = this

            if (self.venue.name === '') {
                window.toast({
                    text: self.$i18n.t('pleaseEnterAVenueName'),
                    color: 'yellow'
                })
                return
            }

            self.action = self.$i18n.t('savingVenueData')
            Api.addVenue(self.venue)
                .then(resp => {
                    if (resp.status !== 200) {
                        window.toast({
                            text: self.$i18n.t('errors.failedToSaveVenue'),
                            color: 'red'
                        })
                        return
                    }

                    if (typeof resp.data !== 'object') {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    window.toast({
                        text: self.$i18n.t('venueHasBeenSaved'),
                        color: 'green'
                    })
                    self.showDialog = false
                    self.$emit('add', { venue: Venue.fromObject(resp.data) })
                    self.venue = new Venue()
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('errors.apiCommunication', [err]),
                        color: 'red'
                    })
                })
                .finally(() => self.action = '')
        },

        show (mode, venue = null) {
            if (!['add', 'edit'].includes(mode)) {
                return
            }
            if (mode === 'edit') {
                if (typeof venue === 'undefined' || venue === null) {
                    return
                }
                this.venue = Venue.fromObject(venue)
            }

            this.mode = mode
            this.showDialog = true
        }
    }
}
</script>