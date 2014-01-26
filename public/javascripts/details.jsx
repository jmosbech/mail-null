/** @jsx React.DOM */

var Details = React.createClass({
	handleMessageEvent: function(e){
		console.log('message event!', e, this.refs);
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
		console.log('componentWillReceiveProps', newProps);
		if(newProps.email === this.props.email) return;
		this.handleMessageEvent({data: {height: 0}});
	},
	render: function () {
		var email = this.props.email;
		var html = '';
		if (email) {
			console.log('updating iframe');
			html = email.html || '<pre>' + email.text + '</pre>';
			html += '<script>window.parent.postMessage({height: document.body.scrollHeight}, "*");</script>';
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
					src={"data:text/html;charset=utf-8," + escape(html)}
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

		return (
			<dl className="details-header">
				<dt>From:</dt><dd className="from">{from.name} &lt;{from.address}&gt;</dd>
				<dt>To:</dt><dd className="to">
					{email.to.map(function (to, i) {
					 return (
						 <span className="address" key={i}>{to.name} &lt;{to.address}&gt;</span>
						);
					}, this)}
				</dd>
				<dt>Date:</dt><dd className="date">{email.headers.date}</dd>
				<dt>Subject:</dt><dd className="subject">{email.subject}</dd>
			</dl>
		);
	}
});