import React from 'react'
import FormComponent from './FormComponent'
import {Map, List, fromJS} from 'immutable'
import ClassNames from 'classnames'
import Request from 'superagent'
import {getURLParams} from './helpers'
import Query from './Query'
import CompleteView from './CompleteView'
import Moment from 'moment'

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		let data = null

		if (!this.props.params || !this.props.params.shortid) {
			const savedDataString = localStorage.getItem('formData')

			if (savedDataString) {
				data = fromJS(JSON.parse(savedDataString))
			} else {
				const numberOfIndividuals = 2

				data = new Map({
					isMember: false,
					scisID: '',
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
					additionalInformation: '',
					numberOfIndividuals,
					individuals: this.initList(new List(), numberOfIndividuals)
				})
			}
		}

		this.state = { data }
	}

	componentDidMount() {
		console.log("Component did mount")

		const locationsQuery = `locations {
			id
			description
		}`

		let formQuery = ''
		let queryName = ''
		let uid = null

		const fetchForm = (!this.state.data)

		if (fetchForm) {
			console.log('fetch form')
			const {shortid} = this.props.params

			formQuery = `housingFormWithShortId(shortid: $uid) {
			    id
			    createdAt
			    location {
			      id
			      description
			    }
			    member {
			      id
			      phone
			      firstName
			      lastName
			      email
			      scisID
			      birthDate
			    }
			    data {
			      disabilityConsideration
			      individuals {
			        name
			        relationship
			        age
			      }
			      isConsideredElder
			      residesWithDisabled
			      requiresSupport
			      isLivingOnReserve
			      additionalInformation
			      currentLivingConditions
			    }
			}`

			console.log('fetch form for short id')
			console.log(shortid)

			uid = shortid
			queryName = 'DataQuery($uid: String) '
		}

		console.log('uid')
		// console.log(uid)

		Query(`
			query ${ queryName }{
				${ locationsQuery }
				${ formQuery }
			}
		`, { uid }).then((data) => {
			console.log(`query complete`)
			// console.log(data)

			const {locations, housingFormWithShortId} = data
			let newData = (this.state.data || new Map).merge({ locations })

			if (housingFormWithShortId) {
				newData = newData.mergeDeep(housingFormWithShortId.data)
				newData = newData.mergeDeep(housingFormWithShortId.member)
				newData = newData.set('telephone', newData.get('phone'))
				newData = newData.delete('phone')

				let date = Moment(newData.get('birthDate'))

				newData = newData.set('birthMonth', date.month() + 1)
				newData = newData.set('birthYear', date.year())
				newData = newData.set('birthDayOfMonth', date.date())
				newData = newData.set('numberOfIndividuals', newData.get('individuals').size)
			}

			console.log(newData.toJS())

			this.setState({ data: newData })
		})
	}

	initList(individuals, size) {
		return individuals.setSize(size).map((individual) => {
			if (!individual) {
				return new Map({
					name: '',
					age: '',
					relationship: 'boy'
				})
			}

			return individual
		})
	}

	render() {
		if (!this.state.data) {
			return <div id="form" />
		}

		const handleSubmit = (input) => {
			console.log(`handle submit`)
			
			Query(`
				mutation SubmitForm($input: HousingFormInput) {
					submitForm(input: $input) {
						id
					}
				}
			`, { input }).then((response) => {
				if (response.submitForm && response.submitForm.id) {
					localStorage.removeItem('formData')
					
					this.setState({ complete: true })
				}
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
			if (numberOfIndividuals != this.state.data.get('numberOfIndividuals')) {
				newData = newData.update('individuals', (individuals) => {
					return this.initList(individuals, numberOfIndividuals)
				})
			}

			let saveData = newData.set('invalid', false)

			localStorage.setItem('formData', JSON.stringify(saveData.toJS()))

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

		let content = <FormComponent { ...componentProps } />

		if (this.state.complete) {
			console.log("We are complete")
			console.log(data.toJS())

			const fullName = data.get('firstName') + ' ' + data.get('lastName')

			content = <CompleteView name={ fullName }/>
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
			<div className="content">{ content }</div>
		</div>
	}
}

AppComponent.defaultProps = {

}

export default AppComponent
// ReactDOM.render(<AppComponent />, document.getElementById('content'))
