import React from 'react'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'
import Query from '../Query'
import _ from 'underscore'
import decamelize from 'decamelize'
import Sidebar from './Sidebar'
import OtherIcon from '../components/OtherIcon'
import Moment from 'moment'

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
				    createdAt
				    data {
				      additionalInformation
				      currentLivingConditions
				      isConsideredElder
				      isLivingOnReserve
				      isMember
				      requiresSupport
				      residesWithDisabled
				      disabilityConsideration
				      birthDate
				      individuals {
					    name
					    age
					    relationship
					  }
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

		let formValues = _.keys(form).map((key) => {
			let content = null

			if (key != "id") {
				const formData = form[key]

				const formKeys = _.filter(_.keys(formData), (formKey) => {
					if (formKey === "id" || formKey === "birthDate" || formKey === "individuals" || formKey === "firstName" || formKey === "lastName") {
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

					return {
						key: divKey,
						label,
						value: formData[formKey]
					}
				})
			}

			return content
		})

		formValues.splice(0, 0, {
			key: 'submittedAt',
			label: 'Submitted',
			value: Moment(form.createdAt).format('MMMM DD, YYYY hh:mma')
		})

		const allRows = _.flatten(formValues).filter((obj) => (obj != null))
		const remainingRows = allRows.slice(3)

		const renderRow = (obj, index) => {
			// console.log(`obj`)
			// console.log(obj)
			const { key, value, label } = obj

			let formValue = value

			if (label === 'Email') {
				const href = `mailto:${ value }`

				formValue = <a href={ href }>{ value }</a>
			}

			return <div className="form-item" key={ key }>
				<div className="form-label">{ label }</div>
				<div className="form-value">{ formValue }</div>
			</div>
		}

		const formRows = allRows.slice(0, 3).map(renderRow)
		const bottomRows = remainingRows.map(renderRow)

		let formTitle = ''

		if (form.id) {
			formTitle = `Form #${ form.id }`
		}

		console.log('form')
		console.log(form)

		let fullName = ''

		if (form.member) {
			fullName = `${ form.member.firstName } ${ form.member.lastName }`
		}

		const renderIndividual = ({ name, age, relationship: rel }, index) => {
			const relationship = rel.charAt(0).toUpperCase() + rel.slice(1)
			const key = `individual-${ index }`

			let nameContent = name + ''

			if (index === 0) {
				nameContent = <span>{ name }&nbsp;&nbsp;<i className="fa fa-star" aria-hidden="true"></i></span>
			}

			return <tr key={ key }>
				<td>{ nameContent }</td>
				<td>{ age }</td>
				<td>{ relationship }</td>
			</tr>
		}

		let individuals = form.data ? form.data.individuals : []

		function getAge(date) {
		    var now = new Date()
		    var age = now.getFullYear() - date.getFullYear()
		    return age
		}

		if (form.data) {
			individuals.splice(0, 0, { name: fullName, age: getAge(new Date(form.data.birthDate)), relationship: 'Applicant'})
		}

		let infoContent = null

		if (form.id) {
			let individualsTable = null

			if (individuals.length) {
				individualsTable = <table className="individuals-table">
					<thead>
						<tr>
							<th>Name</th>
							<th>Age</th>
							<th>Relationship</th>
						</tr>
					</thead>
					<tbody>
						{ individuals.map(renderIndividual) }
					</tbody>
				</table>
			}

			let icons = []
			const {data} = form

			if (data.isMember) {
				icons.push({key: 'member', title: 'AFN member', width: 26, height: 26 })

				// icons.push(<div key="icon-member" className="consideration">
				// 	<OtherIcon title="AFN member" type="member" width={ 26 } height={ 26 } />
				// 	<label>AFN Member</label>
				// </div>)
			}

			if (data.isLivingOnReserve) {
				icons.push({key: 'reserve', title: 'Living on reserve', width: 30, height: 30 })

				// icons.push(<div key="icon-reserve" className="consideration">
				// 	<OtherIcon title="Living on reserve" type="reserve" width={ 30 } height={ 30 } />
				// 	<label>Living on reserve</label>
				// </div>)
			}

			if (data.isConsideredElder) {
				icons.push({key: 'elder', title: 'Considered an elder' })

				// icons.push(<div key="icon-elder" className="consideration">
				// 	<OtherIcon title="Elder" type="elder"/>
				// 	<label>Elder</label>
				// </div>)
			}

			if (data.residesWithDisabled) {
				icons.push({key: 'disabled', title: 'Disability in household' })
			}

			if (data.requiresSupport) {
				icons.push({key: 'charity', title: 'Requires support' })
			}

			let considerationsList = <div className="considerations-list">
				<label>Considerations</label>
				<div className="considerations">{ icons.map((icon, index) => {
					const key = `icon-${ icon.key }`
					const iconProps = _.extend(_.omit(icon, 'key'), { type: icon.key })

					return <div key={ key } className="consideration">
						<OtherIcon { ...iconProps }/>
						<label>{ icon.title }</label>
					</div>
				}) }</div>
			</div>

			infoContent = <div id="admin-content" style={{textAlign: 'left'}}>
				<h2>{ formTitle }</h2>
				<div className="btn status-btn pending">Pending<i className="fa fa-angle-down"/></div>
				<div className="form-group">
					{ formRows }
				</div>
				{ individualsTable }
				<div className="form-group">
					{ bottomRows }
				</div>
				{ considerationsList }
			</div>
		}

		return <div id="admin">
			<Sidebar onSelect={ goHome } />
			<div id="app-content">{ infoContent }</div>
		</div>
	}
}

export default AdminForm