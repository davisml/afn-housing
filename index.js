'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Form = require('./Form');

var _Form2 = _interopRequireDefault(_Form);

var _AdminList = require('./admin/AdminList');

var _AdminList2 = _interopRequireDefault(_AdminList);

var _AdminForm = require('./admin/AdminForm');

var _AdminForm2 = _interopRequireDefault(_AdminForm);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('babel-polyfill');

var App = function (_Component) {
	_inherits(App, _Component);

	function App(props) {
		_classCallCheck(this, App);

		return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));
	}

	_createClass(App, [{
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				'div',
				{ id: 'app' },
				this.props.children
			);
		}
	}]);

	return App;
}(_react.Component);

_reactDom2.default.render(_react2.default.createElement(
	_reactRouter.Router,
	{ history: _reactRouter.browserHistory },
	_react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: App },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: _Form2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'form/:shortid', component: _Form2.default }),
		_react2.default.createElement(
			_reactRouter.Route,
			{ path: 'admin' },
			_react2.default.createElement(_reactRouter.Route, { path: 'form/:formId', component: _AdminForm2.default }),
			_react2.default.createElement(_reactRouter.IndexRoute, { component: _AdminList2.default })
		)
	)
), document.getElementById('content'));
