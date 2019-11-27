<i18n src="@/lang/common.json"></i18n>

<template>
  <div class="w3-padding">
    <div class="chart-select w3-center">
      <button
        :class="['w3-button', 'w3-bar-item', 'w3-round', 'w3-small', (currentView === 'overall' ? 'background-primary-3 hover-primary-3 border-primary-0' : 'border-primary-0 hover-primary-3')]"
      >Overall</button>
      <button
        :class="['w3-button', 'w3-bar-item', 'w3-round', 'w3-small', (currentView === 'venue' ? 'background-primary-3 hover-primary-3 border-primary-0' : 'border-primary-0 hover-primary-3')]"
      >By venue</button>
      <button
        :class="['w3-button', 'w3-bar-item', 'w3-round', 'w3-small', (currentView === 'category' ? 'background-primary-3 hover-primary-3 border-primary-0' : 'border-primary-0 hover-primary-3')]"
      >By category</button>
    </div><br>

    <div class="inline-form w3-center">
      Month:
      <select class="w3-input w3-border">
        <option value="">-</option>
        <option v-for="(m, idx) in $t('months')" :key="idx" :value="idx">{{ m }}</option>
      </select>&nbsp;
      Year:
      <select class="w3-input w3-border">
        <option value="">-</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
    </div>

    <!-- OVERALL -->
    <div v-show="currentView === 'overall'" class="w3-row">
      <div class="w3-col w3-third">
        <canvas ref="chartOverall"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inline-form .w3-input {
  width: auto;
  display: inline-block;
  min-width: 80px;
  padding: 3px;
  font-size: 0.8em;
}

.chart-select button {
  margin-right: 10px;
}
</style>

<script>
import Api from 'api'
import Chart from 'chart.js'

export default {
  data () {
    return {
      currentView: 'overall',
      years: [],
      graphs: []
    }
  },

  mounted () {
    this.loadYears()
    this.loadGraphs()
  },

  methods: {
    loadYears () {
      var self = this

      Api.getYears()
        .then(resp => {
          if (!(resp.data instanceof Array)) {
            window.toast({
              text: self.$i18n.t('failedToLoadExistingYears'),
              color: 'red'
            })
            return
          }

          self.years = resp.data.map(y => `${y}`)
        })
        .catch(() => {
          window.toast({
            text: self.$i18n.t('failedToLoadExistingYears'),
            color: 'red'
          })
        })
    },

    loadGraphs () {
      var self = this

      self.loadStatisticsOverallDevelopment('', '', 'sum')
    },

    loadStatisticsOverallDevelopment (month, year, type) {
      var self = this

      Api.getStatisticsOverallDevelopment(month, year, type)
        .then(resp => {
          var ctx = self.$refs['chartOverall']
          var chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: Object.keys(resp.data.raw),
              datasets: [
                {
                  label: 'sum of purchases',
                  data: Object.values(resp.data.raw),
                  borderColor: '#006E6E'
                },
                {
                  label: 'mean',
                  data: Object.values(resp.data.raw).map(() => resp.data.computed.mean),
                  borderColor: '#B70000',
                  fill: false
                },
                {
                  label: 'media',
                  data: Object.values(resp.data.raw).map(() => resp.data.computed.median),
                  borderColor: '#888888',
                  fill: false
                }
              ]
            }
          })
        })
        .catch(err => {
          console.log(err)
          window.toast({
            text: self.$i18n.t('failedToLoadGraphs'),
            color: 'red'
          })
        })
    }
  }
}
</script>