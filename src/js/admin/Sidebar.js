import React from 'react'
import Icon from '../components/Icon'

export default ({ onSelect }) => (
	<div id="sidebar">
		<img src="/img/sanddollar.svg" draggable={ false } />

		<div className="sidebar-item active" onClick={ onSelect }>
			<Icon name="house" />
		</div>
		
		<div className="sidebar-item">
			<Icon name="request" />
		</div>
	</div>
)