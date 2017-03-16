import React from 'react'
import ClassNames from 'classnames'

const TextField = ({ id, value, type, invalid, onChange }) => {
	const className = ClassNames('form-control', { invalid })
	const inputProps = { id, name: id, className, type, value, onChange }

	return <input { ...inputProps } />
}

TextField.defaultProps = {
	invalid: false,
	type: 'text'
}

export default TextField