var GraphQLServer = require('graphql-yoga').GraphQLServer
var RedisPubSub = require('graphql-redis-subscriptions').RedisPubSub
var Redis = require('ioredis')
var gql = require('graphql-tag')
var express = require('express')

var VOTE_TOPIC = 'vote'
var VOTE_OPEN_KEY = 'vote_open'
var VOTE_A_KEY = 'vote_a'
var VOTE_B_KEY = 'vote_b'

var retries = process.env.REDIS_MAX_RETRIES
  ? parseInt(process.env.REDIS_MAX_RETRIES, 10)
  : 20

var redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: retries
}

var db = new Redis(redisOptions)
var pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions)
})

function initVotes (open) {
  return Promise.all([
    { key: VOTE_OPEN_KEY, value: open },
    { key: VOTE_A_KEY, value: 0 },
    { key: VOTE_B_KEY, value: 0 }
  ].map(function (data) {
    return db.set(data.key, data.value)
  }))
}

var typeDefs = gql`
enum Choice {
  vote_a
  vote_b
}

type VoteResponse {
  accepted: Boolean
  message: String
}

type Vote {
  open: Boolean
  a: Int
  b: Int
}

type Query {
  vote_summary: Vote
}

type Mutation {
  open_vote: Boolean
  close_vote: Boolean
  cast_vote (choice: Choice!): VoteResponse
}

type Subscription {
  watch_vote_summary: Vote
}
`

var resolvers = {
  Vote: {
    open: function () {
      return db.get(VOTE_OPEN_KEY)
        .then(function (result) {
          return result === 'true'
        })
    },
    a: function () {
      return db.get(VOTE_A_KEY)
    },
    b: function () {
      return db.get(VOTE_B_KEY)
    }
  },
  Query: {
    vote_summary: function () {
      return {}
    }
  },
  Mutation: {
    cast_vote: function (source, args) {
      return db.get(VOTE_OPEN_KEY)
        .then(function (open) {
          if (open !== 'true') {
            return {
              accepted: false,
              message: 'Voting is closed'
            }
          }
          return db.get(args.choice)
            .then(function (value) {
              var total = parseInt(value, 10) + 1
              return db.set(args.choice, total)
                .then(function () {
                  pubsub.publish(VOTE_TOPIC)
                  return {
                    accepted: true,
                    message: 'Thank you for your vote'
                  }
                })
            })
        })
        .catch(function (err) {
          return {
            accepted: false,
            message: err
          }
        })
    },
    open_vote: function () {
      return initVotes(true)
        .then(function () {
          pubsub.publish(VOTE_TOPIC, {})
          return true
        })
    },
    close_vote: function () {
      return db.set(VOTE_OPEN_KEY, false)
        .then(function () {
          pubsub.publish(VOTE_TOPIC, {})
          return true
        })
    }
  },
  Subscription: {
    watch_vote_summary: {
      resolve: function () {
        return {}
      },
      subscribe: function () {
        return pubsub.asyncIterator(VOTE_TOPIC)
      }
    }
  }
}

var server = new GraphQLServer({
  typeDefs,
  resolvers
})

var port = 4000
if (process.argv.length > 2) {
  port = parseInt(process.argv[2], 10)
}

server.express.use('/', express.static('public'))
initVotes(false).then(function () {
  server.start(
    {
      endpoint: '/graphql',
      subscriptions: '/graphql',
      playground: '/graphql',
      port
    },
    function () {
      console.log(`Server is running on :${port}`)
    }
  )  
})