import React from 'react'

const Man = ({ width, height, x, y, fill }) => {
	const svgProps = { viewBox: "0 0 25.1 47.3", width, height, x, y, fill }

	return <svg {...svgProps}>
		<path fill={ fill } d="M17.2,12.5l-1.3-1.1c0-2.3-0.8-0.7-3.3-0.7h-0.2c-2.4,0-3.3-1.6-3.3,0.7l-1.3,1.1l-7.3,8.7
			c-0.8,0.9-0.7,2.2,0.2,3c0.4,0.3,0.9,0.5,1.4,0.5c0.6,0,1.2-0.3,1.6-0.7l3.6-4.3l-0.6,8.6h1.5v0.2L6.6,45c-0.1,1.2,0.8,2.2,1.9,2.3
			c0.1,0,0.1,0,0.2,0c1.1,0,2-0.8,2.1-1.9l1.5-16.1h0.3l1.5,16.1c0.1,1.1,1,1.9,2.1,1.9c0.1,0,0.1,0,0.2,0c1.2-0.1,2-1.1,1.9-2.3
			l-1.6-16.6v-0.2h1.5l-0.6-8.6l3.7,4.3c0.4,0.5,1,0.7,1.6,0.7c0.5,0,1-0.2,1.4-0.5c0.9-0.8,1-2.1,0.2-3L17.2,12.5z"/>
		<circle fill={ fill } cx="12.6" cy="4.7" r="4.7"/>
	</svg>
}

Man.defaultProps = {
	fill: 'rgb(120, 120, 120)',
	width: 20,
	height: 32,
	x: 0,
	y: 0
}

const Woman = ({ width, height, x, y, fill }) => {
	const svgProps = { viewBox: "0 0 25.1 47.3", width, height, x, y, fill }

	return <svg {...svgProps}>
		<path fill={ fill } d="M5.4,4.3c0,0,1.5-0.3,2.7-1.1C8,3.7,7.9,4.2,7.9,4.7c0,2.6,2.1,4.7,4.7,4.7s4.7-2.1,4.7-4.7
	c0-2.6-2.1-4.7-4.7-4.7c-1.5,0-2.9,0.7-3.7,1.9C8.1,1.3,6.7,0.6,5.3,2.2c0,0-1.1,1.4-2.8,0.2C2.5,2.4,2.9,4.9,5.4,4.3z"/>
		<path fill={ fill } d="M24.7,21.2l-7.4-8.7L16,11.4c0-2.3-0.8-0.7-3.3-0.7h-0.1h0h-0.1c-2.4,0-3.3-1.6-3.3,0.7l-1.3,1.1l-7.4,8.7
			c-0.8,0.9-0.7,2.2,0.2,3c0.4,0.3,0.9,0.5,1.4,0.5c0.6,0,1.2-0.3,1.6-0.7l3.7-4.3L5.6,34h2.7v0.2L6.7,45c-0.1,1.2,0.8,2.2,1.9,2.3
			c0.1,0,0.1,0,0.2,0c1.1,0,2-0.8,2.1-1.9l1.5-10.3h0.2h0h0.2l1.5,10.3c0.1,1.1,1,1.9,2.1,1.9c0.1,0,0.1,0,0.2,0
			c1.2-0.1,2-1.1,1.9-2.3l-1.6-10.9V34h2.7l-1.8-14.4l3.7,4.3c0.4,0.5,1,0.7,1.6,0.7c0.5,0,1-0.2,1.4-0.5
			C25.4,23.4,25.5,22.1,24.7,21.2z"/>
	</svg>
}

Woman.defaultProps = {
	fill: 'rgb(120, 120, 120)',
	width: 20,
	height: 32,
	x: 0,
	y: 0
}

const Family = ({ people }) => {
	console.log(people)

	const height = 32
	let x = 0

	const icons = people.map((person, index) => {
		const key = `person-${ index }`
		
		const iconProps = { key, x }

		let icon = null
		let width = 0

		if (person.relationship == "daughter") {
			width = 18

			icon = <Woman {...iconProps} width={ width } height={ 26 } y={ 6 }/>
		} else if (person.relationship == "son" || person.relationship == "child") {
			width = 18

			icon = <Man {...iconProps} width={ width } height={ 26 } y={ 6 }/>
		} else if (person.relationship == "partner") {
			width = 20

			const spacing = 4
			iconProps.x -= spacing

			icon = <Woman {...iconProps} width={ width } height={ height } y={ 0 }/>

			width -= spacing
		} else {
			width = 20

			icon = <Man {...iconProps} width={ width } height={ height } y={ 0 }/>
		}

		x += width
		
		return icon
	})

	return <svg width={ 320 } height={ height }>{ icons }</svg>
}

export default Family