import React from 'react'
import ClassNames from 'classnames'

class StatusButton extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			showMenu: false
		}
	}

	render() {
		const {status, onApprove, onReject} = this.props

		const approve = () => {
			this.setState({showMenu: false})
			onApprove()
		}

		const reject = () => {
			this.setState({showMenu: false})
			onReject()
		}

		let statusMenu = null

		if (this.state.showMenu) {
			statusMenu = <div className="status-menu">
				<div className="menu-item approve" onClick={ approve }>Approve</div>
				<div className="menu-item reject" onClick={ reject }>Reject</div>
			</div>
		}

		const showMenu = (event) => {
			if (status != "Pending") {
				return
			}
			
			if (event.target.className.indexOf('menu-item') >= 0) {
				return
			}
			
			this.setState({showMenu: !this.state.showMenu})
		}

		const className = ClassNames('btn', 'status-btn', status.toLowerCase())

		return <div className={ className } onClick={ showMenu }>{ status }<i className="fa fa-angle-down"/>{ statusMenu }</div>
	}
}

export default StatusButton