import React from 'react'
import FormComponent from '../FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Query from '../Query'
import CheckButton from '../components/CheckButton'
import Sidebar from './Sidebar'
import {getURLParams} from '../helpers'

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
			const familySize = `${ individuals.length }`
			const ranking = index + 1

			return <tr key={ key } onClick={ handleItemClick(index) }>
				<td>{ description }</td>
				<td>{ familySize }</td>
				<td>{ ranking }</td>
				<td style={{width: 140}}>Awaiting Approval</td>
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
									<th>Description</th>
									<th>Family Members</th>
									<th>Ranking</th>
									<th>Status</th>
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
