import React from 'react'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Query from '../Query'
import _ from 'underscore'
import decamelize from 'decamelize'
import Sidebar from './Sidebar'

class AdminForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			housingForm: null
		}
	}

	componentDidMount() {
		console.log(`admin mounted`)
		const {formId} = this.props.params
		
		Query(`
			query {
				housingForm(id: ${ formId }) {
					id
				    member {
				      firstName
				      lastName
				      email
				      phone
				    }
				    location {
				      id
				      description
				    }
				    data {
				      additionalInformation
				      currentLivingConditions
				      isConsideredElder
				      isLivingOnReserve
				      isMember
				      requiresSupport
				      residesWithDisabled
				      disabilityConsideration
				    }
				}
			}
		`).then(({ housingForm }) => {
			this.setState({ housingForm })
		})

		// individuals {
		// 	name
		// 	age
		// 	relationship
		// }
	}

	render() {
		const form = this.state.housingForm || {}
		// const data = JSON.stringify(this.state.housingForm)

		const goHome = () => {
			const {router} = this.props

			router.push('/admin')
		}

		const formRows = _.keys(form).map((key) => {
			let content = null

			if (key != "id") {
				const formData = form[key]

				const formKeys = _.filter(_.keys(formData), (formKey) => {
					if (formKey === "id") {
						return false
					}

					const data = formData[formKey]

					if (data && data.length) {
						return true
					}

					return false
				})

				content = formKeys.map((formKey, index) => {
					const divKey = `${ key }-${ index }`
					let label = decamelize(formKey, ' ').replace(/(^|\s)[a-z]/g,function(f){return f.toUpperCase();})

					if (key == 'location') {
						label = 'Location'
					}

					return <div className="form-item" key={ divKey }>
						<div className="form-label">{ label }</div>
						<div className="form-value">{ formData[formKey] }</div>
					</div>
				})
			}

			return <div className="form-group" key={ key }>{ content }</div>
		})

		let formTitle = ''

		if (form.id) {
			formTitle = `Form #${ form.id }`
		}

		return <div id="admin">
			<Sidebar onSelect={ goHome } />
			<div id="app-content">
				<div id="navigation" role="navigation"><div className="nav-label">{ formTitle }</div></div>
				<div id="admin-content">{ formRows }</div>
			</div>
		</div>
	}
}

export default AdminForm