/** @jsx React.DOM */

var Details = React.createClass({
	render: function () {
		var email = this.props.email;
		var html = '';
		if (email) {
			html = email.html || '<pre>' + email.text + '</pre>';
			email.attachments.forEach(function(attachment){
				var regex = new RegExp('cid:' + attachment.contentId, 'g');
				html = html.replace(regex, "data:image/png;base64," + attachment.content);
			});
		}
		return (
			<div className="details">
				<DetailsHeader email={email} />
				<br/>
				{html && <iframe src={"data:text/html;charset=utf-8," + escape(html)}></iframe>}
			</div>
			);
	}
});

var DetailsHeader = React.createClass({
	render: function(){
			var email = this.props.email;
			if (!email) { return <div></div>; }
			var from = email.from[0];
			var to = email.to;

		return (
			<div className="details-header">
				<span className="from">{from.name} &lt;{from.address}&gt;</span>
				<span className="subject">{email.subject}</span>
				<span className="date">{email.headers.date}</span>
				<span className="to">
					{email.to.map(function (to, i) {
					 return (
						 <span key={i}>{to.name} &lt;{to.address}&gt;;</span>
						);
					}, this)}
					{email.to}
				</span>
			</div>
		);
	}
});