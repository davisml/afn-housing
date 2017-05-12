import React from 'react'
import Icon from '../components/Icon'

export default ({ onSelect, onLogout }) => (
	<div id="sidebar">
		<img src="/img/sanddollar.svg" draggable={ false } />

		<div className="sidebar-item active" onClick={ onSelect }>
			<Icon name="request" />
		</div>

		<div className="sidebar-item logout" onClick={ onLogout }>
			<Icon name="logout" viewBox="0 0 512 512" />
		</div>

		{/*<div className="sidebar-item">
			<Icon name="request" />
		</div>*/}
	</div>
)