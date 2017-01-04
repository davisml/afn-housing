require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import FormComponent from './FormComponent'
import {Map, List} from 'immutable'
import ClassNames from 'classnames'

class AppComponent extends React.Component {
	constructor(props) {
		super(props)

		const numberOfIndividuals = 2
		const numberOfDisabledIndividuals = 1

		this.state = {
			data: new Map({
				isMember: false,
				firstName: '',
				lastName: '',
				email: '',
				telephone: '',
				location: 0,
				currentLivingConditions: '',
				isLivingOnReserve: false,
				isConsideredElder: false,
				residesWithDisabled: false,
				requiresSupport: false,
				numberOfDisabledIndividuals,
				additionalInformation: '',
				numberOfIndividuals,
				individuals: this.initList(new List(), numberOfIndividuals),
				disabledIndividuals: this.initDisabledList(new List(), numberOfDisabledIndividuals),
				currentStep: 0
			})
		}
	}

	initDisabledList(individuals, size) {
		return individuals.setSize(size).map((individual) => {
			if (!individual) {
				return new Map({
					name: '',
					age: '',
					relationship: 'child',
					disability: 0
				})
			}

			return individual
		})
	}

	initList(individuals, size) {
		return individuals.setSize(size).map((individual) => {
			if (!individual) {
				return new Map({
					name: '',
					age: '',
					relationship: 'child'
				})
			}

			return individual
		})
	}

	render() {
		const handleChange = (data) => {
			let newData = data

			const numberOfIndividuals = data.get('numberOfIndividuals')
			const numberOfDisabledIndividuals = data.get('numberOfDisabledIndividuals')

			if (numberOfIndividuals != this.state.data.get('numberOfIndividuals')) {
				newData = newData.update('individuals', (individuals) => {
					return this.initList(individuals, numberOfIndividuals)
				})
			}

			if (numberOfDisabledIndividuals != this.state.data.get('numberOfDisabledIndividuals')) {
				newData = newData.update('disabledIndividuals', (individuals) => {
					return this.initDisabledList(individuals, numberOfIndividuals)
				})
			}

			this.setState({ data: newData })
		}

		const {data} = this.state
		const currentStep = data.get('currentStep')
		const steps = ['Contact', 'Membership', 'Residents', 'Location']

		const renderStep = (step, index) => {
			const key = `step-${ index }`
			const active = (index === currentStep)
			const className = ClassNames('step', {active})

			return <div key={ key } className={ className }>{ step }</div>
		}

		return <div id="form">
			<div className="sidebar">
				<div className="sidebar-wrapper">
					<img src="/images/afn-logo.png"/>
					<div className="steps">
						{ steps.map(renderStep) }
					</div>
				</div>
			</div>
			<div className="content">
				<FormComponent data={ this.state.data } onChange={ handleChange } />
			</div>
		</div>
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
