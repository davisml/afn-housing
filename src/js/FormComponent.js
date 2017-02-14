import React from 'react'
import Switch from 'react-toggle-switch'
import {fromJS} from 'immutable'
import Request from 'superagent'
import ClassNames from 'classnames'

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

const validateField = (key, value) => {
	if (!value) {
		return false
	}

	if (key == 'email' && !emailRegex.test(value)) {
		return false
	}

	if (key == 'age' && Number(value) >= 150) {
		return false
	}

	return true
}

const relationshipOptions = fromJS([
	{
		value: 'child',
		label: 'Child'
	},
	{
		value: 'parent',
		label: 'Parent'
	},
	{
		value: 'parent',
		label: 'Grandparent'
	}
])

const disabilityOptions = fromJS([
	{
		value: 0,
		label: 'Mental'
	},
	{
		value: 1,
		label: 'Physical'
	}
])

const renderOption = (option, index) => {
	const key = `option-${ index }`
	const {value, label} = option.toJS()
	const props = { key, value }

	return <option {...props}>{ label }</option>
}

const PersonRow = (props) => {
	const {data, invalid, onChange, index} = props

	const handleChange = (key) => {
		return ({ target: { value } }) => {
			onChange(data.set(key, value))
		}
	}

	const fullNameId = `full-name-${ index }`
	const ageId = `age-${ index }`
	const relationshipId = `relationship-${ index }`

	const nameInvalid = invalid && !validateField('name', data.get('name'))
	const ageInvalid = invalid && !validateField('age', data.get('age'))

	return <div className='form-row'>
		<div className='form-cell required'>
			<label htmlFor={ fullNameId }>Name</label>
			<TextField id={ fullNameId } invalid={ nameInvalid } value={ data.get('name') } onChange={ handleChange('name') } />
		</div>
		<div className='form-cell required'>
			<label htmlFor={ ageId }>Age</label>
			<TextField id={ ageId } invalid={ ageInvalid } value={ data.get('age') } onChange={ handleChange('age') } />
		</div>
		<div className='form-cell required'>
			<label htmlFor={ relationshipId }>Relationship</label>
			<select id={ relationshipId } name={ relationshipId } value={ data.get('relationship') } onChange={ handleChange('relationship') }>{ relationshipOptions.map(renderOption) }</select>
		</div>
	</div>
}

const TextField = ({ id, value, type, invalid, onChange }) => {
	const className = ClassNames('form-control', { invalid })
	const inputProps = { id, name: id, className, type, value, onChange }

	return <input { ...inputProps } />
}

TextField.defaultProps = {
	invalid: false,
	type: 'text'
}

const ContactForm = ({data, handleChange}) => {
	const invalid = data.get('invalid')

	const email = data.get('email')
	const emailInvalid = invalid && !validateField('email', email)

	return <div className='form-row'>
		<div className='form-cell-column'>
			<div className='form-cell-group'>
				<div className='form-cell required'>
					<label htmlFor="first-name">First Name</label>
					<TextField id="first-name" invalid={ invalid && !data.get('firstName').length } value={ data.get('firstName') } onChange={ handleChange('firstName') } />
				</div>
				<div className='form-cell required'>
					<label htmlFor="last-name">Last Name</label>
					<TextField id="last-name" invalid={ invalid && !data.get('lastName').length } value={ data.get('lastName') } onChange={ handleChange('lastName') } />
				</div>
			</div>
			<div style={{width: '100%', display: 'flex'}}>
				<div className='form-cell required'>
					<label htmlFor="email">Email</label>
					<TextField id="email" invalid={ emailInvalid } value={ data.get('email') } onChange={ handleChange('email') } />
				</div>
			</div>
			<div style={{width: '100%', display: 'flex'}}>
				<div className='form-cell required'>
					<label htmlFor="telephone">Phone</label>
					<TextField type="tel" id="telephone" invalid={ invalid && !data.get('telephone').length } value={ data.get('telephone') } onChange={ handleChange('telephone') } />
				</div>
			</div>
		</div>
	</div>
}

const MemberInfo = ({data, toggleSwitch, handleChange}) => (
	<div>
		<div className='form-row'>
			<div className='form-cell required'>
				<label htmlFor='currentLivingConditions'>Current Living Conditions</label>
				<textarea id='currentLivingConditions' name='currentLivingConditions' value={ data.get('currentLivingConditions') } onChange={ handleChange('currentLivingConditions') } />
			</div>
		</div>

		<div className='form-alt'>
			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label>Are you a member of Acadia First Nations?</label>
					<Switch on={ data.get('isMember') } onClick={ toggleSwitch('isMember') } enabled={ true }/>
					{/*<input type='checkbox' value={ data.isMember } onChange={ handleChange('isMember') } />*/}
				</div>
			</div>

			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label>Are you currently living on reserve?</label>
					<Switch on={ data.get('isLivingOnReserve') } onClick={ toggleSwitch('isLivingOnReserve') } enabled={ true }/>
					{/*<input type='checkbox' value={ data.isLivingOnReserve } onChange={ handleChange('isLivingOnReserve') } />*/}
				</div>
			</div>

			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label>Are you considered an elder?</label>
					<Switch on={ data.get('isConsideredElder') } onClick={ toggleSwitch('isConsideredElder') } enabled={ true }/>
					{/*<input type='checkbox' value={ data.isConsideredElder } onChange={ handleChange('isConsideredElder') } />*/}
				</div>
			</div>
		</div>
	</div>
)

