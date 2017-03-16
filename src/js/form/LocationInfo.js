import React from 'react'
import {fromJS} from 'immutable'
import Switch from 'react-toggle-switch'

const renderOption = (option, index) => {
	const key = `option-${ index }`
	const {value, label} = option.toJS()
	const props = { key, value }

	return <option {...props}>{ label }</option>
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

export default LocationInfo