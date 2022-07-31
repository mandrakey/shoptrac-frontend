<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.venues.json"></i18n>

<template>
  <div>
    <modal-delete-venue ref="ModalDeleteVenue" @deleted="onFinishDeleteVenue($event)" />
    <modal-edit-venue ref="ModalEditVenue" @update="onFinishEditVenue($event)" @add="onFinishAddVenue($event)" />

    <div class="w3-padding">
      <button class="w3-button st-button-theme w3-small" @click="onBeginAddVenue()">
        {{ $t('Add venue') }}
      </button>
    </div>

    <div v-show="loading" class="w3-center">
      <img src="@/assets/img/spinner-48-primary.gif" alt="Loading venues ..." />
    </div>
    <div v-show="!loading" class="venue-list-box">
      <p v-show="venues.length === 0" class="w3-padding">
        {{ $t('No venues found') }}
      </p>
      <venue-list-item v-for="v in venues" :key="v._key" :venue="v" :selected="selected === v._key"
          @click="onVenueClicked($event)" @edit="onBeginEditVenue(v)" @delete="onBeginDeleteVenue(v)" />
      
      <p class="w3-tiny w3-right-align venue-count"><strong>{{ venues.length }} {{ $t('Venues') }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.venue-list-box {
  border-top: 1px solid #000;
}

.venue-count {
  padding-right: 10px;
}
</style>

<script>
import Api from 'api'
import store from "@/store";

import Venue from '@/model/Venue'

import VenueListItem from '@/components/VenueListItem'
import ModalDeleteVenue from "@/components/settings/ModalDeleteVenue";
import ModalEditVenue from "@/components/settings/ModalEditVenue";

export default {
  components: {
    VenueListItem,
    ModalDeleteVenue,
    ModalEditVenue
  },

  data() {
    return {
      loading: false,
      venues: [],
      selected: null
    }
  },

  mounted() {
    this.loadVenues()
  },

  methods: {
    loadVenues() {
      const self = this

      self.loading = true
      Api.getVenues()
        .then(resp => {
          if (!(resp.data instanceof Array)) {
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          self.venues = resp.data.map(row => Venue.fromObject(row))
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to load venues'),
            color: 'red'
          })
        })
        .finally(() => self.loading = false)
    },

    onVenueClicked(event) {
      if (typeof event.venue === 'object') {
        const key = event.venue._key
        this.selected = this.selected === key ? null : key
      }
    },

    onBeginAddVenue() {
      const modal = this.$refs['ModalEditVenue']
      if (typeof modal !== 'object') {
        return
      }
      modal.show('add', null)
    },

    onFinishAddVenue(event) {
      if (!(event.venue instanceof Venue)) {
        return
      }

      this.venues.push(event.venue)
      this.commitVenues()
    },

    onBeginEditVenue(venue) {
      const modal = this.$refs['ModalEditVenue']
      if (typeof modal !== 'object') {
        return
      }
      modal.show('edit', venue)
    },

    onFinishEditVenue(event) {
      if (!(event.venue instanceof Venue)) {
        return
      }

      for (const i in this.venues) {
        let v = this.venues[i]
        if (v._key === event.venue._key) {
          v.name = event.venue.name
          v.image = event.venue.image
          this.commitVenues()
          return
        }
      }
    },

    onBeginDeleteVenue(venue) {
      const modal = this.$refs['ModalDeleteVenue']
      if (typeof modal !== 'object') {
        return
      }
      modal.show(venue)
    },

    onFinishDeleteVenue(event) {
      if (!(event.venue instanceof Venue)) {
        return
      }

      this.venues = this.venues.filter(v => v._key !== event.venue._key)
      this.commitVenues()
      if (this.selected === event.venue._key) {
        this.selected = null
      }
    },

    commitVenues() {
      store.commit('venues', this.venues)
    }
  }
}
</script>
