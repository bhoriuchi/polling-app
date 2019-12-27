<script>
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  props: {
    a: {
      type: Number
    },
    b: {
      type: Number
    }
  },
  watch: {
    a () {
      this.buildChart()
    },
    b () {
      this.buildChart()
    }
  },
  methods: {
    buildChart () {
      this.renderChart(
        {
          labels: ['Votes'],
          datasets: [
            {
              label: 'Hard G',
              backgroundColor: '#64B5F6',
              data: [this.a]
            },
            {
              label: 'Soft G',
              backgroundColor: '#e57373',
              data: [this.b]
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      )
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.buildChart()
    })
  }
}
</script>
