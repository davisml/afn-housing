import {Component, default as React} from 'react'
import SVGPath from 'svgpath'
import roundPathCorners from '../vendor/rounding'
// import getRoundedShape from '../vendor/getRoundedShape'
import {Motion, spring} from 'react-motion'

class Checkbox extends Component {
	constructor() {
		super()

		this._setupEventListeners()

		this.state = {
			active: false,
			hover: false,
			animate: false
		}
	}

	_setupEventListeners() {
		this.handleMouseDown = (event) => {
			this.setState({ active: true, hover: true, animate: false })
			window.addEventListener('mouseup', this.handleMouseUp)

			event.preventDefault()
		}
		
		this.handleMouseUp = (event) => {
			const changed = (this.state.hover && this.state.active)

			if (changed) {
				this.props.onChange(event)
			}

			this.setState({ active: false })
			window.removeEventListener('mouseup', this.handleMouseUp)
		}

		this.handleMouseOut = (event) => {
			this.setState({ hover: false })
		}

		this.handleMouseOver = (event) => {
			this.setState({ hover: true })
		}
	}

	render() {
		const {checked, size, checkStrokeWidth, strokeWidth, borderWidth, borderRadius, onChange} = this.props
		const {active, hover} = this.state
		const width = size
		const height = size
		const svgProps = { width, height }

		let fill =  'rgb(59, 153, 252)'
		let stroke = 'rgb(52, 138, 229)'

		let backgroundFill = "white"
		let backgroundStroke = "rgb(204, 204, 204)"

		if (active && hover) {
			if (checked) {
				fill = 'rgb(36, 103, 170)'
				stroke = 'rgb(36, 103, 170)'
			} else {
				backgroundFill = "rgb(242,242,242)"
			}
		}

		const pathSize = 25
		const pathData = roundPathCorners(`M 0 15 L 10 25 L 25 0`, 0.02, true)
		
		const checkWidth = pathSize + (checkStrokeWidth * 2)
		
		const checkViewBox = `0 0 ${ checkWidth } ${ checkWidth }`
		
		const renderCheck = (s) => {
			const delta = (size / 48)
			const factor = (s * delta)
			const scaledCheckWidth = (checkWidth * factor)

			const checkX = (size / 2) - (scaledCheckWidth / 2)
			const checkY = checkX

			return <svg key="check" x={ checkX } y={ checkY } width={ scaledCheckWidth } height={ scaledCheckWidth } viewBox={ checkViewBox }>
				<g transform="translate(5,5)">
					<g transform={`translate(0, 1.5)`}>
						<path d={ pathData } stroke="rgba(14, 53, 88, 0.5)" fill="transparent" strokeWidth={ checkStrokeWidth } strokeLinecap="round" strokeLinejoin="round"/>
					</g>
					<g>
						<path d={ pathData } stroke="white" fill="transparent" strokeWidth={ checkStrokeWidth } strokeLinecap="round" strokeLinejoin="round"/>
					</g>
				</g>
			</svg>
		}

		const scaleValue = checked ? 1.0 : 0.0

		// console.log(`should animate?`)
		// console.log(this.state.animate)

		let defaultStyle = {
			scale: scaleValue
		}

		let motionStyle = {
			scale: spring(scaleValue)
		}

		return <div className="checkbox">
			<svg {...svgProps} onMouseDown={ this.handleMouseDown } onMouseOver={ this.handleMouseOver } onMouseOut={ this.handleMouseOut }>
				<Motion key="checkMotion" defaultStyle={ defaultStyle } style={ motionStyle }>{({ scale: value }) => {
					let background = null
					let selectedNode = null
					let check = null

					let rx, ry = borderRadius
					let bgRect = { x: 0, y: 0, rx, ry, width, height }

					let strokeRect = {
						x: bgRect.x + (borderWidth / 2),
						y: bgRect.y + (borderWidth / 2),
						width: bgRect.width - borderWidth,
						height: bgRect.height - borderWidth,
						rx, ry
					}

					if (value < 1.0) {
						background = <g key="check-background">
							<rect {...bgRect} fill={ backgroundFill } />
							<rect {...strokeRect} stroke={ backgroundStroke } fill="transparent" />
						</g>
					}

					selectedNode = <g key="check-selection" opacity={ value }>
						<rect {...bgRect} fill={ fill } />
						<rect {...strokeRect} stroke={ stroke } fill="transparent" />
					</g>

					if (value > 0.0) {
						check = renderCheck(value)
					}

					const children = [background, selectedNode, check]

					return <g>{ children }</g>
				}}</Motion>
			</svg>
		</div>
	}
}

// const Checkbox = 

Checkbox.defaultProps = {
	size: 18,
	borderWidth: 1,
	checkStrokeWidth: 5,
	checked: false,
	borderRadius: 4,
	onChange: function() {
		console.warn("Provide an onChange handler to Checkbox")
	}
}

export default Checkbox