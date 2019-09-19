<i18n src="@/lang/common.json"></i18n>
<i18n>
{
    "en": {
        "settings": "Settings",
        "settingsDescription": "Here you can edit categories and venues.",
        "venues": "Venues",
        "noVenuesFound": "No venues found.",
        "addVenue": "Add venue",

        "categories": "Categories",
        "noCategoriesFound": "No categories found.",
        "addCategory": "Add category"
    }
}
</i18n>

<template>
    <div class="w3-row w3-padding">
        <modal-delete-venue ref="ModalDeleteVenue"
                @deleted="finishDeleteVenue($event)"></modal-delete-venue>
        <modal-edit-venue ref="ModalEditVenue"
                @update="finishEditVenue($event)" @add="finishAddVenue($event)"></modal-edit-venue>
        <modal-delete-category ref="ModalDeleteCategory"
                @deleted="finishDeleteCategory($event)"></modal-delete-category>
        <modal-edit-category ref="ModalEditCategory"
                @update="finishEditCategory($event)" @add="finishAddCategory($event)"></modal-edit-category>

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

        <!-- List of categories -->
        <br>
        <div class="w3-border">
            <div class="background-primary-0 w3-padding w3-display-container">
                {{ categories.length }} {{ $t('categories') }}
                <div class="w3-display-topright" style="padding-top: 4px; padding-right: 4px;">
                    <button class="w3-button w3-round w3-tiny background-primary-4 hover-primary-4"
                            @click="beginAddCategory()">
                        <strong>{{ $t('addCategory') }}</strong>
                    </button>
                </div>
            </div>

            <div>
                <div v-show="loadingCategories" class="w3-center">
                    <img src="@/assets/img/spinner-48-primary.gif" alt="Loading categories ...">
                </div>

                <div v-show="!loadingCategories" id="categoryItemsContainer">
                    <p v-show="categories.length === 0" class="w3-padding">{{ $t('noCategoriesFound') }}</p>
                    <category-list-item v-for="c in categories" :key="c.key"
                            :category="c" :selected="selectedCategory === c.key"
                            @click="category_Click($event)"
                            @edit="beginEditCategory(c)"
                            @delete="beginDeleteCategory(c)">
                    </category-list-item>
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

#categoryItemsContainer {
    max-height: 500px;
    overflow-y: auto;
    border: 1px solid #333;
}
</style>

<script>
import Api from 'api'
import Console from '@/utils/Console'

import Venue from '@/model/Venue'
import Category from '@/model/Category'

import ModalDeleteVenue from '@/components/settings/ModalDeleteVenue'
import ModalEditVenue from '@/components/settings/ModalEditVenue'
import VenueListItem from '@/components/VenueListItem'
import ModalDeleteCategory from '@/components/settings/ModalDeleteCategory'
import ModalEditCategory from '@/components/settings/ModalEditCategory'
import CategoryListItem from '@/components/CategoryListItem'

export default {
    components: {
        ModalDeleteVenue,
        ModalEditVenue,
        VenueListItem,
        ModalDeleteCategory,
        ModalEditCategory,
        CategoryListItem
    },

    data () {
        return {
            loadingVenues: false,
            venues: [],
            selectedVenue: null,

            loadingCategories: false,
            categories: [],
            selectedCategory: null
        }
    },

    mounted () {
        this.loadVenues()
        this.loadCategories()
    },

    destroyed () {
    },

    methods: {
        // ====
        // Venue methods

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
                    return
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
        },

        // ====
        // Category methods

        loadCategories () {
            var self = this

            self.loadingCategories = true
            Api.getCategories()
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
                            text: self.$i18n.t('loadingCategoriesFailed'),
                            color: 'red'
                        })
                        return
                    }

                    if (!(resp.data instanceof Array)) {
                        window.toast({
                            text: self.$i18n.t('errors.invalidApiResponse'),
                            color: 'red'
                        })
                        return
                    }

                    // Categories loaded
                    self.categories = resp.data.map(row => Category.fromObject(row))
                })
                .catch(err => {
                    window.toast({
                        text: self.$i18n.t('loadingCategoriesFailed'),
                        color: 'red'
                    })
                    Console.error(`Failed yo load categories: ${JSON.stringify(err)}`)
                })
                .finally(() => self.loadingCategories = false)
        },

        category_Click (event) {
            if (event.category instanceof Category) {
                var key = event.category.key

                this.selectedCategory = this.selectedCategory === key ? null : key
            }
        },

        beginAddCategory () {
            this.$refs['ModalEditCategory'].show('add', null)
        },

        finishAddCategory (event) {
            if (!(event.category instanceof Category)) {
                return
            }

            this.categories.push(event.category)
        },

        beginEditCategory () {
            for (var i in this.categories) {
                var c = this.categories[i]
                if (c.key === this.selectedCategory) {
                    this.$refs['ModalEditCategory'].show('edit', c)
                    return
                }
            }
        },

        finishEditCategory (event) {
            if (typeof event.category !== 'object') {
                return
            }

            var category = event.category
            for (var i in this.categories) {
                var c = this.categories[i]
                if (c.key === category.key) {
                    c.name = category.name
                    return
                }
            }
        },

        beginDeleteCategory (category) {
            this.$refs['ModalDeleteCategory'].show(category)
        },

        finishDeleteCategory (event) {
            if (!(event.category instanceof Category)) {
                return
            }

            var category = event.category
            this.categories = this.categories.filter(c => c.key !== category.key)
            if (this.selectedCategory === category.key) {
                this.selectedCategory = null
            }
        }
    }
}
</script>