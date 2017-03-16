import React from 'react'
import FormComponent from './FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Request from 'superagent'
import {getURLParams} from './helpers'

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
				birthDayOfMonth: -1,
				birthYear: -1,
				birthMonth: -1,
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
				// currentStep: 0
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
			console.log(`handle submit`)
			
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
				// console.log("response")
				// console.log(response)
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

		const searchParams = getURLParams(this.props.location.search)
		const currentStep = Number(searchParams.step || 0)
		
		const steps = ['Contact', 'Membership', 'Residents', 'Location']

		const renderStep = (step, index) => {
			const key = `step-${ index }`
			const active = (index === currentStep)
			const className = ClassNames('step', {active})

			return <div key={ key } className={ className }>{ step }</div>
		}

		const {data} = this.state
		const componentProps = {
			onSubmit: handleSubmit,
			onChange: handleChange,
			currentStep, data,
			goForward: () => {
				const {router} = this.props
				router.push(`/?step=${ currentStep + 1 }`)
			},
			goBack: () => {
				const {router} = this.props

				let path = '/'
				let newStep = currentStep - 1

				if (newStep > 0) {
					path = `/?step=${ newStep }`
				}

				router.push(path)
			}
		}

		return <div id="form">
			<div id="toolbar">
				<div className="toolbar-wrapper">
					<img src="/img/sanddollar.svg" />
					<div className="steps">
						{ steps.map(renderStep) }
					</div>
				</div>
			</div>
			<div className="content">
				<FormComponent { ...componentProps } />
			</div>
		</div>
	}
}

AppComponent.defaultProps = {

}

export default AppComponent
// ReactDOM.render(<AppComponent />, document.getElementById('content'))
