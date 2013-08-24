var EmailCollection = Backbone.Collection.extend({model: Backbone.DeepModel});

var LineView = Backbone.View.extend({
	tagName: 'tr',
	bindings: {
		'.subject': 'subject',
		'.date': 'headers.date',
		'.from': 'headers.from',
		'.to': 'headers.to'
	},
	render: function() {
		this.$el.html('<td class="to"></td><td class="from"/><td class="subject"/><td class="date"/>');
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
		console.log('addOne', model.cid);
		var view = new LineView({model: model});
		this.$el.append(view.render().$el);
		this.subviews.push(view);
	}
});

var app = (function(){
	window.emails = new EmailCollection();
	var view = new ListView({
		collection: window.emails,
		el: $('tbody')
	});
	view.render();

	var sockets = io.connect();
	sockets.on('got_mail',function(msg){
		window.emails.add(msg);
		console.log(msg);
	});
})();