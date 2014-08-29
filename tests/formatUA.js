'use strict';
var test = require('tape'),
		formatUA = require('../formatUA');

test('formatUA', function(t) {
	t.equals(formatUA(''), 'Other');
	t.equals(formatUA('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'), 'Chrome 37');
	t.equals(formatUA('Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2049.0 Safari/537.36'), 'Chrome 37 (Windows 8.1)');
	t.equals(formatUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71'), 'Safari 7 (Mac OS X 10.9)');
	t.end();
});
