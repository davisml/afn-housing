import React from 'react'

export default ({ onSelect }) => (
	<div id="sidebar">
		<img src="/img/sanddollar.svg" draggable={ false } />
		
		<div className="sidebar-item active" onClick={ onSelect }>
			<img src="/img/house-icon.png" draggable={ false } />
		</div>
	</div>
)