import React from 'react'
import ReactDOM from 'react-dom'
import FormComponent from './FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
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

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		const numberOfIndividuals = 2
		const numberOfDisabledIndividuals = 1

		this.state = {
			data: new Map({
				isMember: false,
				firstName: '',
				lastName: '',
				email: '',
				telephone: '',
				location: 1,
				currentLivingConditions: '',
				isLivingOnReserve: false,
				isConsideredElder: false,
				residesWithDisabled: false,
				requiresSupport: false,
				numberOfDisabledIndividuals,
				additionalInformation: '',
				numberOfIndividuals,
				individuals: this.initList(new List(), numberOfIndividuals),
				disabledIndividuals: this.initDisabledList(new List(), numberOfDisabledIndividuals),
				currentStep: 0
			})
		}
	}

	componentDidMount() {
		console.log("Component did mount")

		Query(`
		query {
			locations {
				id
				description
			}
		}
		`).then((data) => {
			console.log(`query complete`)
			console.log(data)

			const {locations} = data
			const newData = this.state.data.merge({ locations })
			this.setState({ data: newData })
		})
	}

	initDisabledList(individuals, size) {
		return individuals.setSize(size).map((individual) => {
			if (!individual) {
				return new Map({
					name: '',
					age: '',
					relationship: 'child',
					disability: 0
				})
			}

			return individual
		})
	}

	initList(individuals, size) {
		return individuals.setSize(size).map((individual) => {
			if (!individual) {
				return new Map({
					name: '',
					age: '',
					relationship: 'child'
				})
			}

			return individual
		})
	}

	render() {
		const handleSubmit = (input) => {
			Query(`
				mutation SubmitForm($input: HousingFormInput) {
					submitForm(input: $input) {
						id
					}
				}
			`, { input }).then((response) => {
				console.log(response)
			}).catch((error) => {
				console.log("Error")
				console.error(error)

				console.log("response")
				console.log(response)
			})
		}

		const handleChange = (data) => {
			let newData = data

			const numberOfIndividuals = data.get('numberOfIndividuals')
			const numberOfDisabledIndividuals = data.get('numberOfDisabledIndividuals')

			if (numberOfIndividuals != this.state.data.get('numberOfIndividuals')) {
				newData = newData.update('individuals', (individuals) => {
					return this.initList(individuals, numberOfIndividuals)
				})
			}

			if (numberOfDisabledIndividuals != this.state.data.get('numberOfDisabledIndividuals')) {
				newData = newData.update('disabledIndividuals', (individuals) => {
					return this.initDisabledList(individuals, numberOfIndividuals)
				})
			}

			this.setState({ data: newData })
		}

		const {data} = this.state
		const currentStep = data.get('currentStep')
		const steps = ['Contact', 'Membership', 'Residents', 'Location']

		const renderStep = (step, index) => {
			const key = `step-${ index }`
			const active = (index === currentStep)
			const className = ClassNames('step', {active})

			return <div key={ key } className={ className }>{ step }</div>
		}

		return <div id="form">
			<div className="sidebar">
				<div className="sidebar-wrapper">
					<img src="/img/afn-logo.png"/>
					<div className="steps">
						{ steps.map(renderStep) }
					</div>
				</div>
			</div>
			<div className="content">
				<FormComponent onSubmit={ handleSubmit } data={ this.state.data } onChange={ handleChange } />
			</div>
		</div>
	}
}

AppComponent.defaultProps = {

}

ReactDOM.render(<AppComponent />, document.getElementById('content'))
