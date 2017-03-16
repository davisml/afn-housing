import React from 'react'
import Switch from 'react-toggle-switch'
import {fromJS} from 'immutable'
import Request from 'superagent'
import ClassNames from 'classnames'
import _ from 'underscore'
import TextField from './components/TextField'

import validateField from './form/validateField'
import ContactForm from './form/ContactForm'
import MemberInfo from './form/MemberInfo'
import AdditionalInfo from './form/AdditionalInfo'
import LocationInfo from './form/LocationInfo'

let FormComponent = ({data, onChange, onSubmit, goForward: forward, goBack, currentStep}) => {
	const handleChange = (key) => {
		return (event) => {
			const {value} = event.target
			onChange(data.set(key, value))
		}
	}

	const toggleSwitch = (key) => {
		return () => {
			onChange(data.set(key, !data.get(key)))
		}
	}

	const tabProps = { data, handleChange, onChange, toggleSwitch }

	const tabComponents = [ContactForm, MemberInfo, AdditionalInfo, LocationInfo]
	const tabs = tabComponents.map((Tab, i) => <Tab { ...tabProps } key={ `tab-${ i }` } />)
	const numberOfSteps = tabs.length

	const finish = () => {
		// alert('done')
		console.log("Submit")

		let formData = data.toJS()

		// console.log(data.toJS())

		const {firstName, lastName, email, telephone} = formData

		formData.member = {
			firstName, lastName, email, telephone
		}

		delete formData.firstName
		delete formData.lastName
		delete formData.email
		delete formData.telephone

		delete formData.locations
		delete formData.numberOfIndividuals
		delete formData.numberOfDisabledIndividuals
		delete formData.disabledIndividuals

		formData.member.phone = formData.member.telephone
		delete formData.member.telephone

		onSubmit(formData)
	}

	const validate = () => {
		// const currentStep = data.get('currentStep')
		let valid = true

		if (currentStep == 0) {
			['firstName', 'lastName', 'email', 'telephone'].forEach((key) => {
				const value = data.get(key)

				if (!validateField(key, value)) {
					console.log(`${ key } is invalid`)
					valid = false
				}
			})
		} else if (currentStep == 2) {
			data.get('individuals').forEach((individual) => {
				['name', 'age'].forEach((key) => {
					const value = data.get(key)

					if (!validateField(key, value)) {
						console.log(`${ key } is invalid`)
						valid = false
					}
				})
			})
		}

		console.log(`validate: ${ valid }`)
		onChange(data.set('invalid', !valid))

		console.log(data.get('invalid'))

		return valid
	}

	const goForward = () => {
		if (!validate()) {
			return
		}

		if (currentStep == tabs.length - 1) {
			finish()
		} else {
			forward()
		}
	}

	const currentTab = tabs[currentStep]

	let backButton = null

	if (currentStep > 0) {
		backButton = <button className="btn" onClick={ goBack }>Back</button>
	}

	let forwardText = 'Next'

	if (currentStep == numberOfSteps - 1) {
		forwardText = 'Submit'
	}

	return <div className='form' autoComplete='on'>
		{ currentTab }
		<div className="form-row" style={{textAlign: 'right', flexDirection: 'row', justifyContent: 'flex-end'}}>
			{ backButton }
			<button className="btn btn-default" onClick={ goForward }>{ forwardText }</button>
		</div>
	</div>
}

FormComponent.displayName = 'FormComponent'

// Uncomment properties you need
// FormComponent.propTypes = {};
// FormComponent.defaultProps = {};

export default FormComponent
