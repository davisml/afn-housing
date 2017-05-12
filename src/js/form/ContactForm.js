import React from 'react'
import _ from 'underscore'
import validateField from './validateField'
import TextField from '../components/TextField'
import ClassNames from 'classnames'
import calculateAge from '../calculateAge'

const ContactForm = ({data, handleChange}) => {
	const invalid = data.get('invalid')

	const email = data.get('email')
	const emailInvalid = invalid && !validateField('email', email)

	var length = Math.min(data.get('bandNum').length, 4)

	var bandNumInvalid = invalid
	
	if (invalid && length === 4) {
		var testVar = data.get('bandNum').substring(0, length)
		bandNumInvalid = (parseInt(testVar) != (405 * 2))
	}
	
	const days = _.range(1, 32)
	days.splice(0, 0, 'Day')

	const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	months.splice(0, 0, 'Month')

	const years = _.range(1940, 2018)
	years.splice(0, 0, 'Year')

	const {birthYear, birthMonth, birthDayOfMonth} = data.toJS()

	const year = Number(birthYear)
	const month = Number(birthMonth) - 1
	const day = Number(birthDayOfMonth)
	const date = new Date(year, month, day)

	const age = calculateAge(date)

	let dateInvalid = false

	if (age < 18 && invalid) {
		dateInvalid = true
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
					<label htmlFor="bandNum">Band Number</label>
					<TextField id="bandNum" invalid={ bandNumInvalid } value={ data.get('bandNum') } onChange={ handleChange('bandNum') } />
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