/** @jsx React.DOM */
var App = React.createClass({
	getInitialState: function () {
		return {selected: null};
	},
	handleEmailSelected: function(email) {
		this.setState({selected: email});
	},
	render: function () {
		return (
			<div>
				<List emails={this.props.emails} 
					selected={this.state.selected} 
					onEmailSelected={this.handleEmailSelected} />
				<Details email={this.state.selected} />
			</div>);
	}
});

var socket = io.connect();
socket.on('init', init);
socket.on('got_mail', gotMail);
var emails = [];

function init (mails) {
	emails = mails;
	React.renderComponent(<App emails={emails.reverse()}/>, document.body);
}

function gotMail (mail) {
	emails.push(mail);
	init(emails);
}

