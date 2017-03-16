import React from 'react'
import Checkbox from './Checkbox'

const CheckButton = ({checked, children, size, onChange}) => (
	<div className="check-button">
		<Checkbox {...{ checked, size, onChange }} />
		<div className="check-label" onClick={ onChange }>{ children }</div>
	</div>
)

CheckButton.defaultProps = {
	size: 18,
	checked: false,
	onChange: function() {
		console.warn("Provide an onChange handler to Checkbox")
	}
}

export default CheckButton