<i18n src="@/lang/common.json"></i18n>
<i18n src="@/lang/statistics.json"></i18n>

<template>
  <div class="w3-padding">
    <div class="w3-row">
      <div class="w3-third filter-selectors">
        <year-select :value="currentYear" :years="years" @selected="yearChanged"></year-select>
      </div>
      <div class="w3-third filter-selectors">
        <category-select allow-empty :value="-1" @selected="categoryChanged"></category-select>
      </div>
      <div class="w3-third filter-selectors">
        <venue-select allow-empty :value="-1" @selected="venueChanged"></venue-select>
      </div>
    </div>

    <!-- OVERALL -->
    <p v-show="loading" class="w3-center">
      <img src="@/assets/img/spinner-48-primary.gif" :alt="$t('loading')"><br>
      {{ $t('loadingStatistics') }}
    </p>
    <div v-show="!loading" class="w3-row">
      <div class="w3-col">
        <canvas ref="chartPurchasesPerMonth"></canvas>
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

.filter-selectors {
  padding: 15px;
}
</style>

<script>
import Api from 'api'
import Chart from 'chart.js'

import CategorySelect from '@/components/CategorySelect'
import VenueSelect from '@/components/VenueSelect'
import YearSelect from '@/components/YearSelect'

export default {
  components: {
    CategorySelect,
    VenueSelect,
    YearSelect
  },

  data () {
    return {
      loading: true,

      currentYear: new Date().getFullYear(),
      currentCategory: -1,
      currentVenue: -1,
      
      chart: null,
      chartData: null,
      chartOptions: null,
      
      purchases: [],
      years: [],
      months: []
    }
  },

  mounted () {
    var self = this

    var monthsRaw = self.$i18n.t('months')
    for (var i in monthsRaw) {
      self.months.push(monthsRaw[i])
    }

    this.loadStatisticsData()
  },

  methods: {
    loadStatisticsData () {
      var self = this

      self.loading = true
      Api.getPurchasesUnfiltered()
        .then(resp => {
          if (!(resp.data instanceof Object)) {
            window.toast({
              text: self.$i18n.t('failedToLoadStatisticsData'),
              color: 'red'
            })
            return
          }

          // Check data
          if (!(resp.data.meta instanceof Object) || !(resp.data.purchases instanceof Array)) {
            window.toast({
              text: self.$i18n.t('failedToLoadStatisticsData'),
              color: 'red'
            })
            return
          }

          self.purchases = resp.data.purchases
          self.years = resp.data.meta.years

          // Select current (or newest) year
          if (!self.years.includes(self.currentYear)) {
            self.currentYear = self.years[self.years.length - 1]
          }

          self.createPurchasesPerMonthChart()
        })
        .catch(() => {
          window.toast({
            text: 'failedToLoadStatisticsData',
            color: 'red'
          })
        })
        .finally(() => self.loading = false)
    },

    yearChanged (event) {
      this.currentYear = event.year
      this.updatePurchasesPerMonthChart()
    },

    categoryChanged (event) {
      this.currentCategory = event.category
      this.updatePurchasesPerMonthChart()
    },

    venueChanged (event) {
      this.currentVenue = event.venue
      this.updatePurchasesPerMonthChart()
    },

    createPurchasesPerMonthChart () {
      var self = this

      self.chartData = {
        labels: self.months,
        datasets: [
          {
            label: `${self.$i18n.t('sum')} (${self.$i18n.t('currencySymbol')})`,
            data: [],
            type: 'line',
            fill: false,
            lineTension: 0,
            clip: 0,
            borderColor: 'rgba(183, 122, 0, 1)',
            yAxisID: 'sum'
          },
          {
            label: self.$i18n.t('amountOfPurchases'),
            data: [],
            backgroundColor: 'rgba(0, 110, 110, .5)',
            yAxisID: 'count'
          }
        ]
      }
      self.chartOptions = {
        scales: {
          yAxes: [
            {
              id: 'sum',
              position: 'right',
              ticks: {
                min: 0,
                max: 1,
                stepSize: 100
              },
              scaleLabel: {
                display: true,
                labelString: `${self.$i18n.t('sum')} (${self.$i18n.t('currencySymbol')})`,
                fontStyle: 'italic'
              },
            },
            {
              id: 'count',
              position: 'left',
              ticks: {
                min: 0,
                max: 1,
                stepSize: 10
              },
              scaleLabel: {
                display: true,
                labelString: self.$i18n.t('amountOfPurchases'),
                fontStyle: 'italic'
              },
            }
          ]
        }
      }

      var ctx = self.$refs['chartPurchasesPerMonth']
      ctx.height = 100;
      self.chart = new Chart(
        ctx,
        {
          type: 'bar',
          data: self.chartData,
          options: self.chartOptions
        }
      )

      self.updatePurchasesPerMonthChart()
    },

    updatePurchasesPerMonthChart () {
      var self = this

      if (self.chart === null) {
        return
      }

      if (typeof self.currentYear !== 'number' || self.currentYear === -1) {
        window.toast({
          text: self.$i18n.t('pleaseSelectAYearToDisplay'),
          color: 'yellow'
        })
        return
      }

      // Filter purchases
      var purchaseList = self.purchases.filter(it => {
        return it.year === self.currentYear &&
          (self.currentVenue === -1 || it.venue === self.currentVenue) && 
          (self.currentCategory === -1 || it.category === self.currentCategory)
      })

      // Calculate purchase counts and sums
      var counts = []
      var sums = []
      var maxCount = 0
      var maxSum = 0
      for (var i = 1; i < 13; ++i) {
        var tmp = purchaseList.filter(it => it.month === i)

        var cnt = tmp.length
        counts.push(cnt)
        if (cnt > maxCount) {
          maxCount = cnt
        }

        var sum = tmp.reduce((current, next) => {
          var v = parseFloat(next.sum)
          return isNaN(v) ? current : current + v
        }, 0)
        sums.push(sum.toFixed(2))
        if (sum > maxSum) {
          maxSum = sum
        }
      }

      // Populate the chart
      self.chartData.datasets[0].data = sums
      self.chartOptions.scales.yAxes[0].ticks.max = maxSum
      self.chartData.datasets[1].data = counts
      self.chartOptions.scales.yAxes[1].ticks.max = maxCount

      self.chart.data = self.chartData
      self.chart.options = self.chartOptions

      self.chart.update()
    }
  }
}
</script>