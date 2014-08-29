'use strict';
var useragent = require('useragent');

module.exports = function formatUA(str) {
	var UA = useragent.parse(str);
	var output = UA.family;

	if (UA.major && UA.major > 0) {
		output += ' ' + UA.major;
	}

	if (UA.os && UA.os.family && UA.os.family !== 'Other') {
		output += ' (' + UA.os.family;

		if (UA.os.major) {
			output += ' ' + UA.os.major;

			/* istanbul ignore else: I don't know how to get useragent to have an OS major without an OS minor */
			if (UA.os.minor) {
				output += '.' + UA.os.minor;
			}
		}

		output += ')';
	}

	return output;
};

