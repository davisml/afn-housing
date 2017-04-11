import {Component, default as React} from 'react'

class CompleteView extends Component {
	render() {
		const {name} = this.props

		return <div className="completeView">
			<div className="envelope">
				<div className="recipient">{ name }</div>
			</div>
			<div>Thank you for submitting your application.<br/>We’ll notify you by email once it has been processed.</div>
		</div>
	}
}

CompleteView.defaultProps = {
	name: ''
}

export default CompleteView