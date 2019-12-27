<template>
  <div id="app">
    <md-toolbar md-elevation="0" class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <md-icon>menu</md-icon>
      </md-button>
      <h3 class="md-title" v-if="$route.name === 'Admin'">Poll Admin</h3>
      <h3 class="md-title" v-else-if="$route.name === 'Results'">Poll Results</h3>
      <h3 class="md-title" v-else-if="$route.name === 'Vote'">.GIF Hard vs. Soft G</h3>
    </md-toolbar>
    <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Poll</span>
      </md-toolbar>
      <md-divider></md-divider>
      <md-list>
        <md-list-item :to="{ name: 'Results' }" exact>
          <md-icon>bar_chart</md-icon>
          <span class="md-list-item-text">Results</span>
        </md-list-item>
        <md-list-item :to="{ name: 'Vote' }" exact>
          <md-icon>how_to_vote</md-icon>
          <span class="md-list-item-text">Vote</span>
        </md-list-item>
        <md-list-item :to="{ name: 'Admin' }" exact>
          <md-icon>settings_applications</md-icon>
          <span class="md-list-item-text">Admin</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <router-view />
  </div>
</template>

<script>
var adminPassword = '7bf4e9d242d84688e0f71f352dbb8bea6cf06c1a'

export default {
  name: 'App',
  created () {
    this.route = sessionStorage.getItem('poll_app_route') || ''
  },
  watch: {
    $route: {
      deep: true,
      handler (value) {
        this.showNavigation = false
      }
    }
  },
  methods: {
    login () {
      var hashed = this.hashPassword(this.password)
      if (hashed === adminPassword) {
        this.admin = true
      } else {
        console.log('not authenticated')
      }

      this.password = ''
    },
    hashPassword: function (value) {
      return value
    },
    goAdmin: function () {
      this.password = ''
      this.route = 'admin'
      this.showNavigation = false
    },
    goSummary: function () {
      this.route = 'summary'
      this.showNavigation = false
    },
    goVote: function () {
      this.route = ''
      this.showNavigation = false
    }
  },
  data: function () {
    return {
      password: '',
      route: '',
      admin: false,
      voted: false,
      showNavigation: false
    }
  }
}
</script>

<style>
body {
  background-color: #fff;
}
#app {
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
