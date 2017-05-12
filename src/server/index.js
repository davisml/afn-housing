import graphqlHTTP from 'express-graphql'
import express from 'express'
import models from './db'
import path from 'path'
import schema from './db/graphSchema'
import basicAuth from 'express-basic-auth'

const {Location, User} = models
const app = express()
app.set('view engine', 'jade')
app.set('views', './src/jade')

const env = process.env.NODE_ENV || 'development'

const forceSsl = (req, res, next) => {
	if (req.headers['x-forwarded-proto'] !== 'https') {
		return res.redirect(['https://', req.get('Host'), req.url].join(''))
	}

    return next()
}

if (env === 'production') {
	console.log('force ssl')
    app.use(forceSsl)
}

const indexTemplate = 'index'
const renderIndex = (request, response) => response.render(indexTemplate)

app.get('/', renderIndex)
app.get('/form/:id', renderIndex)

console.log("use express static")
const staticPath = path.resolve(__dirname, '../../dist/')
console.log(staticPath)

app.use(express.static(staticPath))

app.use('/graphql', (request, response, next) => {
    graphqlHTTP({ schema, graphiql: true })(request, response, next)
})

const realm = "Housing App"

async function setupAuth() {
	const users = await User.findAll()

	// console.log('users')
	// console.log(users)

	let userMap = {}

	users.forEach((user) => {
		const {username, password} = user
		userMap[username] = password
	})

	app.use(basicAuth({
	    users: userMap,
	    challenge: true,
	    realm
	}))

	app.get('/logout', (request, response) => {
		response.status(401).set({
			'WWW-Authenticate': `Basic realm=${ JSON.stringify(realm) }`
		}).send('Logged out')
	})

	app.get('/*', renderIndex)
}

setupAuth()

export default app