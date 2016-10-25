var React = require('react');
var filesize = require('filesize');


var Menu = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return (
            <div className="menu">
                <ul>
                    <button className="warn" type="button" onClick={() => {
                        console.log('click');
                        this.props.removeAllEmails();
                    }}>Remove all mails
                    </button>
                </ul>
            </div>
        );
    }
});


module.exports = Menu;


