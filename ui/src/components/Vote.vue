<template>
  <div>
    <div v-if="open">
      <md-card style="border: 0px; box-shadow: none;">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Hard G</div>
            <div class="md-subhead">Examples: Gift, Gut, & Get</div>
          </md-card-header-text>
          <md-card-media md-big>
            <img src="static/jiff-gif.jpg" alt="Avatar">
          </md-card-media>
        </md-card-header>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="castVote('vote_a')" :disabled="!open">Vote</md-button>
        </md-card-actions>
      </md-card>

      <md-divider style="margin-top: 24px;"></md-divider>

      <md-card style="border: 0px; box-shadow: none;">
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">Soft G</div>
            <div class="md-subhead">Examples: Gin, Gel, & Gem</div>
          </md-card-header-text>
          <md-card-media md-big>
            <img src="static/jiff-jiff.jpg" alt="Avatar">
          </md-card-media>
        </md-card-header>

        <md-card-actions>
          <md-button class="md-accent md-raised" @click="castVote('vote_b')" :disabled="!open">Vote</md-button>
        </md-card-actions>
      </md-card>
    </div>
    <div v-else>
      <md-card style="border: 0px; box-shadow: none;">
        <md-card-content>
          <h1>Voting is not open</h1>
        </md-card-content>
      </md-card>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  methods: {
    castVote (choice) {
      return this.$apollo.mutate({
        mutation: gql`mutation ($choice: Choice!) {
          cast_vote (
            choice: $choice
          ) {
            accepted
            message
          }
        }`,
        variables: {
          choice
        }
      }).then(result => {
        if (result.data.cast_vote.accepted) {
          this.$router.push({ name: 'Results' })
        }
      })
    }
  },
  data () {
    return {
      open: false
    }
  },
  apollo: {
    results: {
      deep: true,
      fetchPolicy: 'network-only',
      query: gql`query {
        results: vote_summary {
          open
        }
      }`,
      result ({ data, loading }) {
        if (!loading && data) {
          this.open = data.results.open
        }
      },
      subscribeToMore: {
        document: gql`subscription {
          results: watch_vote_summary {
            open
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

<style scoped>
.md-button {
  cursor: pointer;
}
</style>
