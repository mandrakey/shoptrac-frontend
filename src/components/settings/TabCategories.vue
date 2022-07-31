<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/settings.categories.json"></i18n>

<template>
  <div>
    <modal-delete-category ref="ModalDeleteCategory" @deleted="onFinishDeleteCategory($event)" />
    <modal-edit-category ref="ModalEditCategory" @update="onFinishEditCategory($event)" @add="onFinishAddCategory($event)" />

    <div class="w3-padding">
      <button class="w3-button st-button-theme w3-small" @click="onBeginAddCategory()">
        {{ $t('Add category') }}
      </button>
    </div>

    <div v-show="loading" class="w3-center">
      <img src="@/assets/img/spinner-48-primary.gif" alt="Loading categories ..." />
    </div>
    <div v-show="!loading" class="category-list-box">
      <p v-show="categories.length === 0" class="w3-padding">
        {{ $t('No categories found') }}
      </p>
      <category-list-item v-for="c in categories" :key="c._key" :category="c" :selected="selected === c._key"
          @click="onCategoryClicked($event)" @edit="onBeginEditCategory(c)" @delete="onBeginDeleteCategory(c)" />
      
      <p class="w3-tiny w3-right-align category-count"><strong>{{ categories.length }} {{ $t('Categories') }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.category-list-box {
  border-top: 1px solid #000;
}

.category-count {
  padding-right: 10px;
}
</style>

<script>
import Api from 'api'
import Store from '@/store'

import Category from '@/model/Category'

import CategoryListItem from '@/components/CategoryListItem'
import ModalDeleteCategory from '@/components/settings/ModalDeleteCategory'
import ModalEditCategory from '@/components/settings/ModalEditCategory'

export default {
  components: {
    CategoryListItem,
    ModalDeleteCategory,
    ModalEditCategory
  },

  data() {
    return {
      loading: false,
      categories: [],
      selected: null
    }
  },

  mounted() {
    this.loadCategories()
  },

  methods: {
    loadCategories() {
      const self = this

      self.loading = true
      Api.getCategories()
        .then(resp => {
          if (!(resp.data instanceof Array)) {
            window.toast({
              text: self.$i18n.t('errors.invalidApiResponse'),
              color: 'red'
            })
            return
          }

          self.categories = resp.data.map(row => Category.fromObject(row))
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('Failed to load categories'),
            color: 'red'
          })
        })
        .finally(() => self.loading = false)
    },

    onCategoryClicked(event) {
      if (typeof event.category === 'object') {
        const key = event.category._key
        this.selected = this.selected === key ? null : key
      }
    },

    onBeginAddCategory() {
      const modal = this.$refs['ModalEditCategory']
      if (typeof modal == 'object') {
        modal.show('add', null)
      }
    },

    onFinishAddCategory(event) {
      if (!(event.category instanceof Category)) {
        return
      }

      this.categories.push(event.category)
      this.commitCategories()
    },

    onBeginEditCategory(category) {
      if (!(category instanceof Category)) {
        return
      }

      const modal = this.$refs['ModalEditCategory']
      if (typeof modal === 'object') {
        modal.show('edit', category)
      }
    },

    onFinishEditCategory(event) {
      if (!(event.category instanceof Category)) {
        return
      }

      for (const i in this.categories) {
        let c = this.categories[i]
        if (c._key === event.category._key) {
          c.name = event.category.name
          this.commitCategories()
          return
        }
      }
    },

    onBeginDeleteCategory(category) {
      if (!(category instanceof Category)) {
        return
      }

      const modal = this.$refs['ModalDeleteCategory']
      if (typeof modal === 'object') {
        modal.show(category)
      }
    },

    onFinishDeleteCategory(event) {
      if (!(event.category instanceof Category)) {
        return
      }

      this.categories = this.categories.filter(c => c._key !== event.category._key)
      this.commitCategories()
      if (this.selected === event.category._key) {
        this.selected = null
      }
    },

    commitCategories() {
      Store.commit('categories', this.categories)
    }
  }
}
</script>
