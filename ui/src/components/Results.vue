<template>
  <div>
    <md-card style="border: 0px; box-shadow: none; max-width: 800px;">
      <md-card-content>
        <h3 class="md-title">.GIF Pronunciation</h3>
        <results-chart :a="a" :b="b" />
        <div v-if="!open && (a > 0 || b > 0)">
          <h1 v-if="a === b">
            Hard G tied Soft G
          </h1>
          <h1 v-else-if="a > b" style="color: #64B5F6;">
            Hard G Wins!
          </h1>
          <h1 v-else-if="a < b" style="color: #e57373;">
            Soft G Wins!
          </h1>
          <h1 v-else>
            Unknown Outcome!
          </h1>
        </div>
        <div v-else-if="open">
          <h2>Voting in progress...</h2>
        </div>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import ResultsChart from '@/components/Chart'

export default {
  components: {
    ResultsChart
  },
  data () {
    return {
      open: false,
      a: 0,
      b: 0
    }
  },
  apollo: {
    results: {
      fetchPolicy: 'network-only',
      deep: true,
      query: gql`query {
        results: vote_summary {
          open
          a
          b
        }
      }`,
      result ({ data, loading }) {
        if (!loading && data) {
          this.open = data.results.open
          this.a = data.results.a
          this.b = data.results.b
        }
      },
      subscribeToMore: {
        document: gql`subscription {
          results: watch_vote_summary {
            open
            a
            b
          }
        }`,
        result (res) {
          this.$apollo.queries.results.refetch()
        }
      }
    }
  }
}
</script>
