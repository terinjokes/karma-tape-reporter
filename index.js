'use strict';
var formatUA = require('./formatUA');
var yaml = require('js-yaml');
var indent = require('indent-string');
var printf = require('printf');

var colors = {
	black: '\x1b[30m',
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m',
	white: '\x1b[37m',
	default: '\x1b[39m',
};

var TAPE = function(baseReporterDecorator, formatError) {
	baseReporterDecorator(this);

	this.onRunStart = function() {
		this.suites = {};
		this.total = 0;
		this.failures = 0;
		this.skips = 0;
		this.idx = 1;
		this.writeln('TAP version 13');
	};

	this.onBrowserStart = function(browser) {
		this.suites[browser.id] = {
			name: formatUA(browser.fullName),
			specs: []
		};
	};

	this.onBrowserComplete = function(browser) {
		var suite = this.suites[browser.id];

		if (!suite) {
			// Browser timed out during the state phase.
			return;
		}

		this.writeln(printf('# %s', suite.name));

		suite.specs.forEach(function(spec) {
			var properties = {
				status: spec.result,
				index: this.idx++,
				browser: suite.name,
				suites: spec.suite.join(' '),
				description: spec.description
			};

			this.writeln(printf('%(status)s %(index)d ' + (spec.skipped ? '# skip ' : '') + '%(browser)s :: %(suites)s :: %(description)s', properties));

			if (spec.failures && spec.failures.length > 0) {
				this.writeln('  ---');
				this.writeln(indent(yaml.safeDump({
					failures: spec.failures
				}), ' ', 4));
				this.writeln('  ...');
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
			spec.failures.push(formatError(err, ''));
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
		this.writeln(printf('\n1..%d', this.total));
		this.writeln(printf('# tests %d', this.total), colors.cyan);
		this.writeln(printf('# pass %d', this.total - this.failures), colors.green);
		if (this.skips) {
			this.writeln(printf('# skip %d', this.skips), colors.yellow);
		}
		this.writeln(printf('# fail %d', this.failures), colors.red);

		if (!this.failures) {
			this.writeln('# ok');
		}
	};

	this.writeln = function(str, color = colors.default) {
		return this.write(color , str + '\n', '\x1b[0m');
	};
};

TAPE.$inject = ['baseReporterDecorator', 'formatError'];

module.exports = {
	'reporter:tape': ['type', TAPE]
};
