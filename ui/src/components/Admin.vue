<template>
  <div>
    <md-card style="border: 0px; box-shadow: none;">
      <md-card-content v-if="admin">
        <md-button v-if="!open" class="md-button md-raised md-primary" @click="openVote">Open Voting</md-button>
        <md-button v-else class="md-button md-raised md-accent" @click="closeVote">Close Voting</md-button>
      </md-card-content>
      <md-card-content v-else>
        <md-field>
          <label>Password</label>
          <md-input type="password" v-model="password" @keyup.enter="login" autocomplete="new-password"></md-input>
        </md-field>
        <md-button class="md-raised md-primary" @click="login">
          Login
        </md-button>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import bcrypt from 'bcryptjs'

// adminpoll
const passwordHash = '$2a$08$/xvfOLz2cmKTD7oDVBtovuGj52ikaTREiwZLP9Tfr6kTRXvFI.7Gm'

export default {
  methods: {
    login () {
      const valid = bcrypt.compareSync(this.password, passwordHash)
      if (valid) {
        this.admin = true
      }
    },
    openVote () {
      this.$apollo.mutate({
        mutation: gql`mutation {
          open_vote
        }`
      })
    },
    closeVote () {
      this.$apollo.mutate({
        mutation: gql`mutation {
          close_vote
        }`
      })
    }
  },
  data () {
    return {
      admin: false,
      open: false,
      password: ''
    }
  },
  apollo: {
    results: {
      fetchPolicy: 'network-only',
      deep: true,
      query: gql`query {
        results: vote_summary {
          open
        }
      }`,
      result ({ data, loading }) {
        if (!loading && data && data.results) {
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
