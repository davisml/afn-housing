import React from 'react'
import ReactDOM from 'react-dom'
import FormComponent from './FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Request from 'superagent'

const Query = function(query, variables) {
	return new Promise((resolve, reject) => {
		Request.post(`/graphql`).set('Content-Type', 'application/json').send({query, variables}).end((error, response) => {
			if (error) {
				if (response.body.errors) {
					reject(response.body.errors[0])
					return
				}

				reject(error)
			} else {
				resolve(response.body.data)
			}
		})
	})
}

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			locations: [],
			selectedLocation: 0
		}
	}

	componentDidMount() {
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
			this.setState({ locations })
		})
	}

	getNavItems() {
		let navItems = [{ description: 'All Locations', id: -1 }]
		navItems.push.apply(navItems, this.state.locations)
		return navItems
	}

	render() {
		const {locations, selectedLocation} = this.state

		const clickLocation = (index) => {
			return (event) => {
				this.setState({ selectedLocation: index })
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
		let activeNavItem = navItems[selectedLocation]

		let {forms} = activeNavItem

		if (!forms) {
			forms = []

			navItems.forEach((navItem) => {
				if (navItem.forms) {
					forms.push.apply(forms, navItem.forms)
				}
			})

			console.log(forms)
		}

		const renderFormItem = ({ id, member, data }, index) => {
			const {individuals = []} = data
			const key = `form-item-${ index }`
			const description = `${ member.firstName } ${ member.lastName }`
			const familySize = `${ individuals.length }`
			const ranking = index + 1

			console.log("Render form item")

			return <tr key={ key }>
				<td>{ description }</td>
				<td>{ familySize }</td>
				<td>{ ranking }</td>
				<td style={{width: 140}}>Awaiting Approval</td>
			</tr>
		}

		return <div id="admin">
			<div id="sidebar">
				<img src="/img/afn-logo.png" draggable={ false } />

				<div className="sidebar-item active">
					<img src="/img/house-icon.png" draggable={ false } />
				</div>
			</div>
			<div id="app-content">
				<div id="navigation" role="navigation">
					{ navItems.map(renderLocationTab) }
				</div>
				<div id="admin-content">
					<table className="forms-table">
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
	}
}

AppComponent.defaultProps = {

}

ReactDOM.render(<AppComponent />, document.getElementById('content'))
