import React from 'react'
import Switch from 'react-toggle-switch'
import TextField from '../components/TextField'

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

export default MemberInfo