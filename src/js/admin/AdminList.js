import React from 'react'
import FormComponent from '../FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Query from '../Query'
import CheckButton from '../components/CheckButton'
import Sidebar from './Sidebar'
import {getURLParams} from '../helpers'
import _ from 'underscore'
import Family from '../components/Family'
import OtherIcon from '../components/OtherIcon'
import Moment from 'moment'

const StatusIcon = ({ status, width, height, fill }) => {
	const viewBox = {
		awaiting: '0 0 16 16',
		approved: '0 0 95 95',
		rejected: '0 0 77.2 77.2'
	}[status]

	const svgProps = { width, height, viewBox }

	if (status === "awaiting") {
		return <svg { ...svgProps }>
			<path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M5,9C4.4,9,4,8.6,4,8s0.4-1,1-1c0.6,0,1,0.4,1,1S5.6,9,5,9z M8,9
			C7.4,9,7,8.6,7,8s0.4-1,1-1c0.6,0,1,0.4,1,1S8.6,9,8,9z M11,9c-0.6,0-1-0.4-1-1s0.4-1,1-1c0.6,0,1,0.4,1,1S11.6,9,11,9z" fill={ fill } />
		</svg>
	} else if (status === "rejected") {
		return <svg { ...svgProps }>
			<path fill={ fill } d="M77.2,38.6C77.2,17.3,59.9,0,38.6,0S0,17.3,0,38.6s17.3,38.6,38.6,38.6S77.2,59.9,77.2,38.6z M22.4,51.8l13.2-13.2
	L22.4,25.4l3-3l13.2,13.2l13.2-13.2l3,3L41.6,38.6l13.2,13.2l-3,3L38.6,41.6L25.4,54.8L22.4,51.8z" />
		</svg>
	}

	return <svg { ...svgProps }>
		<path d="M47.5,0C21.3,0,0,21.3,0,47.5C0,73.7,21.3,95,47.5,95S95,73.7,95,47.5S73.7,0,47.5,0z M42.1,66.4L22.8,47.1l5.1-5.1
	l14.2,14.2l28-28l5.1,5.1L42.1,66.4z" fill={ fill } />
	</svg>
}

