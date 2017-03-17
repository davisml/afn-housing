import React from 'react'
import FormComponent from '../FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Query from '../Query'
import CheckButton from '../components/CheckButton'
import Sidebar from './Sidebar'
import {getURLParams} from '../helpers'

const StatusIcon = ({ status, width, height, fill }) => {
	const svgProps = { width, height, viewBox: '0 0 16 16' }

	return <svg { ...svgProps }>
		<path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M5,9C4.4,9,4,8.6,4,8s0.4-1,1-1c0.6,0,1,0.4,1,1S5.6,9,5,9z M8,9
		C7.4,9,7,8.6,7,8s0.4-1,1-1c0.6,0,1,0.4,1,1S8.6,9,8,9z M11,9c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S11.6,9,11,9z" fill={ fill } />
	</svg>
}

StatusIcon.defaultProps = {
	fill: 'rgb(120,120,120)',
	width: 22,
	height: 22
}

const OtherIcon = ({ width, height, title, type, fill }) => {
	const svgProps = { width, height }
	let content = null

	if (type == 'disabled') {
		svgProps.viewBox = '0 0 100 100'

		content = <svg { ...svgProps }>
			<path fill={ fill } d="M78.7,15H21.3c-3.5,0-6.4,2.9-6.4,6.4v57.4c0,3.5,2.9,6.4,6.4,6.4h57.4c3.5,0,6.4-2.9,6.4-6.4V21.3C85,17.8,82.2,15,78.7,15  z M48.6,72.8c-8.8,0-15.9-7.1-15.9-15.9c0-6.6,4-12.3,9.8-14.7l0.7,3.9c-4,2-6.7,6.1-6.7,10.8c0,6.7,5.4,12.1,12.1,12.1  c5.1,0,9.5-3.2,11.2-7.7l1.2,5c0,0.1,0.1,0.2,0.1,0.3C58.2,70.4,53.7,72.8,48.6,72.8z M71.1,66.4L66,67.6c-0.2,0-0.4,0.1-0.6,0.1  c-1.1,0-2.2-0.8-2.5-1.9l-3-12.2H48.6c-1.2,0-2.3-0.9-2.5-2.1l-3.4-17.7C42,33,41.5,32,41.5,30.8c0-2.6,2.1-4.7,4.7-4.7  c2.6,0,4.7,2.1,4.7,4.7c0,1.9-1.1,3.5-2.8,4.3l1.1,5.5h8.3c1.4,0,2.5,1.1,2.5,2.5c0,1.4-1.1,2.5-2.5,2.5h-7.3l0.5,2.9h11.1  c1.2,0,2.2,0.8,2.5,1.9l2.9,11.6l2.6-0.6c1.4-0.3,2.7,0.5,3.1,1.9C73.3,64.7,72.4,66.1,71.1,66.4z"></path>
			<path fill={ fill } d="M78.7,9H21.3C14.5,9,9,14.5,9,21.3v57.4C9,85.5,14.5,91,21.3,91h57.4C85.5,91,91,85.5,91,78.7V21.3C91,14.5,85.5,9,78.7,9z   M87,78.7c0,4.6-3.7,8.4-8.4,8.4H21.3c-4.6,0-8.4-3.7-8.4-8.4V21.3c0-4.6,3.7-8.4,8.4-8.4h57.4c4.6,0,8.4,3.7,8.4,8.4V78.7z"></path>
		</svg>
	} else if (type == 'member') {
		svgProps.viewBox = '0 0 96 96'
		
		const pathProps = { fill }

		content = <svg {...svgProps}>
			<g>
				<path {...pathProps} d="M72.482,74.631H23.516C17.717,74.631,13,69.912,13,64.113V31.887c0-5.799,4.717-10.518,10.516-10.518   h48.967C78.281,21.369,83,26.088,83,31.887v32.227C83,69.912,78.281,74.631,72.482,74.631 M23.516,24.793   c-3.91,0-7.092,3.182-7.092,7.094v32.227c0,3.912,3.182,7.094,7.092,7.094h48.967c3.912,0,7.094-3.182,7.094-7.094V31.887   c0-3.912-3.182-7.094-7.094-7.094H23.516z"></path>
				<path {...pathProps} d="M38.869,60.459H23.367c-0.945,0-1.713-0.766-1.713-1.711c0-0.947,0.768-1.713,1.713-1.713h15.502   c0.945,0,1.713,0.766,1.713,1.713C40.582,59.693,39.814,60.459,38.869,60.459"></path>
				<path {...pathProps} d="M48,66.166H23.367c-0.945,0-1.713-0.768-1.713-1.713s0.768-1.711,1.713-1.711H48   c0.945,0,1.711,0.766,1.711,1.711S48.945,66.166,48,66.166"></path>
				<path {...pathProps} d="M74.631,58.842c0,4.309-3.492,7.799-7.799,7.799c-4.309,0-7.799-3.49-7.799-7.799   c0-4.307,3.49-7.799,7.799-7.799C71.139,51.043,74.631,54.535,74.631,58.842"></path>
			</g>
		</svg>
	} else if (type == 'charity') {
		svgProps.viewBox = '0 0 100 100'

		const pathProps = { fill }

		content = <svg { ...svgProps }>
			<path {...pathProps} d="M90.5,61l-19.2,5.4l0,0.1c0.5,1.9,0.2,4-0.8,5.7c-1,1.9-2.7,3.2-4.8,3.8c-2,0.6-4.2,0.3-6.1-0.7l-11.1-6.2  l1-1.9l11.1,6.2c1.4,0.8,2.9,0.9,4.4,0.5c1.5-0.4,2.7-1.4,3.5-2.8c0.4-0.7,0.6-1.5,0.7-2.3c0.3-1.9-0.6-3.9-2.3-4.8l-26.9-15  c0,0-2.8-1.9-6.6-0.8c0,0,0,0-0.1,0C32.9,48.5,4,56.8,2.7,57.1l-0.1,0l5.9,20.7l19.3-5.5c2,1.2,16.7,10.3,18.5,11.4  c3.3,1.9,7.3,0.9,8.2,0.6c0.1,0,39.4-11.2,39.4-11.2c2.7-0.8,5-4.4,3.9-8.1C96.9,61.9,93.6,60.1,90.5,61z"></path>
			<path {...pathProps} d="M79.1,27.1c0.4-0.1,0.8-0.5,0.9-0.9c0.1-0.5,0-0.9-0.4-1.2L79.1,27.1z"></path>
			<path {...pathProps} d="M78.5,21.8c-0.1,0.4,0,0.9,0.3,1.2l0.5-2.1C78.9,21.1,78.6,21.4,78.5,21.8z"></path>
			<path {...pathProps} d="M81.1,16.3c-4.2-1-8.5,1.6-9.5,5.8c-1,4.2,1.6,8.5,5.8,9.5s8.5-1.6,9.5-5.8C87.9,21.6,85.3,17.3,81.1,16.3z   M82.4,22.4c-0.3,0.2-0.7,0.1-0.9-0.2c-0.1-0.2-0.5-0.7-0.9-1L80,23.6c1,0.5,1.6,1.7,1.3,2.9c-0.3,1.2-1.3,2-2.5,2l-0.1,0.4  c-0.1,0.4-0.4,0.6-0.8,0.5c-0.4-0.1-0.6-0.4-0.5-0.8l0.1-0.4c-1-0.6-1.6-1.8-1.7-1.9c-0.2-0.3,0-0.7,0.3-0.9c0.3-0.2,0.7,0,0.9,0.3  c0.1,0.2,0.5,0.8,0.9,1.2l0.6-2.3c-1-0.5-1.5-1.7-1.3-2.8c0.3-1.1,1.3-1.9,2.4-2l0.1-0.4c0.1-0.4,0.4-0.6,0.8-0.5  c0.4,0.1,0.6,0.4,0.5,0.8l-0.1,0.4c1,0.5,1.7,1.6,1.8,1.7C82.8,21.9,82.7,22.3,82.4,22.4z"></path>
			<path {...pathProps} d="M77.3,52.7c0.2-0.4,0.3-1,0-1.4c-0.3-0.5-0.8-0.7-1.2-0.7L77.3,52.7z"></path>
			<path {...pathProps} d="M72.6,49c0.3,0.4,0.7,0.7,1.2,0.7l-1.2-2.1C72.3,48,72.3,48.5,72.6,49z"></path>
			<path {...pathProps} d="M70.3,42.4c-4.3,2.5-5.7,8-3.2,12.3c2.5,4.3,8,5.7,12.3,3.2c4.3-2.5,5.7-8,3.2-12.3  C80.1,41.3,74.6,39.9,70.3,42.4z M76.3,46.3c-0.1,0.4-0.5,0.6-0.9,0.5c-0.3-0.1-1-0.2-1.6-0.1l1.4,2.4c1.3-0.4,2.7,0.2,3.3,1.3  c0.7,1.2,0.5,2.6-0.5,3.6l0.2,0.4c0.2,0.4,0.1,0.8-0.3,1c-0.4,0.2-0.8,0.1-1-0.3l-0.2-0.4c-1.3,0.3-2.8-0.2-3-0.2  c-0.4-0.1-0.6-0.6-0.5-0.9c0.1-0.4,0.6-0.6,0.9-0.5c0.3,0.1,1,0.3,1.7,0.3l-1.4-2.4c-1.2,0.3-2.6-0.2-3.3-1.3  c-0.7-1.2-0.5-2.6,0.4-3.5l-0.2-0.4c-0.2-0.4-0.1-0.8,0.3-1c0.4-0.2,0.8-0.1,1,0.3l0.2,0.4c1.3-0.4,2.6,0,2.8,0  C76.2,45.5,76.4,46,76.3,46.3z"></path>
			<path {...pathProps} d="M61.1,38.3c0.4-0.2,0.7-0.6,0.8-1s-0.1-0.9-0.5-1.2L61.1,38.3z"></path>
			<path {...pathProps} d="M59.8,33.1c-0.1,0.5,0.1,0.9,0.4,1.2l0.3-2.2C60.2,32.3,59.9,32.6,59.8,33.1z"></path>
			<path {...pathProps} d="M61.9,27.2c-4.4-0.6-8.5,2.6-9,7c-0.6,4.4,2.6,8.5,7,9s8.5-2.6,9-7C69.4,31.8,66.3,27.7,61.9,27.2z   M63.9,33.3c-0.3,0.2-0.7,0.2-0.9-0.1c-0.2-0.2-0.6-0.7-1.1-0.9l-0.3,2.5c1.1,0.4,1.8,1.6,1.6,2.8c-0.2,1.2-1.1,2.1-2.3,2.3  l-0.1,0.4c0,0.4-0.4,0.6-0.7,0.6c-0.4,0-0.6-0.4-0.6-0.7l0.1-0.4c-1.1-0.5-1.9-1.6-2-1.8c-0.2-0.3-0.1-0.7,0.2-0.9  c0.3-0.2,0.7-0.1,0.9,0.2c0.1,0.2,0.6,0.8,1,1.1l0.3-2.4c-1.1-0.4-1.7-1.6-1.6-2.8c0.2-1.2,1.1-2.1,2.2-2.3l0.1-0.4  c0-0.4,0.4-0.6,0.7-0.6c0.4,0,0.6,0.4,0.6,0.7l0,0.4c1.1,0.4,1.9,1.4,2,1.5C64.3,32.6,64.2,33,63.9,33.3z"></path>
		</svg>
	} else if (type == 'elder') {
		svgProps.viewBox = "0 0 87.4 87.4"

		content = <svg { ...svgProps }>
			<rect x="47.1" y="58.6" class="st0" width="3.3" height="4.7" fill={ fill }/>
			<path fill={ fill } d="M65.1,5.9C56.1,5.4,48,10,43.7,17.1C39.6,10.3,32.1,5.8,23.6,5.8C10.6,5.8,0,15.3,0,29.5
				c0,14.6,3.3,27.5,43.7,50.2c39.6-22.2,43.5-36.1,43.7-49.3C87.5,17.9,77.5,6.6,65.1,5.9z M33.4,47.3v1.6c0,0.5-0.4,1-1,1
				c-0.5,0-1-0.4-1-1v-1.6c0-0.6,0.2-1.2,0.5-1.7c0.3,0.7,0.8,1.2,1.4,1.5C33.4,47.2,33.4,47.2,33.4,47.3z M34.7,46
				c-0.8,0-1.5-0.6-1.6-1.4c-0.1-0.9,0.5-1.7,1.4-1.9l10.3-1.5l1.5-5.9c0.2-0.9,1.1-1.4,2-1.2s1.4,1.1,1.2,2l-1.8,7
				c-0.2,0.6-0.7,1.1-1.3,1.2L35,46.1C34.9,46,34.8,46,34.7,46z M38.2,64.1c0,0.5-0.4,1-1,1s-1-0.4-1-1V47.3c0,0,0,0,0-0.1l1.9-0.3
				c0,0.1,0,0.2,0,0.3L38.2,64.1L38.2,64.1z M54,58.6v4.7v1.6h-3.5h-3.3h-3.5h-2.3v-1.6h2.3v-4.7h-3.3V46.7l6.3-0.9
				c1.2-0.2,2.1-1,2.5-2.2l1.8-6.9c0.2-0.8,0.1-1.6-0.3-2.3c-0.4-0.7-1-1.2-1.8-1.4c-1.6-0.4-3.2,0.5-3.6,2.1L44,40l-3.5,0.5v-3.1
				c0-0.7,0.2-1.3,0.4-2c-0.3,0.1-0.7,0.1-1.1,0.1c-3.1,0-5.5-2.5-5.5-5.5c0-3.1,2.5-5.5,5.5-5.5c1,0,2,0.3,2.9,0.8l0,0
				c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2s-1,2.2-2.2,2.2h-0.1c0.4,0.8,0.6,1.6,0.6,2.6c0,0.2,0,0.4,0,0.6c0.9-0.4,1.9-0.6,3-0.6
				c4.2,0,7.6,3.3,7.8,7.4v21C56.2,58.5,54,58.5,54,58.6z"/>
		</svg>
	}

	return <div title={ title } alt={ title } className="icn">{ content }</div>
}

