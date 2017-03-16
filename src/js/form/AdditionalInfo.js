import React from 'react'
import Switch from 'react-toggle-switch'
import TextField from '../components/TextField'
import {fromJS} from 'immutable'

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

export default AdditionalInfo