StatusIcon.defaultProps = {
	fill: 'rgb(120,120,120)',
	width: 22,
	height: 22
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
					createdAt
					rejectedAt
					approvedAt
					archivedAt
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
		let locationsMap = {}

		locations.forEach((location, index) => {
			locationsMap[location.id] = location
		})

		localStorage.setItem('locations', JSON.stringify(locationsMap))
		callback(locationsMap)
	})
}

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		// const options = ['AFN member', 'Living on reserve', 'Elder', 'Disabilities', 'Requires funding', 'Number of occupants']

		this.state = {
			locations: {},
			numberOfRooms: ''
		}
	}

	componentDidMount() {
		// console.log(`admin mounted`)
		
		getLocations((locations) => {
			this.setState({ locations })
		})
	}

	getNavItems() {
		let navItems = [{ description: 'All Locations', id: -1 }]
		navItems.push.apply(navItems, _.values(this.state.locations))
		return navItems
	}

	setParams(params) {
		const {router, location} = this.props
		const query = _.extend(_.clone(location.query), params)

		// console.log(query)

		const encodePair = (key, value) => `${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`

		const queryString = _.keys(query).map((key) => encodePair(key, query[key])).join('&')

		const url = `/admin?${ queryString }`

		// console.log(`url: ${ url }`)

		router.replace(url)
	}

	render() {
		const {locations} = this.state
		const {query} = this.props.location

		const selectedLocation = Number(query.location || 0)
		const filterNumberOfRooms = query.rooms || ''
		const filterStatus = query.status || 0
		const showArchived = (query.archived == 'true')

		const changeLocation = ({ target }) => {
			const {value: location} = target
			this.setParams({ location })
		}

		const changeStatus = ({ target }) => {
			const {value: status} = target
			this.setParams({ status })
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
					forms.push.apply(forms, navItem.forms.map((form) => {
						return _.extend({ location: navItem.id }, form)
					}))
				}
			})
		}

		forms = forms.map((form) => {
			const {individuals} = form.data
			
			let numberOfRooms = individuals.length + 1

			let children = {
				son: 0,
				daughter: 0
			}

			individuals.forEach((individual) => {
				if (individual.relationship === "partner") {
					numberOfRooms -= 1
				} else if (individual.relationship === "son" || individual.relationship === "child") {
					if (!children.son % 2) {
						numberOfRooms -= 1
					}

					children.son++
				} else if (individual.relationship === "daughter") {
					if (!children.daughter % 2) {
						numberOfRooms -= 1
					}

					children.daughter++
				}
			})

			return _.extend({ numberOfRooms, date: Moment(form.createdAt).toDate() }, form)
		})

		if (filterNumberOfRooms.length && Number(filterNumberOfRooms) > 0) {
			forms = forms.filter((form) => (form.numberOfRooms <= Number(filterNumberOfRooms)))
		}

		if (!showArchived) {
			forms = forms.filter((form) => !form.archivedAt)
		}
		
		if (filterStatus > 0) {
			forms = forms.filter((form) => {
				if (filterStatus == 1 && form.approvedAt) {
					return true
				} else if (filterStatus == 2 && !form.approvedAt && !form.rejectedAt) {
					return true
				} else if (filterStatus == 3 && form.rejectedAt) {
					return true
				}

				return false
			})
		}
		
		forms = forms.sort((a, b) => {
			if (a.date < b.date) {
				return -1
			}
			
			if (a.date > b.date) {
				return 1
			}
			
			return 0
		})

		const handleItemClick = (index) => {
			return (event) => {
				const form = forms[index]
				// console.log(`formid: ${ form.id }`)
				const formId = form.id

				this.props.router.push(`/admin/form/${ formId }`)
			}
		}

		const renderFormItem = ({ id, member, createdAt: submitDate, rejectedAt, approvedAt, location, data, numberOfRooms: familySize }, index) => {
			const {individuals = []} = data
			const key = `form-item-${ index }`
			const description = `${ member.firstName } ${ member.lastName }`
			const ranking = index + 1

			const createdAt = Moment(submitDate).format('MMM DD, YYYY')

			// console.log(`render form item`)
			// console.log(data)

			let icons = []

			if (data.isMember) {
				icons.push(<OtherIcon title="AFN member" type="member" key="icon-member" width={ 26 } height={ 26 } />)
			}

			if (data.isLivingOnReserve) {
				icons.push(<OtherIcon title="Living on reserve" type="reserve" key="icon-reserve" width={ 30 } height={ 30 } />)
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

			// let childIcons = []

			// childIcons.push(<OtherIcon title="Applicant" type="person" key="child-submitter" width={ 32 } height={ 32 } />)

			const sortedIndividuals = individuals.map((individual) => {
				let rank = 0

				const {relationship} = individual

				// console.log(individual)
				// console.log(relationship)

				if (relationship == "son" || relationship == "child") {
					rank = 1
				} else if (relationship == "daughter") {
					rank = 2
				}

				return _.extend({ rank }, individual)
			}).sort((a, b) => {
				if (a.rank < b.rank) {
					return -1
				} else if (a.rank > b.rank) {
					return 1
				}

				return 0
			})

			sortedIndividuals.splice(0, 0, {
				relationship: 'applicant',
				age: 20,
				name: 'Joe Schmoe'
			})

			// sortedIndividuals.forEach(({ relationship: rel, age }, index) => {
			// 	const key = `child-${ index }`

			// 	if (rel == "daughter") {
			// 		childIcons.push(<OtherIcon title="Girl" type="girl" key={ key } width={ 44 } height={ 44 } />)
			// 	} else if (rel == "son" || rel == "child") {
			// 		childIcons.push(<OtherIcon title="Boy" type="boy" key={ key } width={ 32 } height={ 32 } />)
			// 	} else {
			// 		const relationship = rel.charAt(0).toUpperCase() + rel.slice(1)

			// 		childIcons.push(<OtherIcon title={ relationship } type="person" key={ key } width={ 32 } height={ 32 } />)
			// 	}
			// })

			// childIcons.sort((a, b) => {
			// 	if (a.type == )
			// })

			var status = "awaiting"

			if (approvedAt) {
				status = "approved"
			} else if (rejectedAt) {
				status = "rejected"
			}

			const statusFills = {
				awaiting: 'rgb(254, 206, 4)',
				approved: 'rgb(69, 219, 3)',
				rejected: 'rgb(209, 36, 3)'
			}

			const iconProps = { status, fill: statusFills[status] }
			const statusIcon = <StatusIcon { ...iconProps } />

			if (selectedLocation === 0) {
				// console.log(`location: ${ location }`)
				// console.log(locations[location])

				const locationName = locations[location] ? locations[location].description : ''

				return <tr key={ key } onClick={ handleItemClick(index) }>
					<td className="status">{ statusIcon }</td>
					<td className="name">{ description }</td>
					<td style={{width: 140}}>{ locationName }</td>
					<td style={{width: 200}} className="icon-cell">{ icons }</td>
					{/*<td className="icon-cell children">{ childIcons }</td>*/}
					<td className="icon-cell children"><Family people={ sortedIndividuals } /></td>
					<td style={{width: 140}}>{ createdAt }</td>
				</tr>
			}

			return <tr key={ key } onClick={ handleItemClick(index) }>
				<td className="status">{ statusIcon }</td>
				<td className="name">{ description }</td>
				<td className="icon-cell">{ icons }</td>
				<td className="icon-cell children"><Family people={ sortedIndividuals } /></td>
				<td style={{width: 140}}>{ createdAt }</td>
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
		
		const locationOptions = [<option value={ 0 } key="option-0">All Locations</option>]

		const locationValues = _.values(this.state.locations)

		if (locationValues) {
			locationValues.forEach((location, index) => {
				const key = `option-${ index + 1 }`
				locationOptions.push(<option value={ location.id } key={ key }>{ location.description }</option>)
			})
		}

		let tableHeader = null

		// console.log(`selected location`)

		if (selectedLocation == 0) {
			tableHeader = <tr>
				<th className="status"></th>
				<th className="name">Name</th>
				<th>Location</th>
				<th>Considerations</th>
				<th>Household</th>
				<th>Submitted</th>
			</tr>
		} else {
			tableHeader = <tr>
				<th className="status"></th>
				<th className="name">Name</th>
				<th>Considerations</th>
				<th>Household</th>
				<th>Submitted</th>
			</tr>
		}

		const changeNumberOfRooms = ({ target }) => {
			const {value: rooms} = target
			this.setParams({ rooms })
		}

		const toggleArchived = ({ target }) => {
			const {checked: archived} = target

			console.log(`toggle archived`)
			console.log(archived)

			this.setParams({ archived })
		}

		const statusOptions = ['All Forms', 'Approved', 'Pending', 'Rejected'].map((label, index) => {
			const key = `status-${index}`
			
			return <option key={ key } value={ index }>{ label }</option>
		})
		
		const logout = () => {
			window.location.href = 'http://housingapp.acadiafirstnation.ca/logout'
		}

		return <div id="admin">
			<Sidebar onLogout={ logout }/>
			<div id="app-content">
				<div id="admin-content">
					<div className="forms-search">
						<div className="search-header">Filter</div>
						<div className="search-row" style={{padding: '0px 20px', paddingTop: '10px'}}>
							<label>Status</label>
							<select value={ filterStatus } onChange={ changeStatus }>{ statusOptions }</select>
						</div>
						<div className="search-row" style={{padding: '0px 20px', paddingTop: '15px'}}>
							<label>Number of Rooms</label>
							<input min={ 0 } max={ 10 } value={ filterNumberOfRooms } onChange={ changeNumberOfRooms } type="number" />
						</div>
						<div className="search-row" style={{padding: '0px 20px', paddingTop: '15px'}}>
							<label>Location</label>
							<select value={ selectedLocation } onChange={ changeLocation }>{ locationOptions }</select>
						</div>
						<div className="search-row" style={{padding: '0px 20px', paddingTop: '15px'}}>
							<input type="checkbox" onChange={ toggleArchived } checked={ showArchived } /><label>Show Archived</label>
						</div>
					</div>
					<div className="forms-list">
						<table>
							<thead>
								{ tableHeader }
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
