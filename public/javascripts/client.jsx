/** @jsx React.DOM */
var App = React.createClass({
	getInitialState: function () {
		console.log('getInitialState');
		return {selected: null};
	},
	handleEmailSelected: function(email) {
		this.setState({selected: email});
	},
	render: function () {
		console.log('App.render()', this.state);
		return (
			<div>
				<List emails={this.props.emails} selected={this.state.selected} onEmailSelected={this.handleEmailSelected} />
				<Details email={this.state.selected} />
			</div>);
	}
});

var socket = io.connect();
socket.on('init', init);
socket.on('got_mail', gotMail);
var emails = [];

function init (mails) {
	console.log('init', mails);
	emails = mails;
	React.renderComponent(<App emails={emails}/>, document.body);
}

function gotMail (mail) {
	console.log('got_mail', mail);
	emails.push(mail);
	init(emails);
}

