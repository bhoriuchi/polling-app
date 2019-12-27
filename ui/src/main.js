// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueMaterial from 'vue-material'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'
import App from './App'
import router from './router'

Vue.config.productionTip = false

const protocol = window.location.protocol
const host = process.env.NODE_ENV === 'production'
  ? window.location.host
  : 'localhost:4000'
const graphqlEndpoint = `${protocol}//${host}/graphql`
const subscriptionEndpoint = `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/graphql`

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: graphqlEndpoint
})

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: subscriptionEndpoint,
  options: {
    reconnect: true
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

// Create the apollo client
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

// Install the vue plugin like before
Vue.use(VueApollo)
Vue.use(VueMaterial)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  components: { App },
  template: '<App/>'
})
