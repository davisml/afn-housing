'use strict';

import React from 'react'
import Switch from 'react-toggle-switch'
import {fromJS} from 'immutable'
require('react-toggle-switch/src/css/switch.css')
require('styles/Form.css')

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

const locationOptions = fromJS([
	{
		value: 0,
		label: 'Yarmouth'
	},
	{
		value: 1,
		label: 'Gold River'
	},
	{
		value: 2,
		label: 'Ponhook'
	},
	{
		value: 3,
		label: 'Medway'
	},
	{
		value: 4,
		label: 'Wildcat'
	}
])

const renderOption = (option, index) => {
	const key = `option-${ index }`
	const {value, label} = option.toJS()
	const props = { key, value }

	return <option {...props}>{ label }</option>
}

let PersonRow = (props) => {
	const {data, onChange, index} = props

	const handleChange = (key) => {
		return ({ target: { value } }) => {
			onChange(data.set(key, value))
		}
	}

	const fullNameId = `full-name-${ index }`
	const ageId = `age-${ index }`
	const relationshipId = `relationship-${ index }`

	return <div className='form-row'>
		<div className='form-cell required'>
			<label htmlFor={ fullNameId }>Name</label>
			<input id={ fullNameId } name={ fullNameId } type='text' value={ data.get('name') } onChange={ handleChange('name') } />
		</div>
		<div className='form-cell required'>
			<label htmlFor={ ageId }>Age</label>
			<input id={ ageId } name={ ageId } type='text' value={ data.get('age') } onChange={ handleChange('age') } />
		</div>
		<div className='form-cell required'>
			<label htmlFor={ relationshipId }>Relationship</label>
			<select id={ relationshipId } name={ relationshipId } value={ data.get('relationship') } onChange={ handleChange('relationship') }>{ relationshipOptions.map(renderOption) }</select>
		</div>
	</div>
}

let DisabledPersonRow = (props) => {
	const {data, onChange} = props

	const handleChange = (key) => {
		return ({ target: { value } }) => {
			onChange(data.set(key, value))
		}
	}

	return <div className='form-row'>
		<div className='form-cell required'>
			<label>Name</label>
			<input type='text' value={ data.get('name') } onChange={ handleChange('name') } />
		</div>
		<div className='form-cell required'>
			<label>Age</label>
			<input type='text' value={ data.get('age') } onChange={ handleChange('age') } />
		</div>
		<div className='form-cell required'>
			<label>Disability</label>
			<select value={ data.get('disability') } onChange={ handleChange('disability') }>{ disabilityOptions.map(renderOption) }</select>
		</div>
		<div className='form-cell required'>
			<label>Relationship</label>
			<select value={ data.get('relationship') } onChange={ handleChange('relationship') }>{ relationshipOptions.map(renderOption) }</select>
		</div>
	</div>
}

const ContactForm = ({data, handleChange}) => {
	return <div className='form-row'>
		<div className='form-cell-column'>
			<div className='form-cell-group'>
				<div className='form-cell required'>
					<label htmlFor="first-name">First Name</label>
					<input id="first-name" name="first-name" type='text' value={ data.get('firstName') } onChange={ handleChange('firstName') } />
				</div>
				<div className='form-cell required'>
					<label htmlFor="last-name">Last Name</label>
					<input id="last-name" name="last-name" type='text' value={ data.get('lastName') } onChange={ handleChange('lastName') } />
				</div>
			</div>
			<div style={{width: '100%', display: 'flex'}}>
				<div className='form-cell required'>
					<label htmlFor="email">Email</label>
					<input id="email" name="email" type='text' value={ data.get('email') } onChange={ handleChange('email') } />
				</div>
			</div>
			<div style={{width: '100%', display: 'flex'}}>
				<div className='form-cell required'>
					<label htmlFor="telephone">Phone</label>
					<input id="telephone" name="telephone" type='text' value={ data.get('telephone') } onChange={ handleChange('telephone') } />
				</div>
			</div>
		</div>
	</div>
}

const MemberInfo = ({data, toggleSwitch, handleChange}) => {
	return <div>
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
}

const AdditionalInfo = ({ data, handleChange, onChange, toggleSwitch }) => {
	const individuals = data.get('individuals')
	
	const handlePersonChange = (index) => {
		return (individual) => {
			onChange(data.updateIn(['individuals', index], () => {
				return individual
			}))
		}
	}

	const renderPersonRow = (person, index) => {
		const key = `person-${ index }`
		return <PersonRow key={ key } index={ index } data={ person } onChange={ handlePersonChange(index) } />
	}

	const renderDisabledPersonRow = (person, index) => {
		const key = `disabled-person-${ index }`
		return <DisabledPersonRow key={ key } index={ index } data={ person } onChange={ handleDisabledPersonChange(index) } />
	}

	const handleDisabledPersonChange = (index) => {
		return (individual) => {
			onChange(data.updateIn(['disabledIndividuals', index], () => {
				return individual
			}))
		}
	}
	
	let howManyRow = null
	let disabledIndividuals = []
	
	if (data.get('residesWithDisabled')) {
		howManyRow = <div className='form-row'>
			<div className='form-cell required'>
				<label>How many?</label>
				<input type='number' value={ data.get('numberOfDisabledIndividuals') } onChange={ handleChange('numberOfDisabledIndividuals') } />
			</div>
		</div>

		disabledIndividuals = data.get('disabledIndividuals')
	}

	return <div>
		<div className='form-row'>
			<div className='form-cell required'>
				<label htmlFor='numberOfIndividuals'>How many individuals intend to reside with Band Member?</label>
				<input id='numberOfIndividuals' name='numberOfIndividuals' type='number' value={ data.get('numberOfIndividuals') } onChange={ handleChange('numberOfIndividuals') } />
			</div>
		</div>

		{ individuals.map(renderPersonRow) }

		<div className='form-alt'>
			<div className='form-row'>
				<div className='form-cell switch-cell'>
					<label>Do you reside with any individuals with disabilities?</label>
					<Switch on={ data.get('residesWithDisabled') } onClick={ toggleSwitch('residesWithDisabled') } />
					{/*<input type='checkbox' value={ data.isLivingOnReserve } onChange={ handleChange('isLivingOnReserve') } />*/}
				</div>
			</div>
			{ howManyRow }
			{ disabledIndividuals.map(renderDisabledPersonRow) }
		</div>
	</div>
}

const LocationInfo = ({ data, handleChange, toggleSwitch }) => {
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

let FormComponent = (props) => {
	const {data, onChange} = props

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
	
	let tabs = [
		<ContactForm key="contact" { ...tabProps } />,
		<MemberInfo key="member" { ...tabProps } />,
		<AdditionalInfo key="additionalInfo" {...tabProps} />,
		<LocationInfo key="location" {...tabProps} />
	]

	const numberOfSteps = tabs.length

	const finish = () => {
		alert('done')
	}

	const goForward = () => {
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
