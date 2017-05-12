require('babel-polyfill')

import {Component, default as React} from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'
import AdminList from './admin/AdminList'
import AdminForm from './admin/AdminForm'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

class App extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return <div id="app">{ this.props.children }</div>
	}
}

ReactDOM.render(<Router history={ browserHistory }>
	<Route path="/" component={ App }>
		<IndexRoute component={ Form }/>
		<Route path="form/:shortid" component={ Form } />
		<Route path="admin">
			<Route path="form/:formId" component={ AdminForm }/>
			<IndexRoute component={ AdminList }/>
		</Route>
	</Route>
</Router>, document.getElementById('content'))
