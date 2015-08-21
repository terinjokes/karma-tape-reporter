'use strict';
var fs = require('fs');
var formatUA = require('./formatUA');
var yaml = require('js-yaml');
var indent = require('indent-string');
var printf = require('printf');

var TAPE = function(baseReporterDecorator, formatError, config) {
	baseReporterDecorator(this);

	this.onRunStart = function() {
		this.suites = {};
		this.total = 0;
		this.failures = 0;
		this.skips = 0;
		this.idx = 1;

		if (config && config.outputFile) {
			this.outputStream = fs.createWriteStream(config.outputFile, config.outputFileOptions || {
				flags: 'w',
				encoding: 'utf8',
				mode: '0664'
			});
		}

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
			this.writeln(printf('%(status)s %(index)d%(skipOrSpace)s%(browser)s :: %(suites)s :: %(description)s', {
				status: spec.result,
				index: this.idx++,
				skipOrSpace: (spec.skipped ? ' # skip ' : ' '),
				browser: suite.name,
				suites: spec.suite.join(' '),
				description: spec.description
			}));

			if (spec.failures && spec.failures.length > 0) {
				this.writeln('  ---');
				this.writeln(indent(yaml.safeDump({ failures: spec.failures }), ' ', 4));
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

		spec.failures = result.log.map(function(err) {
			return formatError(err, '');
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
		this.writeln(printf('# tests %d', this.total));
		this.writeln(printf('# pass %d', this.total - this.failures));
		if (this.skips) {
			this.writeln(printf('# skip %d', this.skips));
		}
		this.writeln(printf('# fail %d', this.failures));

		if (!this.failures) {
			this.writeln('# ok');
		}

		if (this.outputStream) {
			this.outputStream.end();
		}
	};

	this.writeln = function(str) {
		if (this.outputStream) {
			this.outputStream.write(str);
			this.outputStream.write('\n');
		}
		return this.write(str + '\n');
	};
};

TAPE.$inject = ['baseReporterDecorator', 'formatError', 'config.tapeReporter'];

module.exports = {
	'reporter:tape': ['type', TAPE]
};
