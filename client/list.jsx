/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	render: function () {
		return (
			<div className="sidebar">
				<ul>
					{this.props.emails.map(function (email, i) {
					return (
						<MailItem
							key={i}
							email={email}
							onEmailSelected={this.props.onEmailSelected}
							selected={this.props.selected === email}
						/>
						);
					}, this)}
				</ul>
			</div>
			);
	}
});

var MailItem = React.createClass({
	render: function () {
		var email = this.props.email;
		var classes = 'message';
		var email;
		if (this.props.selected) {
			classes += ' selected';
		}

		try {
			email = <li className={classes} onClick={this.props.onEmailSelected.bind(null, email)}>
					<div className="from">
						{this.props.email.from[0].name} &lt;{email.from[0].address}&gt;
					</div>
					<div className="subject">{email.subject}</div>
					<div className="date">{email.headers.date}</div>
				</li>;
		} catch (e) {
			setTimeout(function () {
				throw e;
			});
			email = <div></div>;
		}
		return email;
	}
});
