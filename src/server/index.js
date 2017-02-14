import graphqlHTTP from 'express-graphql'
import express from 'express'
import models from './db'
import path from 'path'
import schema from './db/graphSchema'

const {Location} = models
const app = express()

app.use('/graphql', (request, response, next) => {
    graphqlHTTP({ schema, graphiql: true })(request, response, next)
})

export default app