'use strict';
var TAPE = function(baseReporterDecorator, formatError) {
	baseReporterDecorator(this);

	this.onRunStart = function() {
		this.suites = {};
		this.total = 0;
		this.failures = 0;
		this.skips = 0;
		this.idx = 1;
		this.write('TAP version 13\n');
	};

	this.onBrowserStart = function(browser) {
		this.suites[browser.id] = {
			name: browser.name,
			specs: []
		};
	};

	this.onBrowserComplete = function(browser) {
		var suite = this.suites[browser.id];

		if (!suite) {
			// Browser timed out during the state phase.
			return;
		}

		this.write('# ' + suite.name + '\n');

		suite.specs.forEach(function(spec) {
			var msg = [
					spec.result,
					this.idx++
				];

			if (spec.skipped) {
				msg.push('# skip');
			}

			msg.push(
				spec.suite.join(' '),
				'—',
				spec.description
			);

			this.write(msg.join(' ') + '\n');

			if (spec.failures) {
				this.write('  ---\n');
				spec.failures.forEach(function(failure) {
					this.write(failure);
				}, this);
				this.write('  ...\n');
			}
		}, this);

		this.total += suite.specs.length;
	};

	this.specSuccess = function(browser, result) {
		var suite = this.suites[browser.id];
		suite.specs.push({
			description: result.description,
			suite: result.suite,
			result: 'ok'
		});
	};

	this.specFailure = function(browser, result) {
		var suite = this.suites[browser.id];
		var spec = {
			description: result.description,
			suite: result.suite,
			failures: [],
			result: 'not ok'
		};

		result.log.forEach(function(err) {
			spec.failures.push(formatError(err, '    '));
		});

		suite.specs.push(spec);
		this.failures++;
	};

	this.specSkipped = function(browser, result) {
		var suite = this.suites[browser.id];
		suite.specs.push({
			description: result.description,
			suite: result.suite,
			result: 'ok',
			skipped: true
		});
		this.skips++;
	};

	this.onRunComplete = function() {
		this.write('\n1..' + this.total + '\n');
		this.write('# tests ' + this.total + '\n');
		this.write('# pass ' + (this.total - this.failures) + '\n');
		if (this.skips) {
			this.write('# skip ' + this.skips + '\n');
		}
		this.write('# fail ' + this.failures + '\n');

		if (!this.failures) {
			this.write('# ok');
		}
	};
};

TAPE.$inject = ['baseReporterDecorator', 'formatError'];

module.exports = {
	'reporter:tape': ['type', TAPE]
};
