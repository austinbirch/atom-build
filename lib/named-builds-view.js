'use strict';

var SelectListView = require('atom-space-pen-views').SelectListView;
var cscompatability = require('./cscompatability');

module.exports = (function() {
	function NamedBuildsView(buildNames) {
		SelectListView.apply(this, arguments);
		this.buildNames = buildNames;
	}

	cscompatability.extends(NamedBuildsView, SelectListView);

	NamedBuildsView.prototype.show = function(cb) {
		this.panel = atom.workspace.addModalPanel({
			item: this
		});
		this.callback = cb;
		this.panel.show();
		this.setItems(this.buildNames);
		this.focusFilterEditor();
	};

	NamedBuildsView.prototype.hide = function () {
		this.panel.hide();
	};

	NamedBuildsView.prototype.viewForItem = function(buildName) {
		return NamedBuildsView.render(function() {
			this.li(buildName);
		});
	};

	NamedBuildsView.prototype.confirmed = function(build) {
		this.callback(build);
	};

	NamedBuildsView.prototype.cancelled = function() {
		this.hide();
	};

	return NamedBuildsView;
})();
