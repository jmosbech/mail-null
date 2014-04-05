/** @jsx React.DOM */

var React = require('react');

module.exports = React.createClass({
	handleMessageEvent: function(e){
		if (!this.refs || !this.refs.iframe) return;
		var iframe = this.refs.iframe.getDOMNode();
		iframe.style.height = e.data.height + 'px';
	},
	componentDidMount: function(){
		window.addEventListener('message', this.handleMessageEvent);
	},
	componentWillUnmount: function(){
		window.removeEventListener('message', this.handleMessageEvent);
	},
	componentWillReceiveProps: function(newProps){
		if(newProps.email === this.props.email) return;
		this.handleMessageEvent({data: {height: 0}});
	},
	render: function () {
		var email = this.props.email;
		var html = '';
		if (email) {
			html = email.html || '<pre>' + (email.text || '') + '</pre>';
			html += '<script>window.parent.postMessage({height: document.body.scrollHeight}, "*");/*'+email.headers['message-id']+'*/</script>';
			email.attachments.forEach(function(attachment){
				var regex = new RegExp('cid:' + attachment.contentId, 'g');
				html = html.replace(regex, "data:image/png;base64," + attachment.content);
			});
		}
		return (
			<div className="details">
				<DetailsHeader email={email} />
				{html && <div className="iframe-container"><iframe
					ref="iframe"
					className="details-content"
					src={"data:text/html;charset=utf-8," + encodeURIComponent(html)}
					frameBorder="0"
					scrolling="no"></iframe></div>}
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
		var cc = email.cc;
		var bcc = email.bcc;
		var attachments = email.attachments;

		var renderAddresses = function(addresses, label) {
			if (!addresses) return;
			return (
				<span>
					<dt>{label}</dt><dd className="to">
						{addresses.map(function (to, i) {
						 return (
							 <span className="address" key={i}>{to.name} &lt;{to.address}&gt;</span>
							);
						})}
					</dd>
				</span>
			);
		};

		var renderAttachments = function(attachments) {
			if (!attachments) return;

			return (
				<dd>
					{attachments.map(function(att, i) {
						return (
							<a href={'data:' + att.contentType + ';base64,' + att.content}
								className="attachment"
								key={i}
								download={att.fileName}>
								{att.fileName}
							</a>
						);
					})}
				</dd>
			);
		};

		return (
			<dl className="details-header">
				<dt>From:</dt><dd className="from">{from.name} &lt;{from.address}&gt;</dd>
				{renderAddresses(email.to, "To:")}
				{renderAddresses(email.cc, "Cc:")}
				{renderAddresses(email.bcc, "Bcc:")}
				<dt>Date:</dt><dd className="date">{email.headers.date}</dd>
				<dt>Subject:</dt><dd className="subject">{email.subject}</dd>
				<dt>Attachments:</dt>{renderAttachments(attachments)}
			</dl>
		);
	}
});
