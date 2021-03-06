import React from 'react'
import _ from 'underscore'
import validateField from './validateField'
import TextField from '../components/TextField'
import ClassNames from 'classnames'
import calculateAge from '../calculateAge'

const ContactForm = ({data, handleChange}) => {
	const invalid = data.get('invalid')

	const email = data.get('email')
	const scisID = data.get('scisID')
	const emailInvalid = invalid && !validateField('email', email)
	const scisIDInvalid = invalid && !validateField('scisID', scisID)

	const days = _.range(1, 32)
	days.splice(0, 0, 'Day')

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	months.splice(0, 0, 'Month')

	const years = _.range(1940, 2018)
	years.splice(0, 0, 'Year')

	const {birthYear, birthMonth, birthDayOfMonth} = data.toJS()

	let dateInvalid = false

	if (invalid) {
		if (birthYear < 0 || birthMonth < 0 || birthDayOfMonth < 0) {
			dateInvalid = true
		} else {
			const year = Number(birthYear)
			const month = Number(birthMonth) - 1
			const day = Number(birthDayOfMonth)
			const date = new Date(year, month, day)

			const age = calculateAge(date)

			if (age < 18) {
				dateInvalid = true
			}
		}
	}

	let selectClass = ClassNames("form-control", {invalid: dateInvalid})

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
					<label htmlFor="scisID">Band Number</label>
					<TextField id="scisID" invalid={ scisIDInvalid } value={ data.get('scisID') } onChange={ handleChange('scisID') } />
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
			<div style={{width: '100%', display: 'flex'}}>
				<div className='form-cell required'>
					<label htmlFor="telephone">Birthdate</label>
					<div className="birthdate">
						<div className="month-cell">
							<select className={ selectClass } value={ data.get('birthMonth') } onChange={ handleChange('birthMonth') }>
								{
									months.map((option, index) => {
										let value = index
										
										if (index === 0) {
											value = -1
										}
										
										return <option key={`month-${ index }`} value={ value }>{ option }</option>
									})
								}
							</select>
						</div>
						<div className="day-cell">
							<select className={ selectClass } value={ data.get('birthDayOfMonth') } onChange={ handleChange('birthDayOfMonth') }>
								{
									days.map((day) => {
										let value = day

										if (value == 'Day') {
											value = -1
										}

										return <option key={`day-${ value }`} value={ value }>{ day }</option>
									})
								}
							</select>
						</div>
						<div className="year-cell">
							<select className={ selectClass } value={ data.get('birthYear') } onChange={ handleChange('birthYear') }>
								{
									years.map((year) => {
										let value = year

										if (value == 'Year') {
											value = -1
										}

										return <option key={`year-${ value }`} value={ value }>{ year }</option>
									})
								}
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default ContactForm