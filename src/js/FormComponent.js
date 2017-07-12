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
import calculateAge from './calculateAge'

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
		console.log("Submit")

		let formData = data.toJS()

		const {firstName, lastName, email, telephone, scisID} = formData

		formData.member = {
			firstName, lastName, email, telephone, scisID
		}

		delete formData.firstName
		delete formData.lastName
		delete formData.email
		delete formData.telephone
		delete formData.invalid
		delete formData.scisID
		delete formData.id
		// delete formData.birthDate
		
		delete formData.locations
		delete formData.numberOfIndividuals
		delete formData.numberOfDisabledIndividuals
		delete formData.disabledIndividuals

		formData.member.phone = formData.member.telephone
		delete formData.member.telephone

		// formData.birthDate = Moment()
		// console.log(`month: ${ formData.birthMonth }`)

		const year = Number(formData.birthYear)
		const month = Number(formData.birthMonth) - 1
		const day = Number(formData.birthDayOfMonth)

		// console.log(`${ day }/${ month }/${ year }`)

		const date = new Date(year, month, day)
		
		console.log(`birth date`)
		console.log(date)

		formData.member.birthDate = date
		delete formData.birthDate
		delete formData.birthYear
		delete formData.birthMonth
		delete formData.birthDayOfMonth

		onSubmit(formData)
	}

	const validate = () => {
		// const currentStep = data.get('currentStep')
		let valid = true

		if (currentStep == 0) {
			['firstName', 'lastName', 'email', 'telephone', 'scisID'].forEach((key) => {
				const value = data.get(key)

				if (!validateField(key, value)) {
					// console.log(`${ key } is invalid`)
					valid = false
				}
			})

			// console.log('validate birthday')
			
			const {birthYear, birthMonth, birthDayOfMonth} = data.toJS()

			if (birthYear < 0 || birthMonth < 0 || birthDayOfMonth < 0) {
				valid = false
			} else {
				const year = Number(birthYear)
				const month = Number(birthMonth) - 1
				const day = Number(birthDayOfMonth)
				const date = new Date(year, month, day)

				const age = calculateAge(date)

				if (age < 18) {
					// console.log(`age is invalid ${ age }`)
					valid = false
				}
			}
		} else if (currentStep == 2) {
			const individuals = data.get('individuals').toJS().slice()
			// console.log(individuals)

			for (let i = 0; i < individuals.length; i++) {
				const person = individuals[i]

				if (!person.name.length || Number(person.age) <= 0 || Number(person.age) >= 130) {
					valid = false
				}
			}
		}

		// console.log(`validate: ${ valid }`)
		onChange(data.set('invalid', !valid))

		// console.log(data.get('invalid'))

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

	return <div className="form" autoComplete="on">
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
