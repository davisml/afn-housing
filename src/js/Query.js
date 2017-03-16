import Request from 'superagent'

const Query = function(query, variables) {
	return new Promise((resolve, reject) => {
		Request.post(`/graphql`).set('Content-Type', 'application/json').send({query, variables}).end((error, response) => {
			if (error) {
				if (response.body.errors) {
					reject(response.body.errors[0])
					return
				}

				reject(error)
			} else {
				resolve(response.body.data)
			}
		})
	})
}

export default Query