const AdditionalInfo = ({ data, handleChange, onChange, toggleSwitch }) => {
	const individuals = data.get('individuals')
	
	const handlePersonChange = (index) => {
		return (individual) => {
			onChange(data.updateIn(['individuals', index], () => {
				return individual
			}))
		}
	}

	const invalid = data.get('invalid')

	const renderPersonRow = (person, index) => {
		const key = `person-${ index }`
		const rowProps = { invalid, key, index, data: person, onChange: handlePersonChange(index) }
		
		console.log(`render person row: ${ invalid }`)

		return <PersonRow { ...rowProps } />
	}

	const handleDisabledPersonChange = (index) => {
		return (individual) => {
			onChange(data.updateIn(['disabledIndividuals', index], () => {
				return individual
			}))
		}
	}
	
	let disabledIndividuals = []
	let disabilityTextArea = null
	
	if (data.get('residesWithDisabled')) {
		disabilityTextArea = <div>
			<label htmlFor="disabilityConsideration">Special considerations</label>
			<textarea name="disabilityConsideration" value={ data.get('disabilityConsideration') } onChange={ handleChange("disabilityConsideration") }/>
		</div>
	}

	return <div>
		<div className='form-row'>
			<div className='form-cell required'>
				<label htmlFor='numberOfIndividuals'>How many individuals intend to reside with Band Member?</label>
				<TextField id='numberOfIndividuals' value={ data.get('numberOfIndividuals') } onChange={ handleChange('numberOfIndividuals') } />
			</div>
		</div>

		{ individuals.map(renderPersonRow) }

		<div className='form-alt'>
			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label>Do you reside with any individuals with disabilities?</label>
					<Switch on={ data.get('residesWithDisabled') } onClick={ toggleSwitch('residesWithDisabled') } />
					{ disabilityTextArea }
					{/*<input type='checkbox' value={ data.isLivingOnReserve } onChange={ handleChange('isLivingOnReserve') } />*/}
				</div>
			</div>
		</div>
	</div>
}

const LocationInfo = ({ data, handleChange, toggleSwitch }) => {
	const locations = data.get('locations').toJS()
	const locationOptions = fromJS(locations.map(({ id: value, description: label }) => ({ value, label })))

	return <div>
		<div className='form-row'>
			<div className='form-cell switch-cell'>
				<label>Require funding or support from Acadia First Nation to move in to house</label>
				<Switch on={ data.get('requiresSupport') } onClick={ toggleSwitch('requiresSupport') } />
				{/*<input type='checkbox' value={ data.isLivingOnReserve } onChange={ handleChange('isLivingOnReserve') } />*/}
			</div>
		</div>

		<div className='form-row'>
			<div className='form-cell switch-cell'>
				<label>What location would you like to receive housing in?</label>
				<select value={ data.get('location') } onChange={ handleChange('location') }>{ locationOptions.map(renderOption) }</select>
				{/*<input type='checkbox' value={ data.isLivingOnReserve } onChange={ handleChange('isLivingOnReserve') } />*/}
			</div>
		</div>

		<div className='form-alt'>
			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label htmlFor='additionalInformation'>Additional Information</label>
					<textarea id='additionalInformation' name='additionalInformation' value={ data.get('additionalInformation') } onChange={ handleChange('additionalInformation') } />
				</div>
			</div>
		</div>
	</div>
}

let FormComponent = ({data, onChange, onSubmit}) => {
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
		delete formData.currentStep
		delete formData.numberOfIndividuals
		delete formData.numberOfDisabledIndividuals
		delete formData.disabledIndividuals

		formData.member.phone = formData.member.telephone
		delete formData.member.telephone

		onSubmit(formData)
	}

	const validate = () => {
		const currentStep = data.get('currentStep')
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

		onChange(data.update('currentStep', (currentStep) => {
			const newStep = currentStep + 1

			if (newStep >= numberOfSteps) {
				finish()

				return currentStep
			}

			return newStep
		}))
	}

	const goBack = () => {
		onChange(data.update('currentStep', (currentStep) => {
			return Math.max(currentStep - 1, 0)
		}))
	}

	const currentStep = data.get('currentStep')
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
