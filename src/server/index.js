import graphqlHTTP from 'express-graphql'
import express from 'express'
import models from './db'
import path from 'path'
import schema from './db/graphSchema'

const {Location} = models
const app = express()
app.set('view engine', 'jade')
app.set('views', './src/jade')

const indexTemplate = 'index'
const renderIndex = (request, response) => response.render(indexTemplate)

app.get('/', renderIndex)

console.log("use express static")
const staticPath = path.resolve(__dirname, '../../dist/')
console.log(staticPath)

app.use(express.static(staticPath))

app.use('/graphql', (request, response, next) => {
    graphqlHTTP({ schema, graphiql: true })(request, response, next)
})

app.get('/*', renderIndex)

export default app