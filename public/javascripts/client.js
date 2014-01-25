var EmailCollection = Backbone.Collection.extend({
	model: Backbone.DeepModel,
	initialize: function () {
		this.bind('activate', this.onActivate);
	},
	onActivate: function (model) {
		this.active = model;
	}
});

var LineView = Backbone.View.extend({
	tagName: 'tr',
	bindings: {
		'.subject': 'subject',
		'.date': 'headers.date',
		'.from': 'headers.from',
		'.to': 'headers.to'
	},
	events: {
		'click': 'activate'
	},
	render: function () {
		console.log(this.model.toJSON());
		if (this.model.collection.active &&
			this.model.collection.active.cid === this.model.cid) {
			this.$el.addClass('active-mail');
		}
		this.$el.html('<td class="to"/>' +
			'<td class="from"/>' +
			'<td class="subject"/>' +
			'<td class="date"/>');
		this.stickit();
		return this;
	},
	activate: function () {
		this.model.collection.trigger('activate', this.model);
	}
});

var ListView = Backbone.View.extend({
	initialize: function () {
		_.bindAll(this, 'renderOne');
		this.subviews = [];
		this.listenTo(this.collection, 'add', this.renderOne);
		this.listenTo(this.collection, 'activate', this.render);
	},
	render: function () {
		_.each(this.subviews, function (view) {
			view.remove();
		});
		this.collection.each(this.renderOne);
	},
	renderOne: function (model) {
		console.log('renderOne	', model.cid);
		var view = new LineView({model: model});
		this.$el.append(view.render().$el);
		this.subviews.push(view);
	}
});

var DetailsView = Backbone.View.extend({
	initialize: function (options) {
		this.listenTo(this.collection, 'activate', this.render);
	},
	bindings: {
		'.html': 'html',
		'.text': 'text'
	},
	render: function () {
		var active = this.collection.active;
		if (!active) return;
		var tmpl = _.template('<%- data %>',
			{ data: JSON.stringify(active.toJSON(), null, '  ') });

		this.$el.html(tmpl);
		return this;
	}
});

var app = (function () {
	window.emails = new EmailCollection();
	var listView = new ListView({
		collection: window.emails,
		el: $('tbody')
	});
	listView.render();

	var detailsView = new DetailsView({
		collection: window.emails,
		el: $('.details')
	});
	detailsView.render();

	var sockets = io.connect();
	sockets.on('got_mail', function (msg) {
		window.emails.add(msg);
		console.log(msg);
	});
})();