OtherIcon.defaultProps = {
	fill: 'rgb(120,120,120)',
	width: 24,
	height: 24
}

const getLocations = (callback) => {
	const locationsString = localStorage.getItem('locations')

	if (locationsString && locationsString.length) {
		callback(JSON.parse(locationsString))
	}

	Query(`
		query {
			locations {
				id
				description
				forms {
					id
					member {
						firstName
						lastName
						email
					}
					data {
						individuals {
							name
							age
							relationship
						}
						requiresSupport
						isConsideredElder
						isLivingOnReserve
						isMember
						residesWithDisabled
					}
				}
			}
		}
	`).then(({locations}) => {
		localStorage.setItem('locations', JSON.stringify(locations))
		callback(locations)
		// this.setState({ locations })
	})
}

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		const options = ['AFN member', 'Living on reserve', 'Elder', 'Disabilities', 'Requires funding', 'Number of occupants']

		this.state = {
			locations: [],
			options: options.map((option) => {
				return {
					label: option,
					checked: false
				}
			})
		}
	}

	componentDidMount() {
		console.log(`admin mounted`)
		
		getLocations((locations) => {
			this.setState({ locations })
		})
	}

	getNavItems() {
		let navItems = [{ description: 'All Locations', id: -1 }]
		navItems.push.apply(navItems, this.state.locations)
		return navItems
	}

	render() {
		const {locations} = this.state
		const searchParams = getURLParams(this.props.location.search)
		const selectedLocation = Number(searchParams.location || 0)

		const clickLocation = (index) => {
			return (event) => {
				const {router} = this.props
				router.replace(`/admin?location=${ index }`)
			}
		}

		const renderLocationTab = (location, index) => {
			const {description, id} = location
			const active = (index === selectedLocation)
			const className = ClassNames('nav-item', { active })
			const key = `nav-item-${ index }`

			return <div key={ key } className={ className } onClick={ clickLocation(index) }>{ description }</div>
		}

		let navItems = this.getNavItems()
		let forms = null

		if (selectedLocation < navItems.length) {
			let activeNavItem = navItems[selectedLocation]

			forms = activeNavItem.forms
		}

		if (!forms) {
			forms = []

			navItems.forEach((navItem) => {
				if (navItem.forms) {
					forms.push.apply(forms, navItem.forms)
				}
			})
		}

		const handleItemClick = (index) => {
			return (event) => {
				const form = forms[index]
				console.log(`formid: ${ form.id }`)
				const formId = form.id

				this.props.router.push(`/admin/form/${ formId }`)
			}
		}

		const renderFormItem = ({ id, member, data }, index) => {
			const {individuals = []} = data
			const key = `form-item-${ index }`
			const description = `${ member.firstName } ${ member.lastName }`
			const familySize = `${ individuals.length + 1 }`
			const ranking = index + 1

			console.log(`render form item`)
			console.log(data)

			let icons = []

			if (data.isMember) {
				icons.push(<OtherIcon title="AFN member" type="member" key="icon-member" width={ 32 } height={ 32 } />)
			}

			if (data.isConsideredElder) {
				icons.push(<OtherIcon title="Elder" type="elder" key="icon-elder" />)
			}

			if (data.residesWithDisabled) {
				icons.push(<OtherIcon title="Disability" type="disabled" key="icon-disabled" width={ 30 } height={ 30 } />)
			}

			if (data.requiresSupport) {
				icons.push(<OtherIcon title="Requires support" type="charity" key="icon-charity" />)
			}

			// residesWithDisabled

			return <tr key={ key } onClick={ handleItemClick(index) }>
				<td style={{width: 22}}><StatusIcon status="awaiting" /></td>
				<td style={{width: 220}}>{ description }</td>
				<td className="icon-cell">{ icons }</td>
				<td style={{width: 140}}>{ familySize }</td>
			</tr>
		}

		const handleOptionCheck = (index) => {
			return (event) => {
				const newOptions = this.state.options.slice()

				newOptions[index].checked = !newOptions[index].checked

				this.setState({options: newOptions})
			}
		}

		const {options} = this.state
		
		return <div id="admin">
			<Sidebar />
			<div id="app-content">
				<div id="navigation" role="navigation">
					{ navItems.map(renderLocationTab) }
				</div>
				<div id="admin-content">
					<div className="forms-search">{
						options.map(({ label, checked }, index) => (
							<div className="search-row" key={`option-${ index }`}>
								<CheckButton checked={ checked } onChange={ handleOptionCheck(index) }>{ label }</CheckButton>
							</div>
						))
					}</div>
					<div className="forms-list">
						<table>
							<thead>
								<tr>
									<th></th>
									<th>Name</th>
									<th>Considerations</th>
									<th>Rooms</th>
								</tr>
							</thead>
							<tbody>
								{ forms.map(renderFormItem) }
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	}
}

AppComponent.defaultProps = {

}

export default AppComponent
