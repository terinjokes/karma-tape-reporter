'use strict';
var test = require('tape'),
		sinon = require('sinon'),
		Reporter = require('../')['reporter:tape'][1];

function formatError(error, indent) {
	return indent + error + '\n';
}

var mosaic = {id: 'id', name: 'Mosaic', fullName: 'NCSA Mosaic/1.0 (X11;SunOS 4.1.4 sun4m)'};

test('should be called even with no browsers', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 6, 'spy was called 6 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '\n1..0\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(2).args[0], '# tests 0\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(3).args[0], '# pass 0\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(4).args[0], '# fail 0\n', 'diagnostic fail count');
	t.equals(reporter.write.getCall(5).args[0], '# ok\n', 'diagnostic status');
	t.end();
});

test('should produce browser information without tests', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserStart(mosaic);
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 7, 'spy was called 7 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '# Other (Solaris)\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(2).args[0], '\n1..0\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(3).args[0], '# tests 0\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(4).args[0], '# pass 0\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(5).args[0], '# fail 0\n', 'diagnostic fail count');
	t.equals(reporter.write.getCall(6).args[0], '# ok\n', 'diagnostic status');
	t.end();
});

test('should print successful test', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserStart(mosaic);
	reporter.specSuccess(mosaic, {description: 'Success', time: 1, suite: ['SampleTest']});
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 8, 'spy was called 8 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '# Other (Solaris)\n', 'reports browser');
	t.equals(reporter.write.getCall(2).args[0], 'ok 1 Other (Solaris) :: SampleTest :: Success\n', 'reports test');
	t.equals(reporter.write.getCall(3).args[0], '\n1..1\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(4).args[0], '# tests 1\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(5).args[0], '# pass 1\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(6).args[0], '# fail 0\n', 'diagnostic fail count');
	t.equals(reporter.write.getCall(7).args[0], '# ok\n', 'diagnostic status');
	t.end();
});

test('should print unsuccessful test', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserStart(mosaic);
	reporter.specFailure(mosaic, {description: 'Failure', time: 1, suite: ['SampleTest'], log: []});
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 7, 'spy was called 7 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '# Other (Solaris)\n', 'reports browser');
	t.equals(reporter.write.getCall(2).args[0], 'not ok 1 Other (Solaris) :: SampleTest :: Failure\n', 'reports test');
	t.equals(reporter.write.getCall(3).args[0], '\n1..1\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(4).args[0], '# tests 1\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(5).args[0], '# pass 0\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(6).args[0], '# fail 1\n', 'diagnostic fail count');
	t.end();
});

test('should print skipped test', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserStart(mosaic);
	reporter.specSkipped(mosaic, {description: 'Skipped', time: 1, suite: ['SampleTest']});
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 9, 'spy was called 9 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '# Other (Solaris)\n', 'reports browser');
	t.equals(reporter.write.getCall(2).args[0], 'ok 1 # skip Other (Solaris) :: SampleTest :: Skipped\n', 'reports test');
	t.equals(reporter.write.getCall(3).args[0], '\n1..1\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(4).args[0], '# tests 1\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(5).args[0], '# pass 1\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(6).args[0], '# skip 1\n', 'diagnostic skip count');
	t.equals(reporter.write.getCall(7).args[0], '# fail 0\n', 'diagnostic fail count');
	t.equals(reporter.write.getCall(8).args[0], '# ok\n', 'diagnostic status');
	t.end();
});

test('shouldn\'t print browser if it fails to capture', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 6, 'spy was called 6 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '\n1..0\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(2).args[0], '# tests 0\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(3).args[0], '# pass 0\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(4).args[0], '# fail 0\n', 'diagnostic fail count');
	t.equals(reporter.write.getCall(5).args[0], '# ok\n', 'diagnostic status');
	t.end();
});

test('should print yaml diagnostics if included', function(t) {
	var reporter = new Reporter(function(instance) {
		instance.write = sinon.spy();
	}, formatError);

	reporter.onRunStart([]);
	reporter.onBrowserStart(mosaic);
	reporter.specFailure(mosaic, {description: 'Failure', time: 1, suite: ['SampleTest'], log: ['Test']});
	reporter.onBrowserComplete(mosaic);
	reporter.onRunComplete([]);

	t.equals(reporter.write.callCount, 10, 'spy was called 10 times');
	t.equals(reporter.write.getCall(0).args[0], 'TAP version 13\n', 'first input was TAP header');
	t.equals(reporter.write.getCall(1).args[0], '# Other (Solaris)\n', 'reports browser');
	t.equals(reporter.write.getCall(2).args[0], 'not ok 1 Other (Solaris) :: SampleTest :: Failure\n', 'reports test');
	t.equals(reporter.write.getCall(3).args[0], '  ---\n', 'prints yaml header');
	t.equals(reporter.write.getCall(4).args[0], '    Test\n', 'prints error information');
	t.equals(reporter.write.getCall(5).args[0], '  ...\n', 'prints yaml footer');
	t.equals(reporter.write.getCall(6).args[0], '\n1..1\n', 'second input contains plan count');
	t.equals(reporter.write.getCall(7).args[0], '# tests 1\n', 'diagnostic test count');
	t.equals(reporter.write.getCall(8).args[0], '# pass 0\n', 'diagnostic pass count');
	t.equals(reporter.write.getCall(9).args[0], '# fail 1\n', 'diagnostic fail count');
	t.end();
});
