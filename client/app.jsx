/** @jsx React.DOM */

var React = require('react');
var ReactDOM = require('react-dom');

var List = require('./list.jsx');
var Details = require('./details.jsx');
var Menu = require('./menu.jsx');

var App = React.createClass({
    getInitialState: function () {
        return {selected: null};
    },
    handleEmailSelected: function (email) {
        this.setState({selected: email});
    },
    removeAllEmails: function () {
        this.setState({selected: null});
        clearAllMails();
    },
    render: function () {
        return (
            <div className="app">
                <List emails={this.props.emails}
                      selected={this.state.selected}
                      onEmailSelected={this.handleEmailSelected}/>
                <Details email={this.state.selected}/>
                <Menu removeAllEmails={this.removeAllEmails}/>
            </div>);
    }
});

var socket = io.connect();
socket.on('init', init);
socket.on('got_mail', gotMail);
var emails = [];

function init(mails) {
    emails = mails;
    ReactDOM.render(<App emails={emails.slice().reverse()}/>, document.getElementById('app'));
}

function clearAllMails() {
    socket.emit('clear_all_emails');
    emails = [];
    init(emails)
}

function gotMail(mail) {
    emails.push(mail);
    init(emails);
}
