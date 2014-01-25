/** @jsx React.DOM */
var List = React.createClass({
	render: function () {
		return (
			<ul>
             {this.props.emails.map(function (email, i) {
				return (
					<MailItem
						key={i}
						email={email}
						onClick={this.props.onEmailSelected.bind(null, email)}
						selected={this.props.selected === email}
					/>
					);
				}, this)}
			</ul>
			);
	}
});

var MailItem = React.createClass({
	render: function () {
		console.log('MailItem.render', this.props);
		var email = this.props.email;
		var classes = 'message';
		if (this.props.selected) {
			classes += ' selected';
		}

		return this.transferPropsTo(
			<li className={classes} >
				<h2 className="subject">{email.subject}</h2>
				<h3 className="from">
					"{this.props.email.from[0].name}" &lt;{email.from[0].address}&gt;
				</h3>
				<div className="date">{email.headers.date}</div>
			</li>
			);
	}
});

var Details = React.createClass({
	render: function () {
		return <div>
			{this.props.email && this.props.email.headers.date}
		</div>;
	}
});