/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');

var filesize = require('filesize');

var getAvailableView = function(email, view) {
	if(!email) {
		return view;
	}

	if(view === 'html') {
		if(email.html) {
			return view;
		}

		view = 'text';
	}

	if(view === 'text' && email.text) {
		return view;
	}

	return 'headers';
};

module.exports = React.createClass({
	handleViewSelected: function(view) {
		this.setState({ view: view });
	},
	getInitialState: function() {
		return { view: 'html' };
	},
	componentWillReceiveProps: function(newProps){
		if(newProps.email === this.props.email) return;
		this.setState({ view: getAvailableView(newProps.email, 'html') });
	},
	render: function () {
		var email = this.props.email;

		return (
			<div className="details">
				<DetailsHeader email={email} />
				<DetailsContent email={email} view={this.state.view} />
				<DetailsFooter email={email} onViewSelected={this.handleViewSelected} />
			</div>
		);
	}
});

var DetailsContent = React.createClass({
	handleMessageEvent: function(e){
		if (!this.refs || !this.refs.iframe) return;
		var iframe = ReactDOM.findDOMNode(this.refs.iframe);
		iframe.style.height = e.data.height + 'px';
	},
	componentDidMount: function(){
		window.addEventListener('message', this.handleMessageEvent);
	},
	componentWillUnmount: function(){
		window.removeEventListener('message', this.handleMessageEvent);
	},
	componentWillReceiveProps: function(newProps) {
		if(newProps.view === this.props.view && newProps.email === this.props.email) return;
		this.handleMessageEvent({data: {height: 0}});
	},
	renderIframeContent: function(content) {
		var email = this.props.email;
		var html = '<base target="_blank" />';
		html += content;
		html += '<script>window.parent.postMessage({height: document.body.scrollHeight}, "*");/*'+email.headers['message-id']+'*/</script>';

		email.attachments.forEach(function(attachment){
			var regex = new RegExp('cid:' + attachment.contentId, 'g');
			html = html.replace(regex, "data:image/png;base64," + attachment.content);
		});

		return (
			<div className="iframe-container"><iframe
				ref="iframe"
				className="details-content"
				src={"data:text/html;charset=utf-8," + encodeURIComponent(html)}
				frameBorder="0"
				style={{height: 0}}
				scrolling="no"></iframe>
			</div>
		);
	},
	renderHtml: function() {
		return this.renderIframeContent(this.props.email.html);
	},
	renderText: function() {
		return this.renderIframeContent('<pre>' + this.props.email.text + '</pre>');
	},
	renderHeaders: function() {
		var headers = this.props.email.headers;
		var keys = Object.keys(headers);

		return (
			<div className="headers-container">
				<dl>
					{keys.map(function(key, i) {
						return (
							<span key={key}>
								<dt>{key}:</dt>
								<dd>{[].concat(headers[key]).join(', ')}</dd>
							</span>
						);
					})}
				</dl>
			</div>
		);
	},
	render: function() {
		var email = this.props.email;
		if (!email) { return <div></div>; }

		var view = this.props.view;

		if(view === 'html') {
			return this.renderHtml();
		}
		if(view === 'text') {
			return this.renderText();
		}

		return this.renderHeaders();
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
			if (!addresses || addresses.length === 0) return;
			return (
				<span>
					<dt>{label}</dt>
					<dd>
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
							<span className="attachment" key={i}>
								<a href={'data:' + att.contentType + ';base64,' + att.content}
									className="attachment-name"
									key={i}
									download={att.fileName}>
									{att.fileName}
								</a>
								<span className="attachment-size">{filesize(att.length)}</span>
							</span>
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

var DetailsFooter = React.createClass({
	onClick: function(view) {
		this.props.onViewSelected(view);
		return false;
	},
	render: function() {
		var email = this.props.email;
		if (!email) { return <div></div>; }

		var hide = function(prop) {
			return prop ? {} : { display: 'none' };
		};

		return (
			<div className="details-footer">
				<a style={hide(email.html)} onClick={this.onClick.bind(null, 'html')} href="javascript:void(0);">View HTML</a>
				<a style={hide(email.text)} onClick={this.onClick.bind(null, 'text')} href="javascript:void(0);">View text</a>
				<a onClick={this.onClick.bind(null, 'headers')} href="javascript:void(0);">View headers</a>
			</div>
		);
	}
});
