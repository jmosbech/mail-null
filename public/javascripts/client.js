var emails = new Backbone.Collection();

var LineView = Backbone.View.extend({
	element: 'tr',
	bindings: {
		'.subject': 'subject',
		'.from': 'from.email'

	},
	render: function() {
		this.$el.html('<td class="from"></td><td class="subject"></td>');
		this.stickit();
		return this;
	}
});

var ListView = Backbone.View.extend({
	initialize: function(){
		this.subviews = [];
		this.listenTo(this.collection, 'add', this.addOne);
	},
	addOne: function(model){
		var view = new LineView({model: model});
		this.$el.append(view.render().$el);
		this.subviews.push(view);
	}
});

var sockets = io.connect();
sockets.on('got_mail',function(msg){
	emails.add(msg);
});

var app = (function(){
	var view = new ListView({collection: emails});
	view.render();
	$('tbody').append(view.$el);